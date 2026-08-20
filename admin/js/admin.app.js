/* ============================================================
   PCM Admin — admin/js/admin.app.js
   Shell (sidebar + topbar), login, hash router, boot.
   ============================================================ */
(function () {
  "use strict";
  var A = window.PCMAdmin;
  var esc = A.esc, icon = A.icon, Store = A.Store, Auth = A.Auth, SCHEMAS = A.SCHEMAS, routes = A.routes;

  /* permission-filtered navigation
     sec/href/icon/label/route/col/perm */
  var NAV = [
    { sec: "Overview" },
    { href: "#/dashboard", icon: "dash", label: "Dashboard", route: "dashboard" },
    { href: "#/pages", icon: "pages", label: "Pages & Sections", route: "pages", perm: "managePages" },
    { sec: "Content" },
    { href: "#/content/news", icon: "news", label: "News", route: "content", col: "news" },
    { href: "#/content/notices", icon: "notice", label: "Notices", route: "content", col: "notices" },
    { href: "#/content/results", icon: "result", label: "Results", route: "content", col: "results" },
    { href: "#/content/events", icon: "events", label: "Events & Workshops", route: "content", col: "events" },
    { href: "#/content/programs", icon: "program", label: "Programs", route: "content", col: "programs" },
    { href: "#/content/scholarships", icon: "scholarship", label: "Scholarships", route: "content", col: "scholarships" },
    { href: "#/content/faqs", icon: "faq", label: "FAQs", route: "content", col: "faqs" },
    { sec: "People" },
    { href: "#/content/faculty", icon: "faculty", label: "Faculty & Staff", route: "content", col: "faculty" },
    { href: "#/content/board", icon: "board", label: "Board of Directors", route: "content", col: "board" },
    { href: "#/content/messages", icon: "message", label: "Leadership Messages", route: "content", col: "messages" },
    { href: "#/content/alumni", icon: "alumni", label: "Alumni", route: "content", col: "alumni" },
    { href: "#/content/clubs", icon: "clubs", label: "Clubs", route: "content", col: "clubs" },
    { sec: "Media" },
    { href: "#/content/blogs", icon: "blogs", label: "Blogs", route: "content", col: "blogs" },
    { href: "#/content/gallery", icon: "gallery", label: "Gallery", route: "content", col: "gallery" },
    { href: "#/content/downloads", icon: "download", label: "Downloads", route: "content", col: "downloads" },
    { sec: "Campus" },
    { href: "#/content/facilities", icon: "facility", label: "Facilities", route: "content", col: "facilities" },
    { href: "#/content/landmarks", icon: "map", label: "Campus Map", route: "content", col: "landmarks" },
    { sec: "System" },
    { href: "#/content/chat", icon: "message", label: "Chatbot KB", route: "content", col: "chat" },
    { href: "#/trash", icon: "trash", label: "Trash", route: "trash", perm: "contentDelete", trash: true },
    { href: "#/backups", icon: "archive", label: "Backups", route: "backups", perm: "manageBackup" },
    { href: "#/seo", icon: "seo", label: "SEO & Meta", route: "seo", perm: "manageSettings" },
    { href: "#/users", icon: "users", label: "Users & Roles", route: "users", perm: "manageUsers" },
    { href: "#/settings", icon: "settings", label: "Settings", route: "settings", perm: "manageSettings" }
  ];

  var root = document.getElementById("root");

  /* ---------- login ---------- */
  function showLogin() {
    root.innerHTML = "";
    var page = A.el("div", { class: "login" });
    page.innerHTML =
      '<div class="login__card">' +
      '<a class="login__brand" href="../index.html"><img src="../assets/img/logo-pcm.png" alt="PCM logo"><span><b>PCM Admin</b><span>Pokhara College of Mgmt</span></span></a>' +
      '<div class="login__title"><h1>Welcome back</h1><p>Sign in to manage the website content.</p></div>' +
      '<div class="field"><label for="lu">Username</label><input id="lu" autocomplete="username" placeholder="admin"></div>' +
      '<div class="field"><label for="lp">Password</label><div style="position:relative"><input id="lp" type="password" autocomplete="current-password" placeholder="••••••••" style="padding-right:2.4rem"><button class="icon-btn" id="lp-eye" type="button" style="position:absolute;right:5px;top:50%;transform:translateY(-50%);width:32px;height:32px" aria-label="Show password">' + icon("eye", 16) + "</button></div></div>" +
      '<button class="btn btn-primary btn-block" id="lbtn">Sign in</button>' +
      '<div class="login__hint">Demo — <b>admin</b>/<b>admin123</b> · <b>editor</b>/<b>editor123</b> · <b>viewer</b>/<b>viewer123</b></div>' +
      '<a class="btn btn-ghost btn-block" href="../index.html">← Back to website</a>' +
      "</div>";
    root.appendChild(page);

    var u = page.querySelector("#lu"), p = page.querySelector("#lp"), btn = page.querySelector("#lbtn");
    var eye = page.querySelector("#lp-eye");
    var showing = false;
    eye.addEventListener("click", function () {
      showing = !showing;
      p.type = showing ? "text" : "password";
      eye.innerHTML = icon(showing ? "eyeOff" : "eye", 16);
    });
    function submit() {
      if (Auth.login(u.value.trim(), p.value)) {
        location.hash = "#/dashboard";
        showShell();
      } else {
        A.toast("Invalid username or password", "error");
        p.value = "";
        p.focus();
      }
    }
    btn.addEventListener("click", submit);
    p.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    u.focus();
  }

  /* ---------- shell ---------- */
  function showShell() {
    root.innerHTML =
      '<div class="shell">' +
      '<aside class="sidebar" id="sidebar"></aside>' +
      '<div class="sidebar-scrim" id="scrim"></div>' +
      '<main class="main">' +
      '<header class="topbar">' +
      '<button class="icon-btn burger" id="burger" aria-label="Open menu">' + icon("menu", 18) + "</button>" +
      "<div><h1 class='topbar__title' id='tb-title'>Dashboard</h1><div class='topbar__crumb' id='tb-crumb'>PCM Admin</div></div>" +
      '<div class="topbar__spacer"></div>' +
      '<a class="icon-btn" href="../index.html" target="_blank" rel="noopener" title="View website" aria-label="View website">' + icon("view", 18) + "</a>" +
      '<button class="icon-btn" id="logout" title="Sign out" aria-label="Sign out">' + icon("logout", 18) + "</button>" +
      "</header>" +
      '<div class="content" id="view"></div>' +
      "</main>" +
      "</div>";

    buildSidebar();
    wireShell();
    route();
  }

  function filteredNav() {
    return NAV.filter(function (item) {
      if (item.sec) return true;
      if (item.perm) return Auth.can(item.perm);
      return true;
    });
  }

  function buildSidebar() {
    var sb = document.getElementById("sidebar");
    var stats = Store.stats();
    var user = Auth.user();
    var links = filteredNav().map(function (item) {
      if (item.sec) return '<div class="nav-sec">' + esc(item.sec) + "</div>";
      var badge = item.col ? (stats[item.col] || 0) : item.trash ? stats.trash : "";
      var badgeHtml = badge ? '<span class="nav-badge">' + badge + "</span>" : "";
      return '<a class="nav-link" data-route="' + (item.col ? item.col : item.route) + '" href="' + item.href + '">' + icon(item.icon, 17) + " <span>" + esc(item.label) + "</span>" + badgeHtml + "</a>";
    }).join("");
    sb.innerHTML =
      '<a class="sidebar__brand" href="../index.html"><img src="../assets/img/logo-pcm.png" alt="PCM logo"><span><b>PCM</b><span>Admin Panel</span></span></a>' +
      '<nav class="sidebar__nav">' + links + "</nav>" +
      '<div class="sidebar__foot">' +
      '<div class="sidebar__user"><span class="avatar">' + esc(A.initials(user.name || "A")) + '</span><span><b>' + esc(user.name || "admin") + "</b><span>" + esc((Store.data.roles[user.role] || {}).label || "Administrator") + "</span></span></div>" +
      '<button class="btn btn-sm" id="side-logout" style="width:100%;justify-content:center;background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12);color:#cdd6ee">' + icon("logout", 14) + " Sign out</button>" +
      "</div>";
  }

  function wireShell() {
    var burger = document.getElementById("burger");
    var scrim = document.getElementById("scrim");
    var sidebar = document.getElementById("sidebar");

    function closeSidebar() { document.body.classList.remove("sidebar-open"); }
    burger.addEventListener("click", function () { document.body.classList.toggle("sidebar-open"); });
    scrim.addEventListener("click", closeSidebar);
    sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) closeSidebar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSidebar(); });

    document.getElementById("logout").addEventListener("click", logout);
    var sideLogout = document.getElementById("side-logout");
    if (sideLogout) sideLogout.addEventListener("click", logout);

    function logout() {
      Auth.logout();
      location.hash = "#/";
      showLogin();
    }
  }

  function parseHash() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    if (!h) return { name: "dashboard" };
    var parts = h.split("/");
    if (parts[0] === "content" && SCHEMAS[parts[1]]) return { name: "content", col: parts[1] };
    if (parts[0] === "pages") return { name: "pages" };
    if (parts[0] === "trash") return { name: "trash" };
    if (parts[0] === "backups") return { name: "backups" };
    if (parts[0] === "seo") return { name: "seo" };
    if (parts[0] === "users") return { name: "users" };
    if (parts[0] === "settings") return { name: "settings" };
    return { name: "dashboard" };
  }

  var titles = {
    dashboard: ["Dashboard", "Analytics & overview"],
    pages: ["Pages & Sections", "Components of every page"],
    trash: ["Trash", "Restore or purge deleted content"],
    backups: ["Backups", "Snapshots & restore"],
    seo: ["SEO & Meta", "Search & social metadata"],
    users: ["Users & Roles", "Accounts & permissions"],
    settings: ["Settings", "Storage, backup & account"]
  };

  function route() {
    var r = parseHash();
    var view = document.getElementById("view");
    if (!view) return;

    var title, crumb;
    if (r.name === "content") {
      var s = SCHEMAS[r.col];
      title = s.label;
      crumb = "Content · " + s.plural;
    } else {
      title = titles[r.name] ? titles[r.name][0] : "Dashboard";
      crumb = titles[r.name] ? titles[r.name][1] : "PCM Admin";
    }
    var t = document.getElementById("tb-title");
    var c = document.getElementById("tb-crumb");
    if (t) t.textContent = title;
    if (c) c.textContent = "PCM Admin · " + crumb;

    document.querySelectorAll(".nav-link").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === (r.col || r.name));
    });

    routes.render(view, r);
    view.dispatchEvent(new Event("pcm:rendered"));
  }

  /* ---------- boot ---------- */
  function boot() {
    Store.init().then(function () {
      window.addEventListener("hashchange", function () {
        if (!Auth.isAuthed()) { showLogin(); return; }
        route();
      });
      document.addEventListener("pcm:reload", function () {
        if (!Auth.isAuthed()) return;
        buildSidebar();
        route();
      });
      if (Auth.isAuthed()) showShell(); else showLogin();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
