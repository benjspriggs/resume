(function () {
    let lastPageY = 0;
    let direction = "";
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

    /**
     * 
     * @param {MouseWheelEvent} event 
     */
    function setMenuVisibility() {
        if (direction === scrollDirection.DOWN) {
            mainMenu.classList.remove("fixed")
            removePhantomFromDOM();
        } else {
            mainMenu.classList.add("fixed")
            addPhantomToDOM();
        }
    }

    window.onscroll = function (event) {
        window.requestAnimationFrame(function () {
            if (event.pageY > lastPageY) {
                direction = scrollDirection.DOWN;
            } else {
                direction = scrollDirection.UP;
            }

            lastPageY = event.pageY;

            window.requestAnimationFrame(setMenuVisibility);
        });
    }
})();

(function () {
    window.onload = function () {
        document.documentElement.classList.remove("no-js");
        document.documentElement.classList.add("js");
    }
}());