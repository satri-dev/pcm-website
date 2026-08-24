/* ============================================================
   PCM website — assets/js/campus-map.js
   Reads the landmarks data saved by the admin panel (pcm-admin-data-v1)
   and renders the interactive campus map. Falls back to a hardcoded
   demo set so the page always looks complete.
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var FALLBACK = [
    { id: "l1", name: "Main Building", category: "Academic", icon: "🏫", x: 18, y: 40, desc: "Classrooms, faculty rooms and the admissions desk. The heart of the college." },
    { id: "l2", name: "Administrative Office", category: "Academic", icon: "🗂️", x: 11, y: 27, desc: "Exams, records, certificates and general enquiries are handled here." },
    { id: "l3", name: "Learning Resource Centre", category: "Library", icon: "📚", x: 47, y: 25, desc: "Our library with reference texts, journals, e-resources and quiet study areas." },
    { id: "l4", name: "IT & Computer Labs", category: "IT", icon: "💻", x: 77, y: 30, desc: "Modern computers and software for BCSIT practicals and workshops." },
    { id: "l5", name: "Seminar Hall", category: "Academic", icon: "🎤", x: 47, y: 57, desc: "Guest lectures, presentations and college events are hosted here." },
    { id: "l6", name: "Cafeteria", category: "Student Life", icon: "☕", x: 75, y: 62, desc: "Meals, snacks and the daily buzz of campus life between classes." },
    { id: "l7", name: "Sports Ground", category: "Sports", icon: "⚽", x: 13, y: 76, desc: "Football, volleyball and outdoor games for every batch." },
    { id: "l8", name: "Main Gate", category: "General", icon: "🚪", x: 45, y: 79, desc: "The main entrance on Gyan Marg. Visitor passes available at the gate." }
  ];

  var CAT_COLORS = {
    Academic: "#21409A",
    Library: "#E0A400",
    IT: "#0E8A5F",
    Sports: "#16A34A",
    "Student Life": "#D97706",
    General: "#64748B"
  };

  var state = { list: [], active: null, popup: null, stage: null, markersWrap: null };

  function loadLandmarks() {
    var list = null;
    try { var raw = localStorage.getItem("pcm-admin-data-v1"); } catch (e) {}
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        var arr = parsed && parsed.data && parsed.data.landmarks;
        if (Array.isArray(arr) && arr.length) list = arr;
      } catch (e) { list = null; }
    }
    return list || FALLBACK;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function showPopup(lm, marker) {
    var wrap = state.markersWrap;
    var popup = state.popup;
    var body = popup.querySelector(".campus-map__popup-body");
    body.innerHTML =
      '<span class="campus-map__popup-icon">' + esc(lm.icon || "📍") + "</span>" +
      "<h4>" + esc(lm.name) + "</h4>" +
      '<span class="campus-map__popup-cat">' + esc(lm.category || "") + "</span>" +
      "<p>" + esc(lm.desc) + "</p>";
    popup.hidden = false;
    var offLeft = marker.offsetLeft;
    var offTop = marker.offsetTop;
    var stageW = state.stage.clientWidth;
    popup.style.left = clamp(offLeft, 70, Math.max(70, stageW - 70)) + "px";
    popup.style.top = Math.max(12, offTop - 96) + "px";
    state.active = lm.id;
    [].forEach.call(wrap.querySelectorAll(".campus-map__marker"), function (m) {
      m.classList.toggle("is-active", m === marker);
    });
    [].forEach.call(document.querySelectorAll(".campus-map__list button"), function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-id") === lm.id);
    });
  }

  function apply() {
    state.stage = document.querySelector(".campus-map__stage");
    state.markersWrap = document.getElementById("campus-markers");
    state.popup = document.getElementById("campus-popup");
    var legendEl = document.getElementById("campus-legend");
    var listEl = document.getElementById("campus-list");
    if (!state.stage || !state.markersWrap) return;

    var list = loadLandmarks();
    state.list = list;
    state.markersWrap.innerHTML = list.map(function (lm, i) {
      return '<button type="button" class="campus-map__marker" data-id="' + esc(lm.id) + '" data-x="' + (lm.x || 50) + '" data-y="' + (lm.y || 50) + '" style="left:' + (lm.x || 50) + "%;top:" + (lm.y || 50) + '%;--mk:#' + CAT_COLORS[lm.category] + '" aria-label="' + esc(lm.name) + '">' + esc(lm.icon || "📍") + "</button>";
    }).join("");

    if (legendEl) {
      var cats = [];
      list.forEach(function (lm) { if (lm.category && cats.indexOf(lm.category) === -1) cats.push(lm.category); });
      legendEl.innerHTML = cats.map(function (c) {
        return '<span class="campus-map__legend-item"><i style="background:#' + CAT_COLORS[c] + '"></i>' + esc(c) + "</span>";
      }).join("");
    }

    if (listEl) {
      listEl.innerHTML = list.map(function (lm, i) {
        return '<button type="button" class="campus-map__place" data-id="' + esc(lm.id) + '"><i style="background:#' + CAT_COLORS[lm.category] + '">' + esc(lm.icon || "📍") + "</i><span><b>" + esc(lm.name) + "</b><small>" + esc(lm.category || "") + "</small></span></button>";
      }).join("");
      listEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".campus-map__place");
        if (!btn) return;
        var lm = list.filter(function (x) { return x.id === btn.getAttribute("data-id"); })[0];
        if (!lm) return;
        var marker = state.markersWrap.querySelector('[data-id="' + btn.getAttribute("data-id") + '"]');
        showPopup(lm, marker);
        marker && marker.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      });
    }

    state.markersWrap.addEventListener("click", function (e) {
      var marker = e.target.closest(".campus-map__marker");
      if (!marker) return;
      var lm = list.filter(function (x) { return x.id === marker.getAttribute("data-id"); })[0];
      if (lm) showPopup(lm, marker);
    });

    var closeBtn = state.popup.querySelector(".campus-map__popup-close");
    closeBtn.addEventListener("click", function () {
      state.popup.hidden = true;
      state.active = null;
      [].forEach.call(state.markersWrap.querySelectorAll(".campus-map__marker"), function (m) { m.classList.remove("is-active"); });
      [].forEach.call(document.querySelectorAll(".campus-map__list button"), function (b) { b.classList.remove("is-active"); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
