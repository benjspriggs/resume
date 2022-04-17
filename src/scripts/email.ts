(function () {
  window.addEventListener("load", function () {
    const links = document.getElementsByClassName("email-me");

    Array.from(links).forEach(function (element: HTMLAnchorElement) {
      const name = element.getAttribute("data-address-name"),
        domain = element.getAttribute("data-address-domain"),
        tld = element.getAttribute("data-address-tld");

      element.href = "mailto:" + name + "@" + domain + "." + tld;
    });
  });
})();
