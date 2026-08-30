document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }

  // header turns solid after the hero
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("solid")) {
    var onScroll = function () {
      header.classList.toggle("solid", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // contact form -> WhatsApp
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var msg =
        "Hello Epic Developers, I have an enquiry.\n" +
        "Name: " + (f.get("name") || "") + "\n" +
        "Mobile: " + (f.get("mobile") || "") + "\n" +
        "Email: " + (f.get("email") || "") + "\n" +
        "Property: " + (f.get("property") || "") + "\n" +
        "Message: " + (f.get("message") || "");
      window.open("https://wa.me/919143747747?text=" + encodeURIComponent(msg), "_blank");
    });
  }
});
