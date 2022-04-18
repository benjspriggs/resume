import { Menu, isSmallScreen } from "./menu.js";

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
