(function () {
  function isSmallScreen() {
    return document.documentElement.clientWidth <= 1000;
  }

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

    function open() {
      return new Promise(function (resolve) {
        mainMenu.classList.remove("closed");
        mainMenu.classList.add("open");
        if (isSmallScreen()) {
          isOpen = true;
          resolve(true);
        } else {
          mainMenu.classList.add("opening");
          setTimeout(function () {
            mainMenu.classList.remove("opening");
            isOpen = true;
            resolve(true);
          }, 750);
        }
      });
    };

    function close() {
      return new Promise(function (resolve) {
        mainMenu.classList.remove("open");
        mainMenu.classList.add("closed");
        if (isSmallScreen()) {
          isOpen = false;
          resolve(false);
        } else {
          mainMenu.classList.add("closing");
          setTimeout(function () {
            mainMenu.classList.remove("closing");
            isOpen = false;
            resolve(false);
          }, 750);
        }
      });
    };

    /**
     * @type {Promise}
     */
    let activeAction = null;
    let isOpenActionActive = false;
    let isCloseActionActive = false;

    function clearActiveActions() {
      activeAction = null;
      isOpenActionActive = false;
      isCloseActionActive = false;
    };

    addPhantomToDOM();
    mainMenu.classList.add("detached");

    return {
      open: function () {
        if (isOpen) return;
        if (isOpenActionActive) return;

        this.detach();

        isOpenActionActive = true;

        if (activeAction) {
          activeAction.then(open);
        } else {
          activeAction = open().finally(clearActiveActions);
        }
      },
      close: function () {
        if (!isOpen) return;
        if (isCloseActionActive) return;

        isCloseActionActive  = true;

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
        removePhantomFromDOM();
        mainMenu.classList.remove("detached", "open", "opening", "closed", "closing");
      },
      attach: function () {
        removePhantomFromDOM();
        mainMenu.classList.remove("detached");
      },
      detach: function () {
        isOpen = !isSmallScreen();
        mainMenu.classList.add("detached");
      }
    };
  })();

  let lastPageY = 0;
  let shouldUseScrollVisibility = !isSmallScreen();

  /**
   * 
   * @param {MouseEvent} event 
   */
  function determineScrollDirection() {
    if (window.scrollY > lastPageY) {
      menu.close();
    } else {
      menu.open();
    }

    lastPageY = window.scrollY;
  }

  window.onscroll = function () {
    if (shouldUseScrollVisibility) {
      if (window.scrollY > 250) {
        determineScrollDirection();
      } else {
        lastPageY = window.scrollY;
        menu.attach();
      }
    }
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

