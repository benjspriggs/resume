interface MenuToggleOptions {
  /** Class to remove from the menu's class list. */
  remove: string;
  /** Class to add from the menu's class list. */
  add: string;
  /** Class to add as an animation while toggling between different states. */
  animationClass: string;
}

(function () {
  class Menu {
    private isOpen = !isSmallScreen();
    private activeAction: Promise<void> = null;
    private animationTimerHandle: number | null = null;
    private elementPhantom: HTMLAnchorElement;

    constructor(private readonly element: HTMLAnchorElement) {
      const mainMenuPhantom = mainMenu.cloneNode(true) as HTMLAnchorElement;

      mainMenuPhantom.id = "";
      mainMenuPhantom.classList.add("phantom");
    }

    open() {
      if (this.isOpen) return;
      if (this.animationTimerHandle) return;

      this.detach();

      if (this.activeAction) {
        this.activeAction.then(this.open);
      } else {
        this.activeAction = this.openMenu().finally(this.clearActiveActions);
      }
    }

    close() {
      if (!this.isOpen) return;
      if (this.animationTimerHandle) return;

      this.detach();

      if (this.activeAction) {
        this.activeAction.then(close);
      } else {
        this.activeAction = this.closeMenu().finally(this.clearActiveActions);
      }
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    reset() {
      window.requestAnimationFrame(function () {
        this.removePhantomFromDOM();
        this.element.classList.remove(
          "detached",
          "open",
          "opening",
          "closed",
          "closing"
        );
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
      } else {
        this.isOpen = !isSmallScreen();
      }

      this.addPhantomToDOM();
      this.element.classList.add("detached");
    }

    /**
     * Toggles the expanded/ collapsed state for the menu. Not supported for small screens.
     */
    private toggleMenuState(options: MenuToggleOptions) {
      return new Promise<void>(function (resolve) {
        this.element.classList.remove(options.remove);
        this.element.classList.add(options.add);

        if (isSmallScreen()) {
          resolve();
        } else {
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
    private async openMenu(): Promise<void> {
      await this.toggleMenuState({
        add: "open",
        remove: "closed",
        animationClass: "opening",
      });
      this.isOpen = true;
    }

    /** Closes the menu. */
    private async closeMenu() {
      await this.toggleMenuState({
        add: "closed",
        remove: "open",
        animationClass: "closing",
      });
      this.isOpen = false;
    }

    private clearActiveActions() {
      this.activeAction = null;
      this.animationTimerHandle = null;
    }

    private removePhantomFromDOM() {
      if (this.elementPhantom.parentElement) {
        this.elementPhantom.parentElement.removeChild(this.elementPhantom);
      }
    }

    private addPhantomToDOM() {
      if (!this.elementPhantom.parentElement) {
        this.element.parentElement.insertBefore(
          this.elementPhantom,
          this.element.nextSibling
        );
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
  const mainMenu = document.getElementById("main-menu") as HTMLAnchorElement;
  const menu = new Menu(mainMenu);

  function determineScrollDirection() {
    if (currentPageY > lastPageY) {
      menu.close();
    } else {
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
      } else {
        menu.attach();
      }
    });
  };

  if (window.matchMedia) {
    const smallScreenQuery = window.matchMedia(
      "screen and (max-width: 1000px)"
    );

    smallScreenQuery.addEventListener("change", function (event) {
      shouldUseScrollVisibility = !event.matches;
    });
  }

  const toggleButtons = document.getElementsByClassName(
    "toggle-menu-visiblity"
  );

  Array.from(toggleButtons).forEach(function (button) {
    button.addEventListener("click", function () {
      menu.toggle();
    });
  });
})();
