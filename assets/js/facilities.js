/* ============================================================
   PCM website — assets/js/facilities.js
   Reads the facilities data saved by the admin panel (pcm-admin-data-v1)
   and renders the facilities grid + category filters live.
   Falls back to a hardcoded demo set so the page always looks complete.
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var FALLBACK = [
    { id: "f1", name: "Smart Classrooms", category: "Learning", icon: "🏫", image: "assets/img/about-2.jpg", desc: "Spacious, well-lit classrooms with modern projectors, AV systems and comfortable seating." },
    { id: "f2", name: "Learning Resource Centre", category: "Library", icon: "📚", image: "assets/img/about-1.jpg", desc: "A quiet, fully-stocked library with reference texts, journals, e-resources and study desks." },
    { id: "f3", name: "IT & Computer Labs", category: "IT", icon: "💻", image: "assets/img/hero-6.jpg", desc: "Dedicated labs with up-to-date computers and software for BCSIT practicals and coding workshops." },
    { id: "f4", name: "Seminar Hall", category: "Learning", icon: "🎤", image: "assets/img/hero-3.jpg", desc: "A modern hall for guest lectures, presentations, events and student showcases." },
    { id: "f5", name: "Sports & Recreation", category: "Sports", icon: "⚽", image: "assets/img/about-games.jpg", desc: "Football, volleyball and basketball spaces plus indoor recreation to stay active between classes." },
    { id: "f6", name: "Cafeteria & Common Room", category: "Student Life", icon: "☕", image: "assets/img/hero-5.jpg", desc: "A clean, friendly place for meals, snacks and hanging out — the heart of daily campus life." }
  ];

  function cardHtml(f, delay) {
    var img = f.image
      ? '<div class="facility-card__media"><img src="' + esc(f.image) + '" alt="' + esc(f.name) + '" loading="lazy"></div>'
      : '<div class="facility-card__media facility-card__media--plain"><span>' + esc(f.icon || "🏛️") + "</span></div>";
    return '<article class="facility-card reveal" style="transition-delay:' + (delay || 0) + 'ms">' + img +
      '<div class="facility-card__body">' +
      '<span class="facility-card__icon">' + esc(f.icon || "🏛️") + "</span>" +
      '<span class="facility-card__cat">' + esc(f.category || "Facility") + "</span>" +
      '<h3>' + esc(f.name) + "</h3>" +
      '<p>' + esc(f.desc) + "</p>" +
      "</div></article>";
  }

  function loadFacilities() {
    var list = null;
    try { var raw = localStorage.getItem("pcm-admin-data-v1"); } catch (e) {}
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        var arr = parsed && parsed.data && parsed.data.facilities;
        if (Array.isArray(arr) && arr.length) list = arr;
      } catch (e) { list = null; }
    }
    return list || FALLBACK;
  }

  function apply() {
    var grid = document.getElementById("facilities-grid");
    var chips = document.getElementById("facility-filters");
    if (!grid) return;
    var all = loadFacilities();
    var cats = [];
    all.forEach(function (f) { if (f.category && cats.indexOf(f.category) === -1) cats.push(f.category); });
    if (chips) {
      var btns = ['<button type="button" class="filter-chip is-active" data-cat="All">All</button>'];
      cats.forEach(function (c) {
        btns.push('<button type="button" class="filter-chip" data-cat="' + esc(c) + '">' + esc(c) + "</button>");
      });
      chips.innerHTML = btns.join("");
      chips.addEventListener("click", function (e) {
        var b = e.target.closest(".filter-chip");
        if (!b) return;
        var cat = b.getAttribute("data-cat");
        [].forEach.call(chips.querySelectorAll(".filter-chip"), function (c) { c.classList.toggle("is-active", c === b); });
        var list = cat === "All" ? all : all.filter(function (f) { return f.category === cat; });
        grid.innerHTML = list.map(function (f, i) { return cardHtml(f, i * 60); }).join("");
      });
    }
    grid.innerHTML = all.map(function (f, i) { return cardHtml(f, i * 60); }).join("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
