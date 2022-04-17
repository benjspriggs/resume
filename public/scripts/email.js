(function () {
  window.addEventListener("load", function () {
    const links = document.getElementsByClassName("email-me")

    Array.from(links).forEach(/** @param {HTMLAnchorElement} element */ function (element) {
      const name = element.getAttribute("data-address-name"),
        domain = element.getAttribute("data-address-domain"),
        tld = element.getAttribute("data-address-tld");

      element.href = "mailto:" + name + "@" + domain + "." + tld;
    });
  });
}());

