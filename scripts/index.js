(function () {
  window.addEventListener("load", function () {
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");
  });
}());

(function () {
  let lastPageY = 0;
  let direction = "down";
  let shouldSetVisibilityFromScroll = true;
  const mainMenu = document.getElementById("main-menu");
  const mainMenuPhantom = mainMenu.cloneNode(true);
  mainMenuPhantom.id = "";
  mainMenuPhantom.classList.add("phantom");

  const menu = (function () {
    const scrollDirection = {
      'DOWN': 'down',
      'UP': 'up'
    };

    function removePhantomFromDOM() {
      if (mainMenuPhantom.parentElement) {
        mainMenuPhantom.parentElement.removeChild(mainMenuPhantom);
      }
    };

    function addPhantomToDOM() {
      if (!mainMenuPhantom.parentElement) {
        mainMenu.parentElement.insertBefore(mainMenuPhantom, mainMenu.nextSibling);
      }
    }

    let isOpen = true;

    return {
      open: function () {
        if (isOpen) return;

        mainMenu.classList.add("opening")
        mainMenu.classList.remove("closed")
        addPhantomToDOM();
        isOpen = true;
      },
      close: function () {
        if (!isOpen) return;

        mainMenu.classList.add("closed")
        mainMenu.classList.remove("opening")
        removePhantomFromDOM();
        isOpen = false;
      },
      toggle: function () {
        if (isOpen) {
          menu.close();
        } else {
          menu.open();
        }
      },
      reset: function () {
        mainMenu.classList.remove("opening", "closed");
      }
    };
  }
  )();

  /**
   * @param {boolean} isVisible
   * @param {MouseWheelEvent} event 
   */
  function setMenuVisibility(isVisible) {
    if (isVisible) {
      menu.open();
    } else {
      menu.close();
    }
  }

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
    if (!shouldSetVisibilityFromScroll) {
      return;
    }

    determineScrollDirection();
  };

  if (window.matchMedia) {
    const smallScreenQuery = window.matchMedia("(max-width: 1000px)");

    smallScreenQuery.addListener(function (event) {
      shouldSetVisibilityFromScroll = event.matches;
    });
  }

  const toggleButtons = document.getElementsByClassName("toggle-menu-visiblity")

  Array.from(toggleButtons).forEach(function (button) {
    button.onclick = menu.toggle;
  })
})();

(function () {
  window.addEventListener("load", function () {
    const links = document.getElementsByClassName("email-me")

    Array.from(links).forEach(function (element) {
      const name = element.getAttribute("data-address-name"),
        domain = element.getAttribute("data-address-domain"),
        tld = element.getAttribute("data-address-tld");

      element.href = "mailto:" + name + "@" + domain + "." + tld;
    });
  });
}());

(function () {
  window.addEventListener("load", function () {
    const buttons = document.getElementsByClassName("scroll-top")

    Array.from(buttons).forEach(function (button) {
      button.onclick = function () {
        menu.reset();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto"
        });
      };
    });
  });
}());
