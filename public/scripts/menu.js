function isSmall() {
    return document.documentElement.clientWidth <= 1000;
}
function memoized(initialValue, updateListener) {
    let lastValue = initialValue;
    updateListener((updatedValue) => (lastValue = updatedValue));
    return function () {
        return lastValue;
    };
}
export const isSmallScreen = memoized(isSmall(), (update) => {
    window.addEventListener("resize", function () {
        update(isSmall());
    });
});
export class Menu {
    constructor(element) {
        this.element = element;
        this.isOpen = !isSmallScreen();
        this.activeAction = null;
        this.animationTimerHandle = null;
        this.elementPhantom = element.cloneNode(true);
        this.elementPhantom.id = "";
        this.elementPhantom.classList.add("phantom");
    }
    open() {
        if (this.isOpen) {
            return;
        }
        if (this.animationTimerHandle) {
            return;
        }
        this.detach();
        if (this.activeAction) {
            this.activeAction.then(() => {
                this.open();
            });
        }
        else {
            this.activeAction = this.openMenu().finally(() => {
                this.clearActiveActions();
            });
        }
    }
    close() {
        if (!this.isOpen)
            return;
        if (this.animationTimerHandle)
            return;
        this.detach();
        if (this.activeAction) {
            this.activeAction.then(close);
        }
        else {
            this.activeAction = this.closeMenu().finally(() => this.clearActiveActions());
        }
    }
    toggle() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    reset() {
        window.requestAnimationFrame(() => {
            this.removePhantomFromDOM();
            this.element.classList.remove("detached", "open", "opening", "closed", "closing");
        });
    }
    attach() {
        window.requestAnimationFrame(() => {
            this.removePhantomFromDOM();
            this.element.classList.remove("detached");
        });
    }
    detach() {
        if (this.element.classList.contains("detached")) {
            this.isOpen = this.element.classList.contains("open");
        }
        else {
            this.isOpen = !isSmallScreen();
        }
        this.addPhantomToDOM();
        this.element.classList.add("detached");
    }
    /**
     * Toggles the expanded/ collapsed state for the menu. Not supported for small screens.
     */
    toggleMenuState(options) {
        return new Promise((resolve) => {
            this.element.classList.remove(options.remove);
            this.element.classList.add(options.add);
            if (isSmallScreen()) {
                resolve();
            }
            else {
                this.element.classList.add(options.animationClass);
                this.animationTimerHandle = setTimeout(() => {
                    this.element.classList.remove(options.animationClass);
                    this.animationTimerHandle = null;
                    resolve();
                }, 750);
            }
        });
    }
    /** Open the menu. */
    async openMenu() {
        await this.toggleMenuState({
            add: "open",
            remove: "closed",
            animationClass: "opening",
        });
        this.isOpen = true;
    }
    /** Closes the menu. */
    async closeMenu() {
        await this.toggleMenuState({
            add: "closed",
            remove: "open",
            animationClass: "closing",
        });
        this.isOpen = false;
    }
    clearActiveActions() {
        this.activeAction = null;
        this.animationTimerHandle = null;
    }
    removePhantomFromDOM() {
        if (this.elementPhantom.parentElement) {
            this.elementPhantom.parentElement.removeChild(this.elementPhantom);
        }
    }
    addPhantomToDOM() {
        if (!this.elementPhantom.parentElement) {
            this.element.parentElement.insertBefore(this.elementPhantom, this.element.nextSibling);
        }
    }
}
