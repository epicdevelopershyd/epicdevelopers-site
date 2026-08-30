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

// hero slideshow with dots
document.addEventListener("DOMContentLoaded", function () {
  var slides = document.querySelectorAll(".hero .slide");
  var dotsWrap = document.querySelector(".hero-dots");
  if (slides.length > 1 && dotsWrap) {
    var idx = 0, timer;
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      if (i === 0) b.classList.add("on");
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function go(i) {
      slides[idx].classList.remove("on"); dots[idx].classList.remove("on");
      idx = i % slides.length;
      slides[idx].classList.add("on"); dots[idx].classList.add("on");
    }
    function tick() { go(idx + 1); }
    function restart() { clearInterval(timer); timer = setInterval(tick, 5200); }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) restart();
  }

  // finder bar
  var goBtn = document.getElementById("finder-go");
  if (goBtn) {
    goBtn.addEventListener("click", function () {
      var proj = document.getElementById("f-project").value;
      var size = document.getElementById("f-size").value;
      if (proj === "ff") {
        window.open("https://wa.me/919143747747?text=" + encodeURIComponent(
          "Hello Epic Developers, I would like to register interest in Fortune Fields at Yacharam – Future City. Preferred size: " + size), "_blank");
      } else {
        window.location.href = proj;
      }
    });
  }

  // animated counters
  var counts = document.querySelectorAll(".count");
  if (counts.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var to = parseInt(e.target.dataset.to, 10), start = null;
        var dur = 1600;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(to * eased).toLocaleString("en-IN");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counts.forEach(function (c) { cio.observe(c); });
  }
});

// pause hero video for reduced-motion users
document.addEventListener("DOMContentLoaded", function () {
  var v = document.querySelector(".hero-video");
  if (v && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    v.pause(); v.removeAttribute("autoplay");
  }
});
