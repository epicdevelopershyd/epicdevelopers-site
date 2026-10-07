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
  if (header) {
    var pinned = header.classList.contains("solid");           // inner pages keep the solid look from the top
    var onScroll = function () {
      var down = window.scrollY > 60;
      if (!pinned) header.classList.toggle("solid", down);
      header.classList.toggle("slim", down);                     // every page: the bar slims once you scroll
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
      window.open("https://wa.me/919177681133?text=" + encodeURIComponent(msg), "_blank");
    });
  }
});

// home hero: the stage. One entrance fills the screen, the next sweeps in; a rail shows all five and whose turn it is.
document.addEventListener("DOMContentLoaded", function () {
  var stage = document.getElementById("stage");
  if (stage) {
    var imgs = Array.prototype.slice.call(stage.querySelectorAll(".st-img"));
    var caps = Array.prototype.slice.call(stage.querySelectorAll(".st-cap"));
    var cards = Array.prototype.slice.call(stage.querySelectorAll(".st-card"));
    var edge = stage.querySelector(".st-edge");
    var n = imgs.length, k = 0, timer = null, busy = false, DWELL = 6200;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.style.setProperty("--dwell", DWELL + "ms");
    // the first picture ships with the page; the others arrive once the page itself has loaded
    function ready(i, then) {
      var pic = imgs[i].querySelector(".st-pic"), src = pic.getAttribute("data-src"), done = false;
      function fin() { if (!done) { done = true; if (then) then(); } }
      if (src) { pic.removeAttribute("data-src"); pic.src = src; }
      // wait until the picture is fully decoded, so a sweep never reveals a half-drawn image
      if (pic.decode) pic.decode().then(fin, fin); else if (pic.complete) fin(); else { pic.onload = fin; pic.onerror = fin; }
    }
    function preloadAll() { imgs.forEach(function (_, i) { ready(i); }); }
    if (document.readyState === "complete") preloadAll(); else window.addEventListener("load", preloadAll);
    function mark(i) {
      caps.forEach(function (c, x) { c.classList.toggle("on", x === i); if (x === i) c.removeAttribute("tabindex"); else c.setAttribute("tabindex", "-1"); });
      cards.forEach(function (c, x) { c.classList.remove("on"); if (x === i) { void c.offsetWidth; c.classList.add("on"); } c.setAttribute("aria-pressed", x === i ? "true" : "false"); });
    }
    function go(i) {
      i = (i + n) % n;
      if (i === k || busy) return;
      busy = true;
      ready(i, function () {
        var prev = imgs[k], next = imgs[i];
        prev.classList.remove("on"); prev.classList.add("out");
        next.classList.remove("out");
        if (still) { next.classList.add("on"); prev.classList.remove("out"); busy = false; }
        else {
          next.classList.add("on");
          setTimeout(function () { prev.classList.remove("out"); busy = false; }, 1300);
        }
        k = i; mark(k);
      });
    }
    function start() { if (!timer && !still) { timer = setInterval(function () { go(k + 1); }, DWELL); stage.classList.remove("paused"); } }
    function stop() { clearInterval(timer); timer = null; stage.classList.add("paused"); }
    cards.forEach(function (c, i) { c.addEventListener("click", function () { stop(); go(i); start(); }); });
    var side = stage.querySelector(".st-side");
    if (side) { side.addEventListener("mouseenter", stop); side.addEventListener("mouseleave", start); side.addEventListener("focusin", stop); side.addEventListener("focusout", start); }
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    // the picture leans a little toward the pointer
    var bg = stage.querySelector(".st-bg");
    if (bg && !still && window.matchMedia("(hover: hover) and (min-width: 901px)").matches) {
      stage.addEventListener("mousemove", function (e) {
        var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        bg.style.transform = "translate3d(" + (-x * 14).toFixed(1) + "px," + (-y * 9).toFixed(1) + "px,0)";
      });
      bg.style.transition = "transform 0.9s cubic-bezier(.2,.7,.2,1)";
      stage.addEventListener("mouseleave", function () { bg.style.transform = ""; });
    }
    mark(0); start();
    // swipe on touch screens
    var sx = null;
    bg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    bg.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) { stop(); go(k + (dx < 0 ? 1 : -1)); start(); } }, { passive: true });
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
  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest(".dd")) return;
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
        window.open("https://wa.me/919177681133?text=" + encodeURIComponent(
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

  var LEAD_NUMBER = "919177681133";

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

  var NUMBER = "919177681133";
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
  var fig = document.querySelector(".plan-figure, figure#layout");
  if (!fig) return;
  var img = fig.querySelector("img");
  if (!img) return;

  // cue (overlay, does not add layout height)
  fig.style.cursor = "zoom-in";
  fig.style.position = fig.style.position || "relative";
  var cue = document.createElement("span");
  cue.textContent = "Tap to enlarge";
  cue.style.cssText = "position:absolute;left:50%;bottom:10px;transform:translateX(-50%);background:rgba(10,31,60,.72);color:#fff;padding:5px 12px;border-radius:3px;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;pointer-events:none";
  fig.appendChild(cue);

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

// ---------- precise landing on #layout after finder navigation ----------
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.hash !== "#layout") return;
  var target = document.getElementById("layout");
  if (!target) return;
  var header = document.querySelector(".site-header");
  function landExactly() {
    var offset = (header ? header.getBoundingClientRect().height : 86) + 24;
    var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
  }
  // correct after layout settles (fonts, reveal, images), several passes
  requestAnimationFrame(landExactly);
  setTimeout(landExactly, 150);
  setTimeout(landExactly, 450);
  setTimeout(landExactly, 900);
  window.addEventListener("load", function () { setTimeout(landExactly, 60); });
});


// ---------- align availability panel bottom with plan image bottom ----------
document.addEventListener("DOMContentLoaded", function () {
  var fig = document.querySelector(".plan-figure");
  var panel = document.querySelector(".avail-panel");
  if (!fig || !panel) return;
  var img = fig.querySelector("img");
  if (!img) return;
  function sync() {
    // match panel height to the image's rendered box height
    if (window.matchMedia("(max-width: 900px)").matches) { panel.style.height = ""; return; }
    var h = img.getBoundingClientRect().height;
    if (h > 0) panel.style.height = h + "px";
  }
  if (img.complete) sync(); else img.addEventListener("load", sync);
  window.addEventListener("resize", sync);
  setTimeout(sync, 300);
});
