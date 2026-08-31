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
      window.open("https://wa.me/917207370808?text=" + encodeURIComponent(msg), "_blank");
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
  // (finder button is wired below via the custom dropdown handler)

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

// elegant custom dropdowns (finder)
document.addEventListener("DOMContentLoaded", function () {
  var dds = document.querySelectorAll(".dd");
  dds.forEach(function (dd) {
    var btn = dd.querySelector(".dd-btn");
    var items = dd.querySelectorAll(".dd-list li");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      dds.forEach(function (o) { if (o !== dd) o.classList.remove("open"); });
      dd.classList.toggle("open");
      btn.setAttribute("aria-expanded", dd.classList.contains("open"));
    });
    items.forEach(function (li) {
      li.addEventListener("click", function () {
        items.forEach(function (o) { o.classList.remove("on"); });
        li.classList.add("on");
        btn.dataset.value = li.dataset.value;
        btn.innerHTML = li.innerHTML;
        dd.classList.remove("open");
      });
    });
  });
  document.addEventListener("click", function () {
    dds.forEach(function (dd) { dd.classList.remove("open"); });
  });

  // rewire finder button to custom dropdowns
  var goBtn = document.getElementById("finder-go");
  if (goBtn) {
    var fresh = goBtn.cloneNode(true);
    goBtn.parentNode.replaceChild(fresh, goBtn);
    fresh.addEventListener("click", function () {
      var proj = document.querySelector("#dd-project .dd-btn").dataset.value;
      if (proj === "ff") {
        window.open("https://wa.me/917207370808?text=" + encodeURIComponent(
          "Hello Epic Developers, I would like to register interest in Fortune Fields at Yacharam, Future City. Please share details."), "_blank");
      } else {
        // land directly on the project's layout plan (availability view)
        window.location.href = proj + "#layout";
      }
    });
  }
});

// ---------- lead capture on document download (name + mobile -> WhatsApp) ----------
document.addEventListener("DOMContentLoaded", function () {
  var dlLinks = document.querySelectorAll("a.doc-dl");
  if (!dlLinks.length) return;

  var LEAD_NUMBER = "917207370808";

  // inject styles
  var css = document.createElement("style");
  css.textContent =
    ".dl-overlay{position:fixed;inset:0;background:rgba(10,31,60,.72);display:none;align-items:center;justify-content:center;z-index:9999;padding:20px}" +
    ".dl-overlay.on{display:flex}" +
    ".dl-modal{background:#fff;max-width:420px;width:100%;border-radius:10px;padding:34px 30px;box-shadow:0 24px 60px rgba(0,0,0,.35);font-family:inherit;position:relative}" +
    ".dl-modal h3{font-family:'Sitka','Cambria',serif;color:#0A1F3C;margin:0 0 6px;font-size:1.4rem}" +
    ".dl-modal p.sub{color:#5a6472;margin:0 0 22px;font-size:.92rem;line-height:1.5}" +
    ".dl-modal label{display:block;font-size:.8rem;color:#0A1F3C;margin:14px 0 6px;font-weight:600;letter-spacing:.02em}" +
    ".dl-modal input{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #d4d9e0;border-radius:6px;font-size:1rem;font-family:inherit;color:#0A1F3C}" +
    ".dl-modal input:focus{outline:none;border-color:#C6A15B;box-shadow:0 0 0 2px rgba(198,161,91,.2)}" +
    ".dl-modal .dl-err{color:#b3261e;font-size:.78rem;margin-top:6px;display:none}" +
    ".dl-modal button.dl-go{margin-top:24px;width:100%;background:#C6A15B;color:#0A1F3C;border:none;padding:14px;border-radius:6px;font-size:1rem;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.02em}" +
    ".dl-modal button.dl-go:hover{background:#b8923f}" +
    ".dl-modal .dl-close{position:absolute;top:12px;right:16px;background:none;border:none;font-size:1.5rem;color:#8a93a0;cursor:pointer;line-height:1}" +
    ".dl-modal .dl-note{margin:16px 0 0;font-size:.76rem;color:#8a93a0;line-height:1.5}";
  document.head.appendChild(css);

  // inject modal markup
  var overlay = document.createElement("div");
  overlay.className = "dl-overlay";
  overlay.innerHTML =
    '<div class="dl-modal" role="dialog" aria-modal="true" aria-labelledby="dl-title">' +
      '<button class="dl-close" aria-label="Close">&times;</button>' +
      '<h3 id="dl-title">Get your document</h3>' +
      '<p class="sub">Please share your details and we will open your download.</p>' +
      '<label for="dl-name">Full name</label>' +
      '<input id="dl-name" type="text" autocomplete="name" placeholder="Your name">' +
      '<label for="dl-mobile">Mobile number</label>' +
      '<input id="dl-mobile" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile">' +
      '<div class="dl-err" id="dl-err">Please enter your name and a valid 10-digit mobile number.</div>' +
      '<button class="dl-go" type="button">Download now</button>' +
      '<p class="dl-note">Your download opens after you press send in WhatsApp. Our team will reach out with details.</p>' +
    '</div>';
  document.body.appendChild(overlay);

  var nameEl = overlay.querySelector("#dl-name");
  var mobEl = overlay.querySelector("#dl-mobile");
  var errEl = overlay.querySelector("#dl-err");
  var pendingDoc = null, pendingTitle = null;

  function openModal(doc, title) {
    pendingDoc = doc; pendingTitle = title || "document";
    errEl.style.display = "none";
    nameEl.value = ""; mobEl.value = "";
    overlay.classList.add("on");
    setTimeout(function () { nameEl.focus(); }, 50);
  }
  function closeModal() { overlay.classList.remove("on"); pendingDoc = null; }

  dlLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(a.getAttribute("href"), a.getAttribute("data-title"));
    });
  });

  overlay.querySelector(".dl-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  overlay.querySelector(".dl-go").addEventListener("click", function () {
    var name = (nameEl.value || "").trim();
    var mob = (mobEl.value || "").replace(/\D/g, "");
    if (name.length < 2 || mob.length < 10) { errEl.style.display = "block"; return; }

    var msg =
      "New download request from the website.\n" +
      "Document: " + pendingTitle + "\n" +
      "Name: " + name + "\n" +
      "Mobile: " + mob;
    window.open("https://wa.me/" + LEAD_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");

    // open the actual document
    var docUrl = pendingDoc;
    closeModal();
    setTimeout(function () { window.open(docUrl, "_blank", "noopener"); }, 300);
  });
});

