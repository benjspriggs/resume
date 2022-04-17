(function () {
    class Menu {
        constructor(element) {
            this.element = element;
            this.isOpen = !isSmallScreen();
            this.activeAction = null;
            this.animationTimerHandle = null;
            const mainMenuPhantom = mainMenu.cloneNode(true);
            mainMenuPhantom.id = "";
            mainMenuPhantom.classList.add("phantom");
        }
        open() {
            if (this.isOpen)
                return;
            if (this.animationTimerHandle)
                return;
            this.detach();
            if (this.activeAction) {
                this.activeAction.then(this.open);
            }
            else {
                this.activeAction = this.openMenu().finally(this.clearActiveActions);
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
                this.activeAction = this.closeMenu().finally(this.clearActiveActions);
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
            window.requestAnimationFrame(function () {
                this.removePhantomFromDOM();
                this.element.classList.remove("detached", "open", "opening", "closed", "closing");
            });
        }
        attach() {
            window.requestAnimationFrame(function () {
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
            return new Promise(function (resolve) {
                this.element.classList.remove(options.remove);
                this.element.classList.add(options.add);
                if (isSmallScreen()) {
                    resolve();
                }
                else {
                    this.element.classList.add(options.animationClass);
                    this.animationTimerHandle = setTimeout(function () {
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
    const isSmallScreen = (function () {
        function isSmall() {
            return document.documentElement.clientWidth <= 1000;
        }
        let lastValue = isSmall();
        window.addEventListener("resize", function () {
            lastValue = isSmall();
        });
        return function () {
            return lastValue;
        };
    })();
    let lastPageY = window.scrollY;
    let currentPageY = lastPageY;
    let shouldUseScrollVisibility = !isSmallScreen();
    const mainMenu = document.getElementById("main-menu");
    const menu = new Menu(mainMenu);
    function determineScrollDirection() {
        if (currentPageY > lastPageY) {
            menu.close();
        }
        else {
            menu.open();
        }
    }
    window.onscroll = function () {
        if (!shouldUseScrollVisibility) {
            return;
        }
        lastPageY = currentPageY;
        currentPageY = window.scrollY;
        window.requestAnimationFrame(function () {
            if (currentPageY > 250) {
                determineScrollDirection();
            }
            else {
                menu.attach();
            }
        });
    };
    if (window.matchMedia) {
        const smallScreenQuery = window.matchMedia("screen and (max-width: 1000px)");
        smallScreenQuery.addEventListener("change", function (event) {
            shouldUseScrollVisibility = !event.matches;
        });
    }
    const toggleButtons = document.getElementsByClassName("toggle-menu-visiblity");
    Array.from(toggleButtons).forEach(function (button) {
        button.addEventListener("click", function () {
            menu.toggle();
        });
    });
})();
