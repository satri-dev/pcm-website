/* ============================================================
   PCM Admin — admin/js/admin.core.js
   Namespace, helpers, icons, schemas, seed data, store (IndexedDB),
   trash, backups, roles & auth (super admin / access control).
   ============================================================ */
window.PCMAdmin = (function () {
  "use strict";

  var LS_KEY = "pcm-admin-data-v1";
  var AUTH_KEY = "pcm-admin-auth";
  var IDB_NAME = "pcm-admin-db";
  var IDB_STORE = "kv";

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function uid(prefix) {
    return (prefix || "id") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function fmtDate(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }
  function fmtDateTime(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  function timeAgo(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    if (isNaN(diff)) return "";
    var m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    var d = Math.floor(h / 24);
    if (d < 30) return d + "d ago";
    return fmtDate(iso);
  }
  function initials(name) {
    return String(name || "?").split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ""; }).join("").toUpperCase();
  }
  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [33, 64, 154];
  }
  function rgba(hex, a) {
    var c = hexToRgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  }
  function bytesToSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
  }
  function isDataUrl(v) {
    return typeof v === "string" && v.slice(0, 5).toLowerCase() === "data:";
  }
  function isImageUrl(v) {
    if (isDataUrl(v)) return v.slice(5).indexOf("image/") === 0;
    return typeof v === "string" && /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(v);
  }
  function fileLabel(v) {
    if (!v) return "";
    if (isDataUrl(v)) {
      var m = /^data:([^;,]+)/.exec(v);
      return m ? m[1] : "file";
    }
    return String(v).split("/").pop().split("?")[0];
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- icons (24x24 stroke svg paths) ---------- */
  var ICONS = {
    dash: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    pages: '<path d="M4 4h13l3 3v13H4z"/><path d="M17 4v3h3M8 11h8M8 15h8"/>',
    news: '<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    notice: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M8 13h8M8 17h5"/>',
    result: '<path d="M8 3h8v4H8z"/><path d="M6 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><path d="m9 14 2 2 4-4"/>',
    events: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="m10 15 2 2 4-4"/>',
    program: '<path d="M4 19.5V5a2 2 0 0 1 2-2h11l3 3v13.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M7 8h10M7 12h10M7 16h6"/>',
    scholarship: '<path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/><path d="M6 6H3v1a3 3 0 0 0 3 3M18 6h3v1a3 3 0 0 1-3 3"/><path d="M10 20h4M11 20l.6-3.5h.8L13 20"/>',
    faq: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 3.7 2.2c-.8.4-1.3 1-1.3 1.8v.4"/><circle cx="12" cy="16.6" r=".4" fill="currentColor"/>',
    faculty: '<circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/>',
    board: '<path d="M12 3l9 4-9 4-9-4 9-4Z"/><path d="M3 11v5c0 1.5 4 3 9 3s9-1.5 9-3v-5"/><path d="M3 16v4c0 1.5 4 3 9 3s9-1.5 9-3v-4"/>',
    message: '<path d="M21 12a8 8 0 0 1-8 8H4l2.5-2.5A8 8 0 1 1 21 12Z"/>',
    alumni: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/><path d="M22 10v6"/>',
    clubs: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
    blogs: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M9 13h6M9 17h6"/>',
    gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.09a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/>',
    view: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    add: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow: '<path d="M9 6l6 6-6 6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    save: '<path d="M5 3h13l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 3v5h8V3M8 21v-7h8v7"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M17.9 17.9A10 10 0 0 1 2 12s2.5-5 6.5-6.6M9.9 4.2A10 10 0 0 1 22 12a10 10 0 0 1-2.2 3.4"/><path d="m2 2 20 20"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.2 3.2-5 6.5-5s5.9 1.8 6.5 5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 15.2c2.8.2 4.9 1.6 5.5 4.3"/>',
    archive: '<path d="M4 8h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z"/><path d="M3 4h18v4H3zM10 12h4"/>',
    file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 19h16"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15v-4M12 15V7M17 15v-7"/>',
    filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
    home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 21v-8h6v8"/>',
    key: '<path d="M14 12a4 4 0 1 1-4-4"/><path d="M14 12a8 8 0 1 0-8-8"/>',
    role: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    doc: '<path d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5M8 12h8M8 16h5"/>',
    seo: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4.3-4.3"/><path d="M7 11h8M7 8h6M7 14h4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    facility: '<path d="M3 21V9l6-4 6 4v12"/><path d="M15 11h6v10"/><path d="M9 9h.01M9 13h.01M9 17h.01M15 15h.01M15 19h.01M3 21h18"/>',
    map: '<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z"/><path d="M9 3v16M15 5v16"/>'
  };
  function icon(name, size) {
    var s = size || 18;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="' + s + '" height="' + s + '">' + (ICONS[name] || "") + "</svg>";
  }

  /* ---------- schemas ---------- */
  function F(over) {
    var base = { search: true, table: false };
    for (var k in over) base[k] = over[k];
    return base;
  }
  function FILE(kind, accept, maxMB) {
    return { type: "file", kind: kind, accept: accept || (kind === "image" ? "image/*" : "*/*"), maxSizeMB: maxMB || (kind === "image" ? 2 : 5) };
  }

  var SCHEMAS = {
    news: {
      label: "News", plural: "News articles", icon: "news",
      fields: [
        F({ type: "section", label: "Details", search: false }),
        F({ key: "title", label: "Title", type: "text", required: true, main: true, sub: "category" }),
        F({ key: "category", label: "Category", type: "select", required: true, options: ["News", "Event", "Student Blog", "Achievement"], filter: true }),
        F({ key: "date", label: "Date", type: "date", required: true, table: true }),
        F({ key: "views", label: "Views", type: "number", table: true }),
        F(FILE("image"), { key: "image", label: "Cover image", thumbKey: "image", hint: "Upload from device (max 2MB) or paste a URL" }),
        F({ type: "section", label: "Content", search: false }),
        F({ key: "excerpt", label: "Excerpt", type: "textarea", table: false, full: true }),
        F({ type: "section", label: "Publishing", search: false }),
        F({ key: "featured", label: "Featured", type: "toggle", table: true }),
        F({ key: "status", label: "Status", type: "select", options: ["published", "draft"], table: true })
      ]
    },
    notices: {
      label: "Notices", plural: "Notices", icon: "notice",
      fields: [
        F({ key: "title", label: "Notice title", type: "text", required: true, main: true, sub: "file" }),
        F({ key: "date", label: "Date", type: "date", required: true, table: true }),
        F({ key: "views", label: "Views", type: "number", table: true }),
        F(FILE("document", ".pdf,.doc,.docx,application/pdf", 5), { key: "file", label: "Notice file (PDF)", hint: "Upload a PDF from your device (max 5MB) or paste a link to assets/pdf/…" })
      ]
    },
    results: {
      label: "Results", plural: "Results", icon: "result",
      fields: [
        F({ key: "title", label: "Result title", type: "text", required: true, main: true, sub: "program" }),
        F({ key: "program", label: "Program", type: "select", options: ["BBA", "BCSIT", "BBA-Finance"], filter: true }),
        F({ key: "date", label: "Published", type: "date", required: true, table: true }),
        F({ key: "views", label: "Views", type: "number", table: true }),
        F(FILE("document", ".pdf,.doc,.docx,application/pdf", 5), { key: "file", label: "Result file (PDF)", hint: "Upload a PDF from your device (max 5MB) or paste a link" })
      ]
    },
    events: {
      label: "Events", plural: "Events & workshops", icon: "events",
      fields: [
        F({ type: "section", label: "Details", search: false }),
        F({ key: "title", label: "Event title", type: "text", required: true, main: true, sub: "type" }),
        F({ key: "type", label: "Type", type: "select", options: ["Workshop", "Seminar", "Festival", "Tour", "Sports"], filter: true }),
        F({ key: "date", label: "Date", type: "date", required: true, table: true }),
        F({ key: "location", label: "Location", type: "text", table: true }),
        F({ key: "seats", label: "Seats", type: "number" }),
        F(FILE("image"), { key: "image", label: "Poster image", hint: "Optional cover image (max 2MB)" }),
        F({ type: "section", label: "About this event", search: false }),
        F({ key: "desc", label: "Description", type: "textarea", full: true })
      ]
    },
    programs: {
      label: "Programs", plural: "Academic programs", icon: "program",
      fields: [
        F({ type: "section", label: "Overview", search: false }),
        F({ key: "name", label: "Program name", type: "text", required: true, main: true, sub: "code" }),
        F({ key: "code", label: "Code", type: "text", table: true }),
        F({ key: "level", label: "Level", type: "select", options: ["Bachelor", "Bachelor (Finance)", "Bachelor (IT)"], table: true }),
        F({ key: "duration", label: "Duration", type: "text", table: true }),
        F({ key: "seats", label: "Seats", type: "number", table: true }),
        F({ key: "status", label: "Status", type: "select", options: ["open", "closed"], table: true }),
        F(FILE("image"), { key: "image", label: "Program image", hint: "Optional (max 2MB)" }),
        F({ type: "section", label: "Description", search: false }),
        F({ key: "intro", label: "Intro", type: "textarea", full: true }),
        F({ key: "eligibility", label: "Eligibility", type: "textarea", full: true })
      ]
    },
    scholarships: {
      label: "Scholarships", plural: "Scholarship schemes", icon: "scholarship",
      fields: [
        F({ key: "title", label: "Scheme", type: "text", required: true, main: true, sub: "type" }),
        F({ key: "type", label: "Type", type: "select", options: ["Merit", "Need-based", "University", "Category"], filter: true, table: true }),
        F({ key: "desc", label: "Description", type: "textarea", full: true }),
        F({ key: "active", label: "Active", type: "toggle", table: true })
      ]
    },
    faqs: {
      label: "FAQs", plural: "Frequently asked questions", icon: "faq",
      fields: [
        F({ key: "question", label: "Question", type: "text", required: true, main: true, sub: "category" }),
        F({ key: "category", label: "Category", type: "select", options: ["Admission", "Scholarship", "Programs", "Campus", "General"], filter: true }),
        F({ type: "section", label: "Answer", search: false }),
        F({ key: "answer", label: "Answer", type: "textarea", required: true, full: true })
      ]
    },
    faculty: {
      label: "Faculty", plural: "Faculty & staff", icon: "faculty",
      fields: [
        F({ key: "name", label: "Full name", type: "text", required: true, main: true, sub: "role", thumb: true }),
        F({ key: "role", label: "Role", type: "text", required: true, table: true }),
        F({ key: "group", label: "Group", type: "select", options: ["Leadership", "Faculty", "Administration"], filter: true }),
        F(FILE("image"), { key: "photo", label: "Photo", thumbKey: "photo", hint: "Upload (max 2MB) or paste URL" }),
        F({ key: "email", label: "Email", type: "email" }),
        F({ key: "phone", label: "Phone", type: "text" })
      ]
    },
    board: {
      label: "Board", plural: "Board of directors", icon: "board",
      fields: [
        F({ key: "name", label: "Full name", type: "text", required: true, main: true, sub: "role" }),
        F({ key: "role", label: "Role", type: "text", required: true, table: true }),
        F({ key: "order", label: "Order", type: "number", table: true }),
        F(FILE("image"), { key: "photo", label: "Photo", hint: "Optional (max 2MB)" })
      ]
    },
    messages: {
      label: "Messages", plural: "Leadership messages", icon: "message",
      fields: [
        F({ key: "title", label: "Title", type: "text", required: true, main: true, sub: "author" }),
        F({ key: "author", label: "Author", type: "text", required: true, table: true }),
        F({ key: "role", label: "Role", type: "text", table: true }),
        F({ key: "excerpt", label: "Excerpt", type: "textarea", full: true })
      ]
    },
    alumni: {
      label: "Alumni", plural: "Alumni spotlight", icon: "alumni",
      fields: [
        F({ key: "name", label: "Full name", type: "text", required: true, main: true, sub: "role" }),
        F({ key: "batch", label: "Batch", type: "text", table: true }),
        F({ key: "program", label: "Program", type: "select", options: ["BBA", "BCSIT", "BBA-Finance"], table: true }),
        F({ key: "sector", label: "Sector", type: "select", options: ["Banking & Finance", "Technology", "Education", "Entrepreneurship"], filter: true }),
        F({ key: "role", label: "Role / company", type: "text", table: true }),
        F({ key: "location", label: "Location", type: "text" }),
        F(FILE("image"), { key: "photo", label: "Photo", hint: "Optional (max 2MB)" })
      ]
    },
    clubs: {
      label: "Clubs", plural: "Student clubs", icon: "clubs",
      fields: [
        F({ type: "section", label: "Details", search: false }),
        F({ key: "name", label: "Club name", type: "text", required: true, main: true, sub: "tagline" }),
        F({ key: "icon", label: "Icon (emoji)", type: "text", table: true }),
        F({ key: "tagline", label: "Tagline", type: "text", table: true }),
        F(FILE("image"), { key: "image", label: "Club image", hint: "Optional (max 2MB)" }),
        F({ type: "section", label: "Description", search: false }),
        F({ key: "desc", label: "Description", type: "textarea", full: true }),
        F({ type: "section", label: "Leadership team", search: false }),
        F({ key: "members", label: "Members", type: "list", table: true, itemLabel: "member", full: true, itemFields: [
          { key: "photo", label: "Photo", type: "file", kind: "image", accept: "image/*", maxSizeMB: 2, fileInput: true },
          { key: "name", label: "Name", type: "text" },
          { key: "position", label: "Position", type: "text" },
          { key: "program", label: "Program / semester", type: "text" }
        ] })
      ]
    },
    blogs: {
      label: "Blogs", plural: "Blog posts", icon: "blogs",
      fields: [
        F({ type: "section", label: "Details", search: false }),
        F({ key: "title", label: "Title", type: "text", required: true, main: true, sub: "author" }),
        F({ key: "author", label: "Author", type: "text", table: true }),
        F({ key: "category", label: "Category", type: "select", options: ["Student Stories", "Campus Life", "Internships", "Finance", "Skills", "Clubs"], filter: true }),
        F({ key: "date", label: "Date", type: "date", table: true }),
        F({ key: "status", label: "Status", type: "select", options: ["published", "draft"], table: true }),
        F(FILE("image"), { key: "image", label: "Cover image", hint: "Optional (max 2MB)" }),
        F({ type: "section", label: "Excerpt", search: false }),
        F({ key: "excerpt", label: "Excerpt", type: "textarea", full: true })
      ]
    },
    gallery: {
      label: "Gallery", plural: "Photo albums", icon: "gallery",
      fields: [
        F({ type: "section", label: "Details", search: false }),
        F({ key: "album", label: "Album title", type: "text", required: true, main: true, sub: "category", thumb: true }),
        F({ key: "category", label: "Category", type: "select", options: ["Cultural", "Academic", "Tour", "Sports", "Albums"], filter: true }),
        F({ key: "date", label: "Date", type: "date", table: true }),
        F({ key: "count", label: "Photos", type: "number", table: true }),
        F(FILE("image"), { key: "cover", label: "Cover image", hint: "Upload (max 2MB) or paste URL" }),
        F({ type: "section", label: "Photo list", search: false }),
        F({ key: "photos", label: "Photos", type: "list", itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "tag", label: "Tag", type: "text" },
          { key: "src", label: "Image", type: "file", kind: "image", accept: "image/*", maxSizeMB: 2, fileInput: true }
        ], full: true })
      ]
    },
    downloads: {
      label: "Downloads", plural: "Downloads", icon: "download",
      fields: [
        F({ type: "section", label: "Details", search: false }),
        F({ key: "title", label: "Title", type: "text", required: true, main: true, sub: "category" }),
        F({ key: "category", label: "Category", type: "select", required: true, options: ["Prospectus", "Admission Form", "Syllabus", "Scholarship Form", "Other"], filter: true }),
        F({ key: "date", label: "Published", type: "date", required: true, table: true }),
        F({ key: "size", label: "File size (KB)", type: "number", table: true }),
        F({ key: "desc", label: "Description", type: "textarea", full: true }),
        F(FILE("document", ".pdf,.doc,.docx,application/pdf", 10), { key: "file", label: "File (PDF/DOC)", hint: "Upload from device (max 10MB) or paste a link to assets/pdf/…" })
      ]
    },
    chat: {
      label: "Chatbot KB", plural: "Chatbot replies", icon: "message",
      fields: [
        F({ type: "section", label: "Reply", search: false }),
        F({ key: "channel", label: "Channel", type: "select", required: true, options: ["Admissions", "Programs", "Support"], filter: true }),
        F({ key: "question", label: "Question", type: "text", required: true, main: true, sub: "channel" }),
        F({ key: "keywords", label: "Keywords", type: "text", hint: "Comma-separated words the chatbot matches against", full: true }),
        F({ key: "answer", label: "Answer", type: "textarea", required: true, full: true }),
        F({ key: "active", label: "Active", type: "toggle", table: true })
      ]
    },
    facilities: {
      label: "Facilities", plural: "Campus facilities", icon: "facility",
      fields: [
        F({ type: "section", label: "Facility", search: false }),
        F({ key: "name", label: "Facility name", type: "text", required: true, main: true, sub: "category" }),
        F({ key: "category", label: "Category", type: "select", options: ["Learning", "Library", "IT", "Sports", "Student Life"], filter: true, table: true }),
        F({ key: "icon", label: "Icon (emoji)", type: "text", hint: "A single emoji shown on the card", table: true }),
        F(FILE("image"), { key: "image", label: "Photo", hint: "Optional photo (max 2MB)" }),
        F({ type: "section", label: "Description", search: false }),
        F({ key: "desc", label: "Description", type: "textarea", full: true })
      ]
    },
    landmarks: {
      label: "Campus Map", plural: "Map landmarks", icon: "map",
      fields: [
        F({ type: "section", label: "Landmark", search: false }),
        F({ key: "name", label: "Place name", type: "text", required: true, main: true, sub: "category" }),
        F({ key: "category", label: "Category", type: "select", options: ["Academic", "Library", "IT", "Sports", "Student Life", "General"], filter: true, table: true }),
        F({ key: "icon", label: "Icon (emoji)", type: "text", hint: "A single emoji shown on the marker", table: true }),
        F({ type: "section", label: "Position on map", search: false }),
        F({ key: "x", label: "Horizontal position % (0–100)", type: "number", required: true, table: true }),
        F({ key: "y", label: "Vertical position % (0–100)", type: "number", required: true, table: true }),
        F({ key: "desc", label: "Description", type: "textarea", full: true })
      ]
    }
  };

  /* ---------- pages & sections model ---------- */
  var PAGES = [
    { slug: "index", title: "Home", url: "index.html", sections: [
      { key: "hero.eyebrow", label: "Hero eyebrow", value: "Pokhara · Since 2002" },
      { key: "hero.title", label: "Hero title", value: "Affordable Quality Education in the Heart of Pokhara" },
      { key: "hero.sub", label: "Hero subtitle", value: "BBA, BCSIT & BBA-Finance at Pokhara College of Management, Gyan Marg Nadipur." },
      { key: "ticker", label: "News ticker", value: "Admissions open for 2083 | Entrance schedule published" },
      { key: "programs.title", label: "Programs section title", value: "Programs built for the careers of tomorrow" },
      { key: "news.title", label: "News section title", value: "What's happening at PCM" },
      { key: "notices.title", label: "Notices section title", value: "Official notices" },
      { key: "achievements.title", label: "Achievements title", value: "Our students keep achieving" }
    ]},
    { slug: "about", title: "About PCM", url: "about.html", sections: [
      { key: "hero.title", label: "Hero title", value: "About Pokhara College of Management" },
      { key: "intro.title", label: "Intro title", value: "Quality education, affordable and close to home" },
      { key: "stats.value", label: "Students", value: "1000+" },
      { key: "achievements.title", label: "Achievements title", value: "Milestones worth celebrating" }
    ]},
    { slug: "about-board", title: "Board of Directors", url: "about-board.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Our Board of Directors" },
      { key: "promise.title", label: "Promise title", value: "Governance rooted in student success" }
    ]},
    { slug: "about-message", title: "Messages", url: "about-message.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Words from our leaders" }
    ]},
    { slug: "admission", title: "Admission", url: "admission.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Admissions Open 2083" },
      { key: "deadline", label: "Application deadline", value: "Shrawan 2083" },
      { key: "process.title", label: "Process title", value: "How to apply" }
    ]},
    { slug: "programs", title: "Programs", url: "programs.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Our Programs" }
    ]},
    { slug: "news", title: "News", url: "news.html", sections: [
      { key: "hero.title", label: "Hero title", value: "News & Updates" },
      { key: "featured.title", label: "Featured story title", value: "BBA student Prabhat awarded Rs. 12 lakh grant" }
    ]},
    { slug: "notice", title: "Notices", url: "notice.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Notices & Circulars" }
    ]},
    { slug: "results", title: "Results", url: "results.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Examination Results" }
    ]},
    { slug: "gallery", title: "Gallery", url: "gallery.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Campus Gallery" },
      { key: "section.title", label: "Section title", value: "Glimpses of PCM" }
    ]},
    { slug: "faculty", title: "Faculty", url: "faculty.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Our Faculty & Staff" }
    ]},
    { slug: "alumni", title: "Alumni", url: "alumni.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Alumni & Family" },
      { key: "world.title", label: "Alumni in the world title", value: "Alumni in the world" }
    ]},
    { slug: "clubs", title: "Clubs", url: "clubs.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Student Clubs" }
    ]},
    { slug: "blogs", title: "Blogs", url: "blogs.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Campus Stories & News" }
    ]},
    { slug: "faq", title: "FAQ", url: "faq.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Frequently Asked Questions" }
    ]},
    { slug: "contact", title: "Contact", url: "contact.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Contact Us" },
      { key: "address", label: "Address line", value: "Gyan Marg, Nadipur, Pokhara-2" }
    ]},
    { slug: "life", title: "Campus Life", url: "life.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Life at PCM" }
    ]},
    { slug: "scholarship", title: "Scholarships", url: "scholarship.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Scholarships & Support" }
    ]},
    { slug: "program-bba", title: "BBA Program", url: "program-bba.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Bachelor of Business Administration (BBA)" }
    ]},
    { slug: "program-bcsit", title: "BCSIT Program", url: "program-bcsit.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Bachelor of Science in Computer Science & IT" }
    ]},
    { slug: "program-bba-finance", title: "BBA-Finance", url: "program-bba-finance.html", sections: [
      { key: "hero.title", label: "Hero title", value: "BBA in Finance" }
    ]},
    { slug: "terms", title: "Terms & Services", url: "terms.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Terms & Services" }
    ]},
    { slug: "privacy", title: "Privacy Policy", url: "privacy.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Privacy Policy" }
    ]},
    { slug: "events", title: "Events & Workshops", url: "events.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Events & Workshops" }
    ]},
    { slug: "downloads", title: "Downloads", url: "downloads.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Downloads" }
    ]},
    { slug: "placements", title: "Placements & Careers", url: "placements.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Placements & Careers" }
    ]},
    { slug: "testimonials", title: "Student Testimonials", url: "testimonials.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Student Testimonials" }
    ]},
    { slug: "facilities", title: "Campus & Facilities", url: "facilities.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Campus & Facilities" },
      { key: "section.title", label: "Section title", value: "Facilities designed around you" }
    ]},
    { slug: "campus-map", title: "Campus Map", url: "campus-map.html", sections: [
      { key: "hero.title", label: "Hero title", value: "Campus Map" },
      { key: "section.title", label: "Section title", value: "Explore the Nadipur campus" }
    ]}
  ];

  /* ---------- SEO model (global + per-page meta) ---------- */
  var SEED_SEO = {
    global: {
      siteTitle: "Pokhara College of Management",
      siteDescription: "Pokhara College of Management - affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
      siteKeywords: "pokhara college, PCM, BBA, BBA-Finance, BCSIT, Pokhara University, management college, admission",
      ogType: "website",
      ogImage: "assets/img/hero-1.jpg",
      twitterCard: "summary_large_image",
      robots: "index, follow",
      canonical: "https://www.pcm.edu.np/"
    },
    pages: {}
  };
  (function () {
    PAGES.forEach(function (pg) {
      var hero = "";
      (pg.sections || []).forEach(function (s) { if (s.key === "hero.title") hero = s.value; });
      SEED_SEO.pages[pg.slug] = {
        title: (hero || pg.title) + " | Pokhara College of Management",
        description: hero || "Learn more about " + pg.title + " at Pokhara College of Management.",
        keywords: pg.title.toLowerCase() + ", pokhara college, PCM",
        robots: "index, follow"
      };
    });
    ["news-details", "blogs-student", "gpa-converter", "np-en-converter"].forEach(function (extra) {
      SEED_SEO.pages[extra] = {
        title: "Pokhara College of Management",
        description: "Pokhara College of Management - affordable, quality management and IT education in Pokhara.",
        keywords: "pokhara college, PCM, Pokhara University",
        robots: "index, follow"
      };
    });
  })();

  /* ---------- seed content ---------- */
  function d(day, month, year) {
    return year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }

  var SEED = {
    news: [
      { id: "n1", title: "BBA student Prabhat awarded Rs. 12 lakh entrepreneurship grant", category: "Achievement", date: d(24, 7, 2026), views: 4200, image: "assets/img/hero-3.jpg", excerpt: "A proud milestone for PCM's culture of enterprise and innovation.", featured: true, status: "published" },
      { id: "n2", title: "Annual Fest 2083 dates announced", category: "News", date: d(18, 7, 2026), views: 3100, image: "assets/img/hero-4.jpg", excerpt: "Save the dates for the flagship annual celebration.", featured: false, status: "published" },
      { id: "n3", title: "Admissions open for 2083 intake", category: "News", date: d(5, 7, 2026), views: 5400, image: "assets/img/hero-2.jpg", excerpt: "Applications across BBA, BCSIT and BBA-Finance are now open.", featured: false, status: "published" },
      { id: "n4", title: "Guest lecture series resumes this semester", category: "Event", date: d(28, 6, 2026), views: 1650, image: "assets/img/hero-6.jpg", excerpt: "Industry leaders return to PCM to share real-world insight.", featured: false, status: "published" }
    ],
    notices: [
      { id: "no1", title: "Entrance Examination Schedule - 2083", date: d(21, 6, 2026), views: 3200, file: "assets/pdf/entrance-schedule-2083.pdf" },
      { id: "no2", title: "Admission Form Deadline", date: d(18, 6, 2026), views: 2800, file: "assets/pdf/admission-open-2083.pdf" },
      { id: "no3", title: "Scholarship Applications Open", date: d(10, 6, 2026), views: 2100, file: "assets/pdf/scholarship-open-2083.pdf" },
      { id: "no4", title: "Semester Result Publication", date: d(2, 6, 2026), views: 1900, file: "assets/pdf/semester-result-publication.pdf" },
      { id: "no5", title: "Annual Fest 2083 Dates Announced", date: d(28, 5, 2026), views: 1300, file: "assets/pdf/annual-fest-2083.pdf" }
    ],
    results: [
      { id: "r1", title: "BBA 8th Semester Result - 2082", program: "BBA", date: d(15, 7, 2026), views: 4100, file: "assets/pdf/bba-8th-semester-2082.pdf" },
      { id: "r2", title: "BCSIT 3rd Semester Result - 2082", program: "BCSIT", date: d(28, 6, 2026), views: 2700, file: "assets/pdf/bcsit-3rd-semester-2082.pdf" },
      { id: "r3", title: "BBA-Finance 5th Semester Result - 2082", program: "BBA-Finance", date: d(12, 6, 2026), views: 2300, file: "assets/pdf/bba-finance-5th-semester-2082.pdf" },
      { id: "r4", title: "BBA 6th Semester Result - 2082", program: "BBA", date: d(2, 6, 2026), views: 2000, file: "assets/pdf/bba-6th-semester-2082.pdf" },
      { id: "r5", title: "BCSIT 1st Semester Result - 2082", program: "BCSIT", date: d(25, 5, 2026), views: 1800, file: "assets/pdf/bcsit-1st-semester-2082.pdf" },
      { id: "r6", title: "BBA-Finance 3rd Semester Result - 2082", program: "BBA-Finance", date: d(18, 5, 2026), views: 1500, file: "assets/pdf/bba-finance-3rd-semester-2082.pdf" },
      { id: "r7", title: "BBA 4th Semester Result - 2082", program: "BBA", date: d(10, 5, 2026), views: 1700, file: "assets/pdf/bba-4th-semester-2082.pdf" },
      { id: "r8", title: "BCSIT 5th Semester Result - 2081", program: "BCSIT", date: d(2, 4, 2026), views: 1400, file: "assets/pdf/bcsit-5th-semester-2081.pdf" }
    ],
    events: [
      { id: "e1", title: "Data Analytics Workshop", type: "Workshop", date: d(26, 6, 2026), location: "IT Lab", seats: 40, desc: "Hands-on sessions on the tools shaping tomorrow's workplace." },
      { id: "e2", title: "Annual Fest 2083", type: "Festival", date: d(5, 7, 2026), location: "Campus Ground", seats: 500, desc: "Music, dance, inter-batch contests and the flagship fest night." },
      { id: "e3", title: "Annapurna Educational Tour", type: "Tour", date: d(19, 6, 2026), location: "Annapurna Region", seats: 60, desc: "Learning beyond the classroom." },
      { id: "e4", title: "Inter-Batch Tournament", type: "Sports", date: d(14, 6, 2026), location: "Campus Ground", seats: 200, desc: "Football, futsal and cricket keep the PCM spirit competitive." },
      { id: "e5", title: "Mock Press Conference", type: "Seminar", date: d(9, 6, 2026), location: "Seminar Hall", seats: 80, desc: "Students build confidence and communication skills." }
    ],
    programs: [
      { id: "p1", name: "BBA", code: "BBA", level: "Bachelor", duration: "4 years", seats: 60, status: "open", intro: "Bachelor of Business Administration — build management and leadership skills.", eligibility: "+2 or equivalent, PU entrance exam" },
      { id: "p2", name: "BCSIT", code: "BCSIT", level: "Bachelor (IT)", duration: "4 years", seats: 48, status: "open", intro: "Bachelor of Science in Computer Science & Information Technology.", eligibility: "+2 Science or Management, PU entrance exam" },
      { id: "p3", name: "BBA-Finance", code: "BBA-F", level: "Bachelor (Finance)", duration: "4 years", seats: 40, status: "open", intro: "BBA with a focused finance specialisation.", eligibility: "+2 or equivalent, PU entrance exam" }
    ],
    scholarships: [
      { id: "s1", title: "Merit scholarships", type: "Merit", active: true, desc: "Top performers in the entrance examination and academic results are rewarded with tuition concessions." },
      { id: "s2", title: "Pokhara University awards", type: "University", active: true, desc: "Eligible students may receive PU merit and full scholarships as per university provisions." },
      { id: "s3", title: "Need-based support", type: "Need-based", active: true, desc: "Partial concessions for students from economically disadvantaged backgrounds." },
      { id: "s4", title: "Category & inclusion", type: "Category", active: true, desc: "Provisions supporting women, students from remote regions and under-represented communities." }
    ],
    faqs: [
      { id: "f1", question: "What programs does PCM offer?", category: "Programs", answer: "PCM offers BBA, BCSIT and BBA-Finance under Pokhara University." },
      { id: "f2", question: "How do I apply for admission?", category: "Admission", answer: "Fill the online admission form, appear for the entrance exam and interview." },
      { id: "f3", question: "What scholarships are available?", category: "Scholarship", answer: "Merit, need-based, university and category scholarships." },
      { id: "f4", question: "Is hostel accommodation available?", category: "Campus", answer: "No on-site hostel, but PCM supports students in finding nearby housing." },
      { id: "f5", question: "What is the admission deadline?", category: "Admission", answer: "Applications are accepted until the entrance exam date for the 2083 intake." },
      { id: "f6", question: "Are evening classes available?", category: "Programs", answer: "BBA runs both morning and day shifts to suit working students." },
      { id: "f7", question: "How do I contact the college office?", category: "General", answer: "Call (061) 544761 or email info@pcm.edu.np." }
    ],
    faculty: [
      { id: "fa1", name: "Ms. Leena Negi Shrestha", role: "Principal", group: "Leadership", photo: "assets/img/people/staff_leena.jpg", email: "principal@pcm.edu.np" },
      { id: "fa2", name: "Er. Hari Baral", role: "BCSIT Coordinator", group: "Leadership", photo: "assets/img/people/staff_haribaral.jpg", email: "haribaral@pcm.edu.np" },
      { id: "fa3", name: "Mr. Hari Adhikari", role: "BBA Coordinator (Morning)", group: "Faculty", photo: "assets/img/people/fac_hariadhikari.jpg" },
      { id: "fa4", name: "Mr. Saroj Kuwar", role: "BBA Coordinator (Day)", group: "Faculty", photo: "assets/img/people/fac_saroj.jpg" },
      { id: "fa5", name: "Mr. Manoj Shrestha", role: "Faculty Member", group: "Faculty", photo: "assets/img/people/fac_manoj.jpg" },
      { id: "fa6", name: "Mr. Dammar Khadayat", role: "Faculty Member", group: "Faculty", photo: "assets/img/people/fac_dammar.jpg" },
      { id: "fa7", name: "Mr. Shusan Poudel", role: "Administrator (Morning)", group: "Administration", photo: "assets/img/people/staff_shusan.jpg" },
      { id: "fa8", name: "Mr. Agandhar Subedi", role: "Accountant", group: "Administration", photo: "assets/img/people/staff_agandhar.jpg" },
      { id: "fa9", name: "Mr. Suresh Chaudhary", role: "Accountant Assist", group: "Administration", photo: "assets/img/people/staff_suresh.jpg" },
      { id: "fa10", name: "Mr. Apil Ghimire", role: "IT Technician", group: "Administration", photo: "assets/img/people/staff_apil.jpg" },
      { id: "fa11", name: "Mr. Tejendra Dahal", role: "Driver / Store", group: "Administration", photo: "assets/img/people/staff_apil.jpg" },
      { id: "fa12", name: "Ms. Sabita K.C", role: "Executive Secretary", group: "Administration", photo: "assets/img/people/staff_leena.jpg" },
      { id: "fa13", name: "Mr. Basanta B. Basnet", role: "Office Secretary", group: "Administration", photo: "assets/img/people/staff_agandhar.jpg" },
      { id: "fa14", name: "Mr. Surendra Timilsena", role: "Office Assistant", group: "Administration", photo: "assets/img/people/fac_manoj.jpg" },
      { id: "fa15", name: "Mr. Ram Krishna Adhikari", role: "Office Assistant", group: "Administration", photo: "assets/img/people/fac_dammar.jpg" },
      { id: "fa16", name: "Ms. Rupa Shris", role: "Sweeper", group: "Administration", photo: "assets/img/people/staff_shusan.jpg" },
      { id: "fa17", name: "Mr. Binod Adhikari", role: "Faculty Member", group: "Faculty", photo: "assets/img/people/fac_saroj.jpg" },
      { id: "fa18", name: "Ms. Sabita Gurung", role: "Faculty Member", group: "Faculty", photo: "assets/img/people/fac_hariadhikari.jpg" },
      { id: "fa19", name: "Mr. Shusan Lamichhane", role: "Faculty Member", group: "Faculty", photo: "assets/img/people/staff_haribaral.jpg" },
      { id: "fa20", name: "Mr. Surendra Pun", role: "Faculty Member", group: "Faculty", photo: "assets/img/people/fac_manoj.jpg" }
    ],
    board: [
      { id: "b1", name: "Binod Kayastha", role: "Chairperson", order: 1 },
      { id: "b2", name: "Shrawan Kumar Timilisina", role: "Member", order: 2 },
      { id: "b3", name: "Samir Sharma", role: "Member", order: 3 },
      { id: "b4", name: "Suresh Prakash Chataut", role: "Member", order: 4 },
      { id: "b5", name: "Bishwa Kumar Paudel", role: "Member", order: 5 },
      { id: "b6", name: "Pranjol Kayastha", role: "Member", order: 6 },
      { id: "b7", name: "Prof. Tanka Nath Sharma Timilsina", role: "Member", order: 7 }
    ],
    messages: [
      { id: "m1", title: "Words from our leaders — Principal", author: "Ms. Leena Negi Shrestha", role: "Principal", excerpt: "Welcome to PCM — where affordable, quality education changes lives." },
      { id: "m2", title: "Message from the Chairperson", author: "Binod Kayastha", role: "Chairperson", excerpt: "Our commitment to excellence is rooted in integrity and service." },
      { id: "m3", title: "Message from our Advisor", author: "Prof. Tanka Nath Sharma Timilsina", role: "Advisor", excerpt: "We nurture students to go forth and serve their communities." },
      { id: "m4", title: "Message from the BCSIT Coordinator", author: "Er. Hari Baral", role: "BCSIT Coordinator", excerpt: "We bridge classroom learning with the demands of the IT industry." },
      { id: "m5", title: "Message from the BBA Coordinator", author: "Mr. Hari Adhikari", role: "BBA Coordinator", excerpt: "Management education that builds leaders with empathy and skill." }
    ],
    alumni: [
      { id: "a1", name: "Binod Adhikari", batch: "2075", program: "BBA", sector: "Banking & Finance", role: "Relationship Officer, Nabil Bank", location: "Pokhara" },
      { id: "a2", name: "Leena Shrestha", batch: "2074", program: "BBA", sector: "Education", role: "Lecturer", location: "Pokhara" },
      { id: "a3", name: "Hari Baral", batch: "2072", program: "BCSIT", sector: "Technology", role: "IT Lead", location: "Kathmandu" },
      { id: "a4", name: "Tanka Koirala", batch: "2076", program: "BBA", sector: "Entrepreneurship", role: "Founder, local startup", location: "Pokhara" },
      { id: "a5", name: "Sabita Gurung", batch: "2075", program: "BBA-Finance", sector: "Banking & Finance", role: "Credit Officer", location: "Kaski" },
      { id: "a6", name: "Shusan Lamichhane", batch: "2077", program: "BCSIT", sector: "Technology", role: "Software Engineer", location: "Australia" },
      { id: "a7", name: "Surendra Pun", batch: "2073", program: "BBA", sector: "Education", role: "Researcher", location: "Europe" },
      { id: "a8", name: "Saroj Kuwar", batch: "2071", program: "BBA", sector: "Entrepreneurship", role: "Business Owner", location: "Pokhara" }
    ],
    clubs: [
      { id: "c1", name: "Eco-PCM Club", icon: "🌱", tagline: "Green campus, green future", desc: "Green initiatives, campus clean-ups and tree planting drives.", members: [
        { id: "cm1", photo: "assets/img/people/staff_sabita.jpg", name: "Sita Gurung", position: "President", program: "BBA · 4th Sem" },
        { id: "cm2", photo: "assets/img/people/staff_apil.jpg", name: "Ashish Thapa", position: "Vice President", program: "BCSIT · 3rd Sem" },
        { id: "cm3", photo: "assets/img/people/staff_dipa.jpg", name: "Pooja Karki", position: "Secretary", program: "BBA-Finance · 2nd Sem" }
      ] },
      { id: "c2", name: "Finance & Investment Club", icon: "📈", tagline: "Money sense, market insight", desc: "Stock-market simulations, financial literacy and guest talks.", members: [
        { id: "cm4", photo: "assets/img/people/staff_shusan.jpg", name: "Bibek Shrestha", position: "President", program: "BBA-Finance · 4th Sem" },
        { id: "cm5", photo: "assets/img/people/staff_rupa.jpg", name: "Anisha Poudel", position: "Vice President", program: "BBA · 3rd Sem" },
        { id: "cm6", photo: "assets/img/people/staff_somlal.jpg", name: "Kiran Mahato", position: "Treasurer", program: "BBA-Finance · 2nd Sem" }
      ] },
      { id: "c3", name: "Coding & Tech Club", icon: "💻", tagline: "Code, build, innovate", desc: "Hackathons, workshops and open-source projects for BCSIT students.", members: [
        { id: "cm7", photo: "assets/img/people/staff_surendra.jpg", name: "Sujan Bhandari", position: "President", program: "BCSIT · 4th Sem" },
        { id: "cm8", photo: "assets/img/people/staff_chitra.jpg", name: "Nisha Rana", position: "Vice President", program: "BCSIT · 3rd Sem" },
        { id: "cm9", photo: "assets/img/people/staff_tejendra.jpg", name: "Rahul KC", position: "Secretary", program: "BCSIT · 2nd Sem" }
      ] },
      { id: "c4", name: "Debate & Public Speaking Club", icon: "🗣️", tagline: "Words that move", desc: "Inter-college debates, model press conferences and elocution.", members: [
        { id: "cm10", photo: "assets/img/people/staff_ramkrishna.jpg", name: "Pratik Thapa", position: "President", program: "BBA · 4th Sem" },
        { id: "cm11", photo: "assets/img/people/staff_basanta.jpg", name: "Samjhana Adhikari", position: "Vice President", program: "BBA · 3rd Sem" },
        { id: "cm12", photo: "assets/img/people/staff_agandhar.jpg", name: "Roshan Bista", position: "Secretary", program: "BBA · 2nd Sem" }
      ] },
      { id: "c5", name: "Music & Arts Club", icon: "🎸", tagline: "Creating culture", desc: "Bands, open mics and the annual fest cultural showcases.", members: [
        { id: "cm13", photo: "assets/img/people/staff_leena.jpg", name: "Aakriti Sharma", position: "President", program: "BBA · 3rd Sem" },
        { id: "cm14", photo: "assets/img/people/staff_mukti.jpg", name: "Anup Baral", position: "Vice President", program: "BBA-Finance · 2nd Sem" },
        { id: "cm15", photo: "assets/img/people/staff_haribaral.jpg", name: "Bipana Rai", position: "Secretary", program: "BCSIT · 2nd Sem" }
      ] },
      { id: "c6", name: "Sports Club", icon: "⚽", tagline: "Play hard, stay healthy", desc: "Football, volleyball, basketball and inter-batch tournaments.", members: [
        { id: "cm16", photo: "assets/img/people/staff_suresh.jpg", name: "Niraj Tamang", position: "President", program: "BBA · 4th Sem" },
        { id: "cm17", photo: "assets/img/people/fac_manoj.jpg", name: "Deepak Gurung", position: "Vice President", program: "BBA · 3rd Sem" },
        { id: "cm18", photo: "assets/img/people/board_samir.jpg", name: "Bipin K.C.", position: "Secretary", program: "BCSIT · 2nd Sem" }
      ] }
    ],
    blogs: [
      { id: "bl1", title: "My summer internship at a Pokhara tech firm", author: "S. Lamichhane", category: "Internships", date: d(8, 7, 2026), status: "published", excerpt: "First-person account of internship life in a local tech firm." },
      { id: "bl2", title: "Behind the scenes of Annual Fest 2026", author: "Student Council", category: "Campus Life", date: d(2, 7, 2026), status: "published", excerpt: "The planning, the rehearsals, the energy of fest week." },
      { id: "bl3", title: "A field visit inside Nepal's banking sector", author: "A. Gurung", category: "Finance", date: d(25, 6, 2026), status: "published", excerpt: "What our students learned on the banking field visit." },
      { id: "bl4", title: "How a mock press conference changed my confidence", author: "P. Shrestha", category: "Skills", date: d(15, 6, 2026), status: "published", excerpt: "From nervous to bold in one session." },
      { id: "bl5", title: "Finding my people: joining PCM's student clubs", author: "M. Karki", category: "Clubs", date: d(5, 6, 2026), status: "published", excerpt: "How clubs shaped the student experience." },
      { id: "bl6", title: "Entrance preparation: tips from toppers", author: "Academic Cell", category: "Student Stories", date: d(28, 5, 2026), status: "draft", excerpt: "Advice for prospective students ahead of the entrance exam." }
    ],
    gallery: [
      { id: "g1", album: "PCM FEST 2083", category: "Cultural", date: d(5, 7, 2026), count: 4, cover: "assets/img/hero-4.jpg", photos: [
        { title: "Annual Fest 2083", tag: "Annual Fest", src: "assets/img/hero-4.jpg" },
        { title: "Fest Night Concert", tag: "Annual Fest", src: "assets/img/hero-3.jpg" },
        { title: "Cultural Program", tag: "Cultural", src: "assets/img/hero-4.jpg" },
        { title: "Graduation Day", tag: "Convocation", src: "assets/img/about-graduation.jpg" }
      ] },
      { id: "g2", album: "Demo Press Meet", category: "Academic", date: d(10, 7, 2026), count: 2, cover: "assets/img/hero-6.jpg", photos: [
        { title: "Guest Lecture Series", tag: "Seminar", src: "assets/img/hero-6.jpg" },
        { title: "Project Showcase", tag: "Presentation", src: "assets/img/hero-6.jpg" }
      ] },
      { id: "g3", album: "Data Analytics Workshop", category: "Academic", date: d(26, 6, 2026), count: 2, cover: "assets/img/hero-3.jpg", photos: [
        { title: "Data Analytics Workshop", tag: "Workshop", src: "assets/img/hero-3.jpg" },
        { title: "Startup Bootcamp", tag: "Workshop", src: "assets/img/hero-2.jpg" }
      ] },
      { id: "g4", album: "Annapurna Educational Tour", category: "Tour", date: d(19, 6, 2026), count: 3, cover: "assets/img/about-2.jpg", photos: [
        { title: "Annapurna Field Trip", tag: "Educational Tour", src: "assets/img/about-2.jpg" },
        { title: "Lakeside Study Walk", tag: "City Tour", src: "assets/img/hero-5.jpg" },
        { title: "IT Company Visit", tag: "Industrial Visit", src: "assets/img/hero-6.jpg" }
      ] },
      { id: "g5", album: "Inter-Batch Tournament", category: "Sports", date: d(14, 6, 2026), count: 2, cover: "assets/img/about-games.jpg", photos: [
        { title: "Inter-Batch Tournament", tag: "Sports", src: "assets/img/about-games.jpg" },
        { title: "Athletics Meet", tag: "Sports Day", src: "assets/img/about-games.jpg" }
      ] },
      { id: "g6", album: "Campus Life", category: "Albums", date: d(1, 1, 2026), count: 3, cover: "assets/img/about-1.jpg", photos: [
        { title: "Our Nadipur Campus", tag: "Campus", src: "assets/img/about-1.jpg" },
        { title: "Learning Resource Centre", tag: "Library", src: "assets/img/about-1.jpg" },
        { title: "Smart Classrooms", tag: "Classroom", src: "assets/img/about-2.jpg" }
      ] }
    ],
    downloads: [
      { id: "d1", title: "PCM Prospectus 2083", category: "Prospectus", date: d(1, 7, 2026), size: 2400, file: "assets/pdf/prospectus-2083.pdf", desc: "Complete prospectus for the 2083 intake — programs, fees, facilities and admission details." },
      { id: "d2", title: "Admission Application Form 2083", category: "Admission Form", date: d(1, 7, 2026), size: 380, file: "assets/pdf/admission-form-2083.pdf", desc: "Application form for BBA, BBA-Finance and BCSIT admissions. Submit to the college office." },
      { id: "d3", title: "BBA Syllabus (Pokhara University)", category: "Syllabus", date: d(15, 6, 2026), size: 5200, file: "assets/pdf/syllabus-bba.pdf", desc: "Full BBA course structure and curriculum as per Pokhara University." },
      { id: "d4", title: "Scholarship Application Form", category: "Scholarship Form", date: d(20, 6, 2026), size: 210, file: "assets/pdf/scholarship-form.pdf", desc: "Apply for merit and need-based scholarships under PCM's support programs." }
    ],
    chat: [
      { id: "c1", channel: "Admissions", question: "How do I apply?", keywords: "how to apply, apply, admission process, application", answer: "Visit the <b>admission.html</b> page to start your application, or drop by the college office at Nadipur with your marksheets and photos.", active: true },
      { id: "c2", channel: "Admissions", question: "Entrance exam date", keywords: "entrance exam, entrance date, exam schedule", answer: "The entrance exam is held each year before the new intake. The date and hall details are published on the Notices page.", active: true },
      { id: "c3", channel: "Admissions", question: "Scholarships", keywords: "scholarship, financial aid, merit", answer: "PCM offers merit and need-based scholarships. See the <b>scholarship.html</b> page for full criteria.", active: true },
      { id: "c4", channel: "Programs", question: "Tell me about BBA", keywords: "bba, business administration", answer: "The BBA is a 4-year, 120-credit degree producing professional managers. Explore the curriculum on <b>program-bba.html</b>.", active: true },
      { id: "c5", channel: "Programs", question: "BCSIT details", keywords: "bcsit, csit, computer science, it", answer: "BCSIT is a 4-year, 127-credit degree merging IT with business management. See <b>program-bcsit.html</b>.", active: true },
      { id: "c6", channel: "Support", question: "Where is the campus?", keywords: "where is, location, campus, address", answer: "We're at Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal. See the <b>contact.html</b> page.", active: true },
      { id: "c7", channel: "Support", question: "Contact the college", keywords: "contact, phone, call, email", answer: "Call us at (061) 544761 / 570124, email <b>info@pcm.edu.np</b>, or use the form on <b>contact.html</b>.", active: true }
    ],
    facilities: [
      { id: "f1", name: "Smart Classrooms", category: "Learning", icon: "🏫", image: "assets/img/about-2.jpg", desc: "Spacious, well-lit classrooms with modern projectors, AV systems and comfortable seating." },
      { id: "f2", name: "Learning Resource Centre", category: "Library", icon: "📚", image: "assets/img/about-1.jpg", desc: "A quiet, fully-stocked library with reference texts, journals, e-resources and study desks." },
      { id: "f3", name: "IT & Computer Labs", category: "IT", icon: "💻", image: "assets/img/hero-6.jpg", desc: "Dedicated labs with up-to-date computers and software for BCSIT practicals and coding workshops." },
      { id: "f4", name: "Seminar Hall", category: "Learning", icon: "🎤", image: "assets/img/hero-3.jpg", desc: "A modern hall for guest lectures, presentations, events and student showcases." },
      { id: "f5", name: "Sports & Recreation", category: "Sports", icon: "⚽", image: "assets/img/about-games.jpg", desc: "Football, volleyball and basketball spaces plus indoor recreation to stay active between classes." },
      { id: "f6", name: "Cafeteria & Common Room", category: "Student Life", icon: "☕", image: "assets/img/hero-5.jpg", desc: "A clean, friendly place for meals, snacks and hanging out — the heart of daily campus life." }
    ],
    landmarks: [
      { id: "l1", name: "Main Building", category: "Academic", icon: "🏫", x: 18, y: 40, desc: "Classrooms, faculty rooms and the admissions desk. The heart of the college." },
      { id: "l2", name: "Administrative Office", category: "Academic", icon: "🗂️", x: 11, y: 27, desc: "Exams, records, certificates and general enquiries are handled here." },
      { id: "l3", name: "Learning Resource Centre", category: "Library", icon: "📚", x: 47, y: 25, desc: "Our library with reference texts, journals, e-resources and quiet study areas." },
      { id: "l4", name: "IT & Computer Labs", category: "IT", icon: "💻", x: 77, y: 30, desc: "Modern computers and software for BCSIT practicals and workshops." },
      { id: "l5", name: "Seminar Hall", category: "Academic", icon: "🎤", x: 47, y: 57, desc: "Guest lectures, presentations and college events are hosted here." },
      { id: "l6", name: "Cafeteria", category: "Student Life", icon: "☕", x: 75, y: 62, desc: "Meals, snacks and the daily buzz of campus life between classes." },
      { id: "l7", name: "Sports Ground", category: "Sports", icon: "⚽", x: 13, y: 76, desc: "Football, volleyball and outdoor games for every batch." },
      { id: "l8", name: "Main Gate", category: "General", icon: "🚪", x: 45, y: 79, desc: "The main entrance on Gyan Marg. Visitor passes available at the gate." }
    ]
  };

  /* ---------- seed users & roles ---------- */
  var SEED_USERS = [
    { id: "u1", u: "admin", p: "admin123", name: "Administrator", role: "superadmin", active: true, createdAt: d(1, 1, 2026) },
    { id: "u2", u: "editor", p: "editor123", name: "Content Editor", role: "editor", active: true, createdAt: d(1, 1, 2026) },
    { id: "u3", u: "viewer", p: "viewer123", name: "Guest Viewer", role: "viewer", active: true, createdAt: d(1, 1, 2026) }
  ];
  var SEED_ROLES = {
    superadmin: { label: "Super Admin", color: "red", manageUsers: true, manageBackup: true, manageSettings: true, managePages: true, contentAdd: true, contentEdit: true, contentDelete: true, trashRestore: true, trashPurge: true, upload: true },
    editor: { label: "Editor", color: "blue", manageUsers: false, manageBackup: false, manageSettings: false, managePages: true, contentAdd: true, contentEdit: true, contentDelete: false, trashRestore: false, trashPurge: false, upload: true },
    viewer: { label: "Viewer", color: "green", manageUsers: false, manageBackup: false, manageSettings: false, managePages: false, contentAdd: false, contentEdit: false, contentDelete: false, trashRestore: false, trashPurge: false, upload: false }
  };
  var ROLE_PERM_DEFS = [
    { key: "manageUsers", label: "Manage users & roles" },
    { key: "manageBackup", label: "Manage backups & restore" },
    { key: "manageSettings", label: "Manage system settings" },
    { key: "managePages", label: "Edit pages & sections" },
    { key: "contentAdd", label: "Add content" },
    { key: "contentEdit", label: "Edit content" },
    { key: "contentDelete", label: "Delete content (to trash)" },
    { key: "trashRestore", label: "Restore from trash" },
    { key: "trashPurge", label: "Empty trash / purge permanently" },
    { key: "upload", label: "Upload files" }
  ];

  /* ---------- data normalisation ---------- */
  function normalizeData(d) {
    if (!d || typeof d !== "object") d = {};
    Object.keys(SCHEMAS).forEach(function (k) {
      if (!Array.isArray(d[k])) d[k] = clone(SEED[k] || []);
      if (!d.trash || !Array.isArray(d.trash[k])) { d.trash = d.trash || {}; d.trash[k] = []; }
    });
    if (!Array.isArray(d.users) || !d.users.length) d.users = clone(SEED_USERS);
    if (!d.roles || typeof d.roles !== "object") d.roles = clone(SEED_ROLES);
    Object.keys(SEED_ROLES).forEach(function (r) {
      if (!d.roles[r]) d.roles[r] = clone(SEED_ROLES[r]);
    });
    if (!Array.isArray(d.backups)) d.backups = [];
    if (!d.trash) d.trash = {};
    if (!d.pageSections) d.pageSections = {};
    if (!d.seo || typeof d.seo !== "object" || !d.seo.global) d.seo = clone(SEED_SEO);
    Object.keys(SEED_SEO.global).forEach(function (gk) {
      if (d.seo.global[gk] === undefined) d.seo.global[gk] = SEED_SEO.global[gk];
    });
    d.seo.pages = d.seo.pages || {};
    Object.keys(SEED_SEO.pages).forEach(function (ps) {
      if (!d.seo.pages[ps]) d.seo.pages[ps] = clone(SEED_SEO.pages[ps]);
    });
    return d;
  }

  /* ---------- IndexedDB helpers ---------- */
  function idbOpen() {
    return new Promise(function (resolve) {
      if (typeof indexedDB === "undefined") return resolve(null);
      var req;
      try { req = indexedDB.open(IDB_NAME, 1); } catch (e) { return resolve(null); }
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { resolve(null); };
      req.onblocked = function () { resolve(null); };
    });
  }
  function idbGet(db, key) {
    return new Promise(function (resolve) {
      try {
        var tx = db.transaction(IDB_STORE, "readonly");
        var req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { resolve(undefined); };
      } catch (e) { resolve(undefined); }
    });
  }
  function idbSet(db, key, val) {
    return new Promise(function (resolve) {
      try {
        var tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(val, key);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      } catch (e) { resolve(false); }
    });
  }

  /* ---------- store ---------- */
  var Store = {
    data: null,
    activity: [],
    _db: null,
    _mode: "localStorage",
    _saveTimer: null,

    init: function () {
      var self = this;
      return new Promise(function (resolve) {
        idbOpen().then(function (db) {
          self._db = db;
          function fromLocal() {
            var loaded = false;
            try {
              var raw = localStorage.getItem(LS_KEY);
              if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && parsed.data) {
                  self.data = normalizeData(parsed.data);
                  self.activity = Array.isArray(parsed.activity) ? parsed.activity : [];
                  loaded = true;
                }
              }
            } catch (e) {}
            if (!loaded) {
              self.data = normalizeData(clone(SEED));
              self.activity = [{ id: uid("act"), type: "login", message: "Admin panel initialised with demo content", time: new Date().toISOString() }];
            }
            self._mode = "localStorage";
            self.save();
            resolve();
          }
          if (db) {
            idbGet(db, "state").then(function (v) {
              if (v && v.data) {
                self.data = normalizeData(v.data);
                self.activity = Array.isArray(v.activity) ? v.activity : [];
                self._mode = "IndexedDB";
                // mirror to localStorage for portability (best-effort)
                self._mirror();
                resolve();
              } else {
                fromLocal();
              }
            });
          } else {
            fromLocal();
          }
        });
      });
    },

    _persistIDB: function (payload) {
      var self = this;
      if (!this._db) return;
      idbSet(this._db, "state", payload).then(function (ok) {
        if (!ok) self._mode = "localStorage";
      });
    },

    _mirror: function () {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ data: this.data, activity: this.activity }));
      } catch (e) {}
    },

    save: function () {
      var payload = { data: this.data, activity: this.activity, updated: new Date().toISOString() };
      var self = this;
      if (this._db) {
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(function () {
          self._persistIDB(payload);
          self._mirror();
        }, 120);
      } else {
        try { localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch (e) {}
      }
    },

    size: function () {
      try { return bytesToSize(new Blob([JSON.stringify(this.data)]).size); } catch (e) { return "0 B"; }
    },
    storageMode: function () { return this._mode; },

    log: function (type, message) {
      this.activity.unshift({ id: uid("act"), type: type, message: message, time: new Date().toISOString() });
      if (this.activity.length > 80) this.activity = this.activity.slice(0, 80);
      this.save();
    },
    get: function (col) { return (this.data && this.data[col]) || []; },
    set: function (col, rows) { if (!this.data) return; this.data[col] = rows; this.save(); },
    upsert: function (col, row) {
      var rows = this.get(col);
      var idx = rows.findIndex(function (r) { return r.id === row.id; });
      if (idx === -1) rows.unshift(row); else rows[idx] = row;
      this.data[col] = rows;
      this.save();
      return row;
    },
    remove: function (col, id) {
      var rows = this.get(col);
      this.data[col] = rows.filter(function (r) { return r.id !== id; });
      this.save();
    },

    /* ---------- trash (recycle bin) ---------- */
    trashFor: function (col) { return (this.data.trash && this.data.trash[col]) || []; },
    trashCount: function () {
      var n = 0;
      Object.keys(SCHEMAS).forEach(function (k) { n += (Store.data.trash && Store.data.trash[k] || []).length; });
      return n;
    },
    toTrash: function (col, row, by) {
      var t = this.trashFor(col);
      t.unshift(Object.assign({}, row, { _deletedAt: new Date().toISOString(), _deletedBy: by || "admin" }));
      this.data.trash[col] = t;
      this.data[col] = this.get(col).filter(function (r) { return r.id !== row.id; });
      this.log("delete", "Moved to trash: " + (row.title || row.name || row.album || row.question || "item"));
      this.save();
    },
    restore: function (col, item) {
      var t = this.trashFor(col).filter(function (r) { return r.id !== item.id; });
      this.data.trash[col] = t;
      var clean = clone(item);
      delete clean._deletedAt; delete clean._deletedBy;
      this.upsert(col, clean);
      this.log("restore", "Restored: " + (item.title || item.name || item.album || item.question || "item"));
    },
    purge: function (col, id) {
      this.data.trash[col] = this.trashFor(col).filter(function (r) { return r.id !== id; });
      this.log("purge", "Permanently deleted an item from trash");
      this.save();
    },
    purgeAll: function () {
      var n = this.trashCount();
      Object.keys(this.data.trash).forEach(function (k) { Store.data.trash[k] = []; });
      this.log("purge", "Emptied trash (" + n + " items)");
      this.save();
    },

    /* ---------- backups ---------- */
    createBackup: function (name, desc, by) {
      var snap = clone(this.data);
      snap.backups = [];
      var snapshot = JSON.stringify(snap);
      var items = 0;
      Object.keys(SCHEMAS).forEach(function (k) { items += (snap[k] || []).length; });
      var rec = {
        id: uid("bk"), name: name || "Backup " + fmtDate(new Date().toISOString()),
        desc: desc || "", createdAt: new Date().toISOString(), by: by || "admin",
        items: items, size: bytesToSize(snapshot.length), bytes: snapshot.length, snapshot: snapshot
      };
      this.data.backups.unshift(rec);
      if (this.data.backups.length > 20) this.data.backups.pop();
      this.log("backup", "Backup created: " + rec.name);
      this.save();
      return rec;
    },
    restoreBackup: function (id) {
      var rec = this.data.backups.find(function (b) { return b.id === id; });
      if (!rec) throw new Error("Backup not found");
      var keep = this.data.backups;
      var parsed = JSON.parse(rec.snapshot);
      parsed.backups = keep;
      this.data = normalizeData(parsed);
      this.log("restore", "Content restored from backup: " + rec.name);
      this.save();
      return rec;
    },
    deleteBackup: function (id) {
      this.data.backups = this.data.backups.filter(function (b) { return b.id !== id; });
      this.log("backup", "Backup deleted");
      this.save();
    },
    downloadBackup: function (rec) {
      return JSON.stringify({
        exported: rec.createdAt, name: rec.name, desc: rec.desc,
        data: JSON.parse(rec.snapshot), activity: this.activity
      }, null, 2);
    },

    /* ---------- export / import / reset ---------- */
    exportJSON: function () {
      return JSON.stringify({ exported: new Date().toISOString(), app: "pcm-admin", data: this.data, activity: this.activity }, null, 2);
    },
    importJSON: function (txt) {
      var parsed = JSON.parse(txt);
      if (!parsed || !parsed.data) throw new Error("Invalid backup file");
      this.data = normalizeData(parsed.data);
      this.activity = Array.isArray(parsed.activity) ? parsed.activity : this.activity;
      this.log("import", "Content restored from backup file");
      this.save();
      return true;
    },
    reset: function () {
      this.data = normalizeData(clone(SEED));
      // keep current users & roles so nobody gets locked out
      this.data.users = (Store.currentData && Store.currentData.users) ? clone(Store.currentData.users) : clone(SEED_USERS);
      this.data.roles = (Store.currentData && Store.currentData.roles) ? clone(Store.currentData.roles) : clone(SEED_ROLES);
      this.data.backups = (Store.currentData && Store.currentData.backups) ? Store.currentData.backups : [];
      this.data.seo = (Store.currentData && Store.currentData.seo) ? clone(Store.currentData.seo) : clone(SEED_SEO);
      this.data.trash = {};
      Object.keys(SCHEMAS).forEach(function (k) { Store.data.trash[k] = []; });
      this.activity = [{ id: uid("act"), type: "reset", message: "Content reset to demo seed", time: new Date().toISOString() }];
      this.save();
    },

    stats: function () {
      var s = {};
      Object.keys(SCHEMAS).forEach(function (k) { s[k] = Store.get(k).length; });
      s.pages = PAGES.length;
      s.sections = PAGES.reduce(function (n, p) { return n + p.sections.length; }, 0);
      s.photos = Store.get("gallery").reduce(function (n, g) { return n + (g.photos ? g.photos.length : 0); }, 0);
      s.trash = this.trashCount();
      s.backups = (this.data.backups || []).length;
      s.users = (this.data.users || []).length;
      s.seo = Store.seoStats();
      return s;
    },

    seoStats: function () {
      var seo = this.data.seo || SEED_SEO;
      var pages = seo.pages || {};
      var keys = Object.keys(pages);
      var done = keys.filter(function (k) {
        var p = pages[k];
        return p && p.title && p.title.length && p.description && p.description.length;
      }).length;
      return { pages: keys.length, done: done };
    },

    updateSeoGlobal: function (patch) {
      if (!this.data.seo || !this.data.seo.global) this.data.seo = clone(SEED_SEO);
      Object.keys(patch || {}).forEach(function (k) {
        if (patch[k] !== undefined && patch[k] !== null && patch[k] !== "") this.data.seo.global[k] = patch[k];
      }.bind(this));
      Store.log("seo", "Site-wide SEO settings updated");
      this.save();
    },

    updateSeoPage: function (slug, patch) {
      if (!this.data.seo) this.data.seo = clone(SEED_SEO);
      if (!this.data.seo.pages) this.data.seo.pages = {};
      if (!this.data.seo.pages[slug]) this.data.seo.pages[slug] = {};
      Object.keys(patch || {}).forEach(function (k) {
        if (patch[k] !== undefined && patch[k] !== null && patch[k] !== "") this.data.seo.pages[slug][k] = patch[k];
      }.bind(this));
      Store.log("seo", "SEO updated for page \"" + slug + "\"");
      this.save();
    }
  };
  Store.currentData = Store.data;

  /* ---------- auth ---------- */
  var Auth = {
    login: function (u, p) {
      var list = (Store.data && Store.data.users) || [];
      var user = list.find(function (x) { return x.u === u && x.p === p && x.active !== false; });
      if (user) {
        try {
          sessionStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, u: user.u, name: user.name, role: user.role }));
        } catch (e) {}
        Store.log("login", user.name + " signed in as " + (user.role || "user"));
      }
      return !!user;
    },
    logout: function () {
      try { sessionStorage.removeItem(AUTH_KEY); } catch (e) {}
    },
    isAuthed: function () {
      try { return !!sessionStorage.getItem(AUTH_KEY); } catch (e) { return false; }
    },
    user: function () {
      var session = null;
      try { session = JSON.parse(sessionStorage.getItem(AUTH_KEY)); } catch (e) {}
      if (!session) return { u: "", name: "Guest", role: "viewer" };
      var fresh = null;
      if (Store.data && Store.data.users) {
        fresh = Store.data.users.find(function (x) { return (x.id && x.id === session.id) || x.u === session.u; });
      }
      if (!fresh || fresh.active === false) return { u: session.u, name: session.name, role: "viewer", disabled: true };
      return { id: fresh.id, u: fresh.u, name: fresh.name, role: fresh.role };
    },
    isSuperAdmin: function () {
      return this.user().role === "superadmin";
    },
    rolePerms: function (role) {
      var roles = (Store.data && Store.data.roles) || {};
      return roles[role] || SEED_ROLES[role] || {};
    },
    can: function (perm) {
      return !!this.rolePerms(this.user().role)[perm];
    },
    changePassword: function (oldP, newP) {
      var u = this.user().u;
      var list = (Store.data && Store.data.users) || [];
      var user = list.find(function (x) { return x.u === u; });
      if (!user || user.p !== oldP) return false;
      user.p = newP;
      Store.save();
      return true;
    }
  };

  return {
    esc: esc, uid: uid, fmtDate: fmtDate, fmtDateTime: fmtDateTime, timeAgo: timeAgo, initials: initials,
    rgba: rgba, bytesToSize: bytesToSize, isDataUrl: isDataUrl, isImageUrl: isImageUrl, fileLabel: fileLabel, clone: clone,
    icon: icon, ICONS: ICONS, SCHEMAS: SCHEMAS, PAGES: PAGES,
    ROLE_PERM_DEFS: ROLE_PERM_DEFS, SEED_ROLES: SEED_ROLES, SEED_SEO: SEED_SEO,
    Store: Store, Auth: Auth
  };
})();
