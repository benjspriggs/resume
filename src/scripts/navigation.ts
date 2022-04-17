interface MenuToggleOptions {
  /** Class to remove from the menu's class list. */
  remove: string;
  /** Class to add from the menu's class list. */
  add: string;
  /** Class to add as an animation while toggling between different states. */
  animationClass: string;
}

(function () {
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

  const menu = (function () {
    const mainMenu = document.getElementById("main-menu");
    const mainMenuPhantom = mainMenu.cloneNode(true) as HTMLAnchorElement;
    let isOpen = !isSmallScreen();

    mainMenuPhantom.id = "";
    mainMenuPhantom.classList.add("phantom");

    function removePhantomFromDOM() {
      if (mainMenuPhantom.parentElement) {
        mainMenuPhantom.parentElement.removeChild(mainMenuPhantom);
      }
    }

    function addPhantomToDOM() {
      if (!mainMenuPhantom.parentElement) {
        mainMenu.parentElement.insertBefore(
          mainMenuPhantom,
          mainMenu.nextSibling
        );
      }
    }

    /**
     * Toggles the expanded/ collapsed state for the menu. Not supported for small screens.
     */
    function toggle(options: MenuToggleOptions) {
      return new Promise<void>(function (resolve) {
        mainMenu.classList.remove(options.remove);
        mainMenu.classList.add(options.add);

        if (isSmallScreen()) {
          resolve();
        } else {
          mainMenu.classList.add(options.animationClass);
          animationTimerHandle = setTimeout(function () {
            mainMenu.classList.remove(options.animationClass);
            animationTimerHandle = null;
            resolve();
          }, 750);
        }
      });
    }

    /** Open the menu. */
    async function open(): Promise<void> {
      await toggle({
        add: "open",
        remove: "closed",
        animationClass: "opening",
      });
      isOpen = true;
    }

    /** Closes the menu. */
    async function close() {
      await toggle({
        add: "closed",
        remove: "open",
        animationClass: "closing",
      });
      isOpen = false;
    }

    let activeAction: Promise<void> = null;
    let animationTimerHandle = null;

    function clearActiveActions() {
      activeAction = null;
      animationTimerHandle = null;
    }

    return {
      open: function () {
        if (isOpen) return;
        if (animationTimerHandle) return;

        this.detach();

        if (activeAction) {
          activeAction.then(open);
        } else {
          activeAction = open().finally(clearActiveActions);
        }
      },
      close: function () {
        if (!isOpen) return;
        if (animationTimerHandle) return;

        this.detach();

        if (activeAction) {
          activeAction.then(close);
        } else {
          activeAction = close().finally(clearActiveActions);
        }
      },
      toggle: function () {
        if (isOpen) {
          this.close();
        } else {
          this.open();
        }
      },
      reset: function () {
        window.requestAnimationFrame(function () {
          removePhantomFromDOM();
          mainMenu.classList.remove(
            "detached",
            "open",
            "opening",
            "closed",
            "closing"
          );
        });
      },
      attach: function () {
        window.requestAnimationFrame(function () {
          removePhantomFromDOM();
          mainMenu.classList.remove("detached");
        });
      },
      detach: function () {
        if (mainMenu.classList.contains("detached")) {
          isOpen = mainMenu.classList.contains("open");
        } else {
          isOpen = !isSmallScreen();
        }

        addPhantomToDOM();
        mainMenu.classList.add("detached");
      },
    };
  })();

  let lastPageY = window.scrollY;
  let currentPageY = lastPageY;
  let shouldUseScrollVisibility = !isSmallScreen();

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
