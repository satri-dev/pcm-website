/* ============================================================
   PCM website — assets/js/downloads.js
   Reads the downloads data saved by the admin panel
   (pcm-admin-data-v1) and renders the downloadable files grid
   with category filtering. Falls back to a hardcoded demo set.
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var CAT_ICONS = {
    Prospectus: "📘",
    "Admission Form": "📝",
    Syllabus: "📚",
    "Scholarship Form": "🎓",
    Other: "📄"
  };

  var FALLBACK = [
    { id: "d1", title: "PCM Prospectus 2083", category: "Prospectus", date: "2026-07-01", size: 2400, file: "assets/pdf/prospectus-2083.pdf", desc: "Complete prospectus for the 2083 intake — programs, fees, facilities and admission details." },
    { id: "d2", title: "Admission Application Form 2083", category: "Admission Form", date: "2026-07-01", size: 380, file: "assets/pdf/admission-form-2083.pdf", desc: "Application form for BBA, BBA-Finance and BCSIT admissions. Submit to the college office." },
    { id: "d3", title: "BBA Syllabus (Pokhara University)", category: "Syllabus", date: "2026-06-15", size: 5200, file: "assets/pdf/syllabus-bba.pdf", desc: "Full BBA course structure and curriculum as per Pokhara University." },
    { id: "d4", title: "BCSIT Syllabus (Pokhara University)", category: "Syllabus", date: "2026-06-15", size: 5800, file: "assets/pdf/syllabus-bcsit.pdf", desc: "Full BCSIT course structure and curriculum as per Pokhara University." },
    { id: "d5", title: "Scholarship Application Form", category: "Scholarship Form", date: "2026-06-20", size: 210, file: "assets/pdf/scholarship-form.pdf", desc: "Apply for merit and need-based scholarships under PCM's support programs." }
  ];

  var currentFilter = "All";

  function fmtDate(d) {
    if (!d) return "";
    var parts = String(d).split("-");
    if (parts.length !== 3) return d;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = parseInt(parts[1], 10) - 1;
    if (isNaN(m)) return d;
    return months[m] + " " + parseInt(parts[2], 10) + ", " + parts[0];
  }

  function fmtSize(kb) {
    var n = Number(kb) || 0;
    if (n >= 1024) return (n / 1024).toFixed(1) + " MB";
    return n + " KB";
  }

  function fileUrl(f) {
    return f && /^https?:\/\//i.test(f) ? f : (f || "#");
  }

  function isPdf(f) {
    return /\.pdf$/i.test(f || "");
  }

  function downloadHtml(d, delay) {
    var icon = CAT_ICONS[d.category] || "📄";
    return '<article class="download-card reveal" style="transition-delay:' + (delay || 0) + 'ms">' +
      '<div class="download-card__top">' +
      '<span class="download-card__icon">' + icon + "</span>" +
      '<div><span class="download-card__cat">' + esc(d.category || "Other") + "</span>" +
      '<h3>' + esc(d.title) + "</h3></div></div>" +
      '<p class="download-card__desc">' + esc(d.desc) + "</p>" +
      '<div class="download-card__meta">' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + esc(fmtDate(d.date)) + "</span>" +
      (d.size ? '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>' + fmtSize(d.size) + "</span>" : "") +
      "</div>" +
      '<div class="download-card__foot">' +
      '<a class="btn btn-primary btn-sm" href="' + esc(fileUrl(d.file)) + '" download' + (isPdf(d.file) ? ' target="_blank" rel="noopener"' : "") + ">" +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/></svg> Download</a>' +
      "</div></article>";
  }

  function render(grid, list) {
    var filtered = currentFilter === "All" ? list : list.filter(function (d) { return d.category === currentFilter; });
    grid.innerHTML = filtered.length ? filtered.map(function (d, i) { return downloadHtml(d, i * 60); }).join("") : '<p class="empty-state">No files in this category yet. Check back soon.</p>';
  }

  function apply() {
    var grid = document.querySelector(".downloads-grid");
    if (!grid) return;

    var list = null;
    var raw = null;
    try { raw = localStorage.getItem("pcm-admin-data-v1"); } catch (e) {}
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        var items = parsed && parsed.data && parsed.data.downloads;
        if (Array.isArray(items) && items.length) {
          list = items.slice().sort(function (a, b) {
            return String(b.date || "").localeCompare(String(a.date || ""));
          });
        }
      } catch (e) { list = null; }
    }
    if (!list) list = FALLBACK;

    render(grid, list);

    var chipsWrap = document.getElementById("downloadFilter");
    if (chipsWrap) {
      chipsWrap.addEventListener("click", function (e) {
        var chip = e.target.closest ? e.target.closest(".filter-chip") : null;
        if (!chip) return;
        currentFilter = chip.getAttribute("data-filter");
        chipsWrap.querySelectorAll(".filter-chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        render(grid, list);
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
