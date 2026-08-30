// Mobile nav
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }

  // Contact form → WhatsApp (no backend needed)
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
