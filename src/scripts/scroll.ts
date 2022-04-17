(function () {
  window.addEventListener("load", function () {
    const buttons = document.getElementsByClassName("scroll-top")

    Array.from(buttons).forEach(function (button) {
      button.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto"
        });
      });
    });
  });
}());

