/* ============================================================
   PCM website — assets/js/events.js
   Reads the events data saved by the admin panel (pcm-admin-data-v1)
   and renders the events grid live. Falls back to a hardcoded
   demo set so the page always looks complete.
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var TYPE_ICONS = {
    Workshop: "🛠️",
    Seminar: "🎤",
    Festival: "🎉",
    Tour: "🏔️",
    Sports: "🏆"
  };
  var TYPE_COLORS = {
    Workshop: "gold",
    Seminar: "blue",
    Festival: "gold",
    Tour: "green",
    Sports: "blue"
  };

  var FALLBACK = [
    { id: "e1", title: "Annual Fest 2083", type: "Festival", date: "2026-09-18", location: "PCM Campus, Nadipur", seats: 500, desc: "The flagship celebration of the PCM year — music, dance, food stalls, inter-batch competitions and performances by students." },
    { id: "e2", title: "Guest Lecture: Careers in Banking", type: "Seminar", date: "2026-08-22", location: "Seminar Hall", seats: 120, desc: "Industry leaders from the banking sector share real-world insight on building a career in finance and banking." },
    { id: "e3", title: "Coding Bootcamp for BCSIT", type: "Workshop", date: "2026-08-15", location: "IT Lab", seats: 60, desc: "A hands-on weekend bootcamp covering modern web development — open to all BCSIT students." },
    { id: "e4", title: "Annapurna Educational Tour", type: "Tour", date: "2026-09-05", location: "Annapurna Region", seats: 45, desc: "Our annual field trip into the Annapurna region — combining outdoor learning, teamwork and unforgettable views." },
    { id: "e5", title: "Inter-Batch Sports Tournament", type: "Sports", date: "2026-08-29", location: "Sports Ground", seats: 0, desc: "Friendly competition across batches in football, volleyball and basketball. Come cheer your batch!" },
    { id: "e6", title: "Career Day 2083", type: "Seminar", date: "2026-10-10", location: "Main Hall", seats: 200, desc: "Panel talks, resume reviews and one-on-one mentoring with professionals from banking, technology and consulting." },
    { id: "e7", title: "Inter-College Debate Championship", type: "Workshop", date: "2026-09-26", location: "Seminar Hall", seats: 150, desc: "Debaters from colleges across Pokhara battle it out on current affairs and campus topics." },
    { id: "e8", title: "Model United Nations (MUN) Workshop", type: "Workshop", date: "2026-10-03", location: "Seminar Hall", seats: 80, desc: "A beginner-friendly introduction to MUN procedure, committee rules and resolution drafting." },
    { id: "e9", title: "Bhirkot Community Service Trip", type: "Tour", date: "2026-10-17", location: "Bhirkot", seats: 40, desc: "A weekend of community service — teaching, cleaning drives and interaction with local students." },
    { id: "e10", title: "Sports Week 2083", type: "Sports", date: "2026-11-01", location: "Sports Ground", seats: 0, desc: "A full week of tournaments, prize distributions and house-level rivalry across every sport." },
    { id: "e11", title: "FinTech Guest Lecture", type: "Seminar", date: "2026-11-14", location: "Main Hall", seats: 180, desc: "Digital payments, neobanking and the future of finance — insights from industry practitioners." },
    { id: "e12", title: "Magh Mini Fest", type: "Festival", date: "2026-12-25", location: "PCM Campus, Nadipur", seats: 300, desc: "A mid-year celebration with cultural performances, stalls and inter-batch competitions to close the year." }
  ];

  function fmtDate(d) {
    if (!d) return "";
    var parts = String(d).split("-");
    if (parts.length !== 3) return d;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = parseInt(parts[1], 10) - 1;
    if (isNaN(m)) return d;
    return months[m] + " " + parseInt(parts[2], 10) + ", " + parts[0];
  }

  function shortDate(d) {
    var parts = String(d).split("-");
    if (parts.length !== 3) return "";
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var m = parseInt(parts[1], 10) - 1;
    if (isNaN(m)) return "";
    return '<b>' + parseInt(parts[2], 10) + "</b><span>" + months[m] + "</span>";
  }

  function eventHtml(e, delay) {
    var icon = TYPE_ICONS[e.type] || "📅";
    var color = TYPE_COLORS[e.type] || "blue";
    var img = e.image
      ? '<img class="event-card__bg" src="' + esc(e.image) + '" alt="" loading="lazy">'
      : '<div class="event-card__bg event-card__bg--plain"></div>';
    return '<article class="event-card reveal" style="transition-delay:' + (delay || 0) + 'ms">' +
      '<div class="event-card__media">' + img +
      '<div class="event-card__cal">' + shortDate(e.date) + "</div>" +
      '<span class="event-card__type">' + esc(icon + " " + (e.type || "Event")) + "</span></div>" +
      '<div class="event-card__body"><h3>' + esc(e.title) + "</h3>" +
      '<p class="event-card__desc">' + esc(e.desc) + "</p>" +
      '<div class="event-card__meta">' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' + esc(e.location || "PCM Campus") + "</span>" +
      (e.seats ? '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>' + esc(e.seats) + " seats</span>" : "") +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + esc(fmtDate(e.date)) + "</span>" +
      "</div></div>" +
      '<div class="event-card__foot"><a class="link-arrow" href="contact.html?subject=' + esc(encodeURIComponent((e.title || "event").slice(0, 60))) + '">Enquire <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>' +
      "</article>";
  }

  function loadEvents() {
    var events = null;
    var raw = null;
    try { raw = localStorage.getItem("pcm-admin-data-v1"); } catch (e) {}
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        var list = parsed && parsed.data && parsed.data.events;
        if (Array.isArray(list) && list.length) {
          events = list.slice().sort(function (a, b) {
            return String(a.date || "").localeCompare(String(b.date || ""));
          });
        }
      } catch (e) { events = null; }
    }
    if (!events) events = FALLBACK;
    return events;
  }

  function apply() {
    var grid = document.querySelector(".events-grid");
    if (grid) grid.innerHTML = loadEvents().map(function (e, i) { return eventHtml(e, i * 60); }).join("");

    var home = document.querySelector(".home-events-grid");
    if (home) {
      var sorted = loadEvents();
      var upcoming = sorted.filter(function (e) { return !e.date || e.date >= new Date().toISOString().slice(0, 10); });
      if (!upcoming.length) upcoming = sorted.slice(0, 3);
      home.innerHTML = upcoming.slice(0, 3).map(function (e, i) { return eventHtml(e, i * 60); }).join("");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
