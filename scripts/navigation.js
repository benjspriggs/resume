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
    const mainMenuPhantom = mainMenu.cloneNode(true);
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
     * @param {Object}
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
          setTimeout(function () {
            mainMenu.classList.remove(options.animationClass);
            resolve(true);
          }, 750);
        }
      });
    };

    function open() {
      console.time("open (inner)");
      return toggle({
        add: "open",
        remove: "closed",
        animationClass: "opening"
      })
        .then(function () {
          isOpen = true;
          console.timeEnd("open (inner)");
        });
    };

    function close() {
      console.time("close (inner)");
      return toggle({
        add: "close",
        remove: "open",
        animationClass: "closing"
      })
        .then(function () {
          isOpen = false;
          console.timeEnd("close (inner)");
        });
    };

    /**
     * @type {Promise}
     */
    let activeAction = null;
    let isOpenActionActive = false;
    let isCloseActionActive = false;

    function clearActiveActions() {
      console.time("clearing active actions");
      activeAction = null;
      isOpenActionActive = false;
      isCloseActionActive = false;
      console.timeEnd("clearing active actions");
    };

    return {
      open: function () {
        if (isOpen) return;
        if (isOpenActionActive) return;

        console.time("open (outer)");

        this.detach();

        isOpenActionActive = true;

        if (activeAction) {
          activeAction.then(open);
        } else {
          activeAction = open().finally(clearActiveActions);
        }

        console.timeEnd("open (outer)");
      },
      close: function () {
        if (!isOpen) return;
        if (isCloseActionActive) return;

        console.time("close (outer)");

        isCloseActionActive  = true;

        if (activeAction) {
          activeAction.then(close);
        } else {
          activeAction = close().finally(clearActiveActions);
        }

        console.timeEnd("close (outer)");
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
        window.requestAnimationFrame(function () {
          isOpen = !isSmallScreen();
          addPhantomToDOM();
          mainMenu.classList.add("detached");
        });
      }
    };
  })();

  let lastPageY = window.scrollY;
  let currentPageY = lastPageY;
  let shouldUseScrollVisibility = !isSmallScreen();

  /**
   * 
   * @param {MouseEvent} event 
   */
  function determineScrollDirection() {
    console.log("determine");
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

    console.log("onscroll");

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
    button.onclick = function () {
      menu.toggle();
    }
  });
})();