// ---------- WhatsApp quick-menu (project-aware pre-filled messages) ----------
document.addEventListener("DOMContentLoaded", function () {
  var trigger = document.getElementById("wa-float");
  if (!trigger) return;

  var NUMBER = "917207370808";
  var proj = document.body.getAttribute("data-project");        // e.g. "Park Central" or null
  var city = document.body.getAttribute("data-project-city") || "";
  // short, human phrase for the client's outgoing message
  var about = proj ? (proj + (city ? ", " + city : "")) : "your projects";

  // menu options: label + message builder
  var opts = [
    { label: "Get pricing & payment plan",
      msg: "Hello Epic Developers, please share the pricing and payment plan for " + about + "." },
    { label: "Book a site visit",
      msg: "Hello Epic Developers, I'd like to schedule a site visit to " + about + ". Please suggest available times." },
    { label: "Request a callback",
      msg: "Hello Epic Developers, please call me back regarding " + about + ". My name is ___." },
    { label: "Ask a question",
      msg: "" }  // empty -> plain chat
  ];

  // styles
  var css = document.createElement("style");
  css.textContent =
    ".wa-menu{position:fixed;z-index:9998;right:24px;bottom:92px;display:none;flex-direction:column;gap:0;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 18px 48px rgba(10,31,60,.28);width:270px;font-family:inherit}" +
    ".wa-menu.on{display:flex}" +
    ".wa-menu .wa-head{background:#0A1F3C;color:#fff;padding:14px 18px;font-family:'Sitka','Cambria',serif;font-size:1rem;line-height:1.3}" +
    ".wa-menu .wa-head small{display:block;color:#C6A15B;font-family:inherit;font-size:.72rem;letter-spacing:.04em;margin-top:3px;text-transform:uppercase}" +
    ".wa-menu button.wa-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:#fff;border:none;border-top:1px solid #eef1f4;padding:14px 18px;font-size:.92rem;color:#0A1F3C;cursor:pointer;font-family:inherit}" +
    ".wa-menu button.wa-opt:hover{background:#f6f2e9}" +
    ".wa-menu button.wa-opt .wa-ic{width:18px;text-align:center;flex:none}" +
    ".wa-backdrop{position:fixed;inset:0;z-index:9997;display:none}" +
    ".wa-backdrop.on{display:block}";
  document.head.appendChild(css);

  var icons = ["\u20B9", "\uD83D\uDCCD", "\uD83D\uDCDE", "\uD83D\uDCAC"];

  // backdrop (click-away)
  var backdrop = document.createElement("div");
  backdrop.className = "wa-backdrop";
  document.body.appendChild(backdrop);

  // menu
  var menu = document.createElement("div");
  menu.className = "wa-menu";
  menu.setAttribute("role", "menu");
  var head = '<div class="wa-head">How can we help?' +
             (proj ? '<small>' + proj + '</small>' : '') + '</div>';
  var body = opts.map(function (o, i) {
    return '<button type="button" class="wa-opt" role="menuitem" data-i="' + i + '">' +
           '<span class="wa-ic">' + icons[i] + '</span>' + o.label + '</button>';
  }).join("");
  menu.innerHTML = head + body;
  document.body.appendChild(menu);

  function open() { menu.classList.add("on"); backdrop.classList.add("on"); trigger.setAttribute("aria-expanded", "true"); }
  function close() { menu.classList.remove("on"); backdrop.classList.remove("on"); trigger.setAttribute("aria-expanded", "false"); }
  function toggle() { menu.classList.contains("on") ? close() : open(); }

  trigger.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  menu.querySelectorAll(".wa-opt").forEach(function (b) {
    b.addEventListener("click", function () {
      var o = opts[+b.getAttribute("data-i")];
      var url = "https://wa.me/" + NUMBER + (o.msg ? "?text=" + encodeURIComponent(o.msg) : "");
      window.open(url, "_blank", "noopener");
      close();
    });
  });
});

