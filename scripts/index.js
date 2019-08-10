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

    function toggleMenuVisibility() {
        setMenuVisibility(direction === scrollDirection.UP);
    }

    /**
     * @param {boolean} isVisible
     * @param {MouseWheelEvent} event 
     */
    function setMenuVisibility(isVisible) {
        if (isVisible) {
            mainMenu.classList.add("fixed")
            addPhantomToDOM();
        } else {
            mainMenu.classList.remove("fixed")
            removePhantomFromDOM();
        }
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    function determineScrollDirection(event) {
        if (event.pageY > lastPageY) {
            direction = scrollDirection.DOWN;
        } else {
            direction = scrollDirection.UP;
        }

        lastPageY = event.pageY;
    }

    window.onscroll = function (event) {
        if (!shouldSetVisibilityFromScroll) {
            return;
        }

        window.requestAnimationFrame(function () {
            determineScrollDirection(event);
            setMenuVisibility(direction === scrollDirection.UP);
        });
    };

    if (window.matchMedia) {
        const smallScreenQuery = window.matchMedia("(max-width: 1000px)");

        smallScreenQuery.addListener(function (event) {
            shouldSetVisibilityFromScroll = event.matches;
        });
    }

    const toggleButtons = document.getElementsByClassName("toggle-menu-visiblity")

    Array.from(toggleButtons).forEach(function (button) {
        button.onclick = toggleMenuVisibility;
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
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "auto"
                });
            };
        });
    });
}());