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