// ---------- layout-plan lightbox (tap to enlarge, pinch/scroll to zoom) ----------
document.addEventListener("DOMContentLoaded", function () {
  var fig = document.querySelector("figure#layout");
  if (!fig) return;
  var img = fig.querySelector("img");
  if (!img) return;

  // cue
  fig.style.cursor = "zoom-in";
  var cue = document.createElement("span");
  cue.textContent = "Tap to enlarge";
  cue.style.cssText = "display:inline-block;margin-top:10px;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#7A745F";
  img.insertAdjacentElement("afterend", cue);

  // styles
  var css = document.createElement("style");
  css.textContent =
    ".lb-ov{position:fixed;inset:0;background:rgba(10,14,20,.94);display:none;z-index:10000;cursor:zoom-out;overflow:auto;-webkit-overflow-scrolling:touch}" +
    ".lb-ov.on{display:block}" +
    ".lb-ov img{display:block;margin:0 auto;min-width:100%;width:auto;max-width:none;cursor:grab}" +
    ".lb-close{position:fixed;top:16px;right:22px;z-index:10001;background:none;border:none;color:#fff;font-size:2rem;line-height:1;cursor:pointer;opacity:.85}" +
    ".lb-hint{position:fixed;bottom:16px;left:0;right:0;text-align:center;color:#cfd3da;font-size:.75rem;letter-spacing:.1em;pointer-events:none;z-index:10001}";
  document.head.appendChild(css);

  var ov = document.createElement("div");
  ov.className = "lb-ov";
  ov.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<img src="' + img.getAttribute("src") + '" alt="' + (img.getAttribute("alt") || "Layout plan") + '">' +
    '<div class="lb-hint">Scroll to explore &middot; tap outside to close</div>';
  document.body.appendChild(ov);

  function open() { ov.classList.add("on"); document.body.style.overflow = "hidden"; ov.scrollTop = 0; }
  function close() { ov.classList.remove("on"); document.body.style.overflow = ""; }

  fig.addEventListener("click", open);
  ov.querySelector(".lb-close").addEventListener("click", function (e) { e.stopPropagation(); close(); });
  ov.addEventListener("click", function (e) { if (e.target.tagName !== "IMG") close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
});
