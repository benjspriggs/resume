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
    const mainMenuPhantom =
      (/** @type {HTMLElement} */
        (mainMenu.cloneNode(true)));
    let isOpen = !isSmallScreen();

    mainMenuPhantom.id = "";
    mainMenuPhantom.classList.add("phantom");

    function removePhantomFromDOM() {
      if (mainMenuPhantom.parentElement) {
        mainMenuPhantom.parentElement.removeChild(mainMenuPhantom);
      }
    };

    function addPhantomToDOM() {
      if (!mainMenuPhantom.parentElement) {
        mainMenu.parentElement.insertBefore(mainMenuPhantom, mainMenu.nextSibling);
      }
    };

    /**
     * @param {Object} options
     * @param {string} options.remove
     * @param {string} options.add
     * @param {string} options.animationClass
     */
    function toggle(options) {
      return new Promise(function (resolve) {
        mainMenu.classList.remove(options.remove);
        mainMenu.classList.add(options.add);

        if (isSmallScreen()) {
          resolve(true);
        } else {
          mainMenu.classList.add(options.animationClass);
          animationTimerHandle = setTimeout(function () {
            mainMenu.classList.remove(options.animationClass);
            animationTimerHandle = null;
            resolve(true);
          }, 750);
        }
      });
    };

    function open() {
      return toggle({
        add: "open",
        remove: "closed",
        animationClass: "opening"
      })
        .then(function () {
          isOpen = true;
        });
    };

    function close() {
      return toggle({
        add: "closed",
        remove: "open",
        animationClass: "closing"
      })
        .then(function () {
          isOpen = false;
        });
    };

    /**
     * @type {Promise}
     */
    let activeAction = null;
    let animationTimerHandle = null;

    function clearActiveActions() {
      activeAction = null;
      animationTimerHandle = null;
    };

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
          mainMenu.classList.remove("detached", "open", "opening", "closed", "closing");
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
      }
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
    };

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
    const smallScreenQuery = window.matchMedia("screen and (max-width: 1000px)");

    smallScreenQuery.addListener(function (event) {
      shouldUseScrollVisibility = !event.matches;
    });
  }

  const toggleButtons = document.getElementsByClassName("toggle-menu-visiblity")

  Array.from(toggleButtons).forEach(function (button) {
    button.addEventListener('click', function () {
      menu.toggle();
    });
  });
})();

