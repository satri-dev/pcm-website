/* ============================================================
   PCM Admin — admin/js/admin.routes.js
   Route renderers: dashboard, CRUD, pages, trash, backups,
   users & roles, settings. Vanilla JS.
   ============================================================ */
(function () {
  "use strict";
  var A = window.PCMAdmin;
  var esc = A.esc, icon = A.icon, el = A.el, uid = A.uid, fmtDate = A.fmtDate, fmtDateTime = A.fmtDateTime,
      timeAgo = A.timeAgo, bytesToSize = A.bytesToSize, clone = A.clone,
      Store = A.Store, Auth = A.Auth, SCHEMAS = A.SCHEMAS, PAGES = A.PAGES;
  var toast = A.toast, Modal = A.Modal, FormBuilder = A.FormBuilder, DataTable = A.DataTable, charts = A.charts;

  function cellType(f) {
    if (f.key === "status") return "status";
    if (f.type === "toggle") return "toggle";
    if (f.type === "date") return "date";
    if (f.type === "select") return "select";
    if (f.type === "url") return "url";
    if (f.type === "img") return "img";
    if (f.type === "file") return "file";
    if (f.type === "list") return "list";
    return "text";
  }

  function pageHead(title, sub, actionsHtml) {
    return '<div class="page-head">' +
      "<div><h2>" + esc(title) + "</h2><p>" + esc(sub) + "</p></div>" +
      '<div style="display:flex;gap:0.6rem;flex-wrap:wrap">' + (actionsHtml || "") + "</div></div>";
  }

  function itemLabel(row) {
    return row.title || row.name || row.album || row.question || row.album || "item";
  }
  function fullName(row) {
    return (row.name || row.title || row.album || row.question || "item").slice(0, 42);
  }

  /* ============ generic content CRUD ============ */
  function contentPage(view, col) {
    var schema = SCHEMAS[col];
    var fields = schema.fields;
    var canEdit = Auth.can("contentEdit");
    var canDelete = Auth.can("contentDelete");
    var canAdd = Auth.can("contentAdd");

    var columns = fields.filter(function (f) { return f.main || f.table; }).map(function (f) {
      return { key: f.key, label: f.label, type: cellType(f), main: !!f.main, subKey: f.sub, thumbKey: f.thumbKey, listLabel: f.itemLabel ? f.itemLabel + "s" : "items", sortable: true };
    });
    var searchFields = fields.filter(function (f) { return f.search && f.type !== "list" && f.type !== "img" && f.type !== "file"; }).map(function (f) { return f.key; });
    var filters = fields.filter(function (f) { return f.filter && f.type === "select"; }).map(function (f) { return { key: f.key, label: f.label }; });

    var mount = document.createElement("div");
    view.innerHTML = "";
    view.appendChild(el("div", null, pageHead(schema.plural, "Manage, search and edit " + schema.plural.toLowerCase() + ".",
      canAdd ? '<button class="btn btn-primary" data-add>' + icon("add", 16) + " Add " + schema.label + "</button>" : "")));
    view.appendChild(mount);

    var dt = new DataTable(mount, {
      columns: columns,
      getRows: function () { return Store.get(col); },
      searchFields: searchFields,
      filters: filters,
      searchLabel: schema.label,
      onEdit: canEdit ? function (row) { openForm(col, row); } : null,
      onDelete: canDelete ? function (row) { confirmDelete(col, row); } : null,
      onView: function (row) { openView(schema, row); }
    });
    dt.render();
    var addBtn = view.querySelector("[data-add]");
    if (addBtn) addBtn.addEventListener("click", function () { openForm(col, null); });

    function openForm(colId, row) {
      var fb = new FormBuilder(schema.fields, row || {});
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var save = el("button", { class: "btn btn-primary", type: "button" }, icon("save", 16) + " Save");
      footer.appendChild(cancel);
      footer.appendChild(save);
      var modal = new Modal({ title: (row ? "Edit" : "Add") + " " + schema.label, body: fb.el, footer: footer });
      cancel.addEventListener("click", modal.close);
      save.addEventListener("click", function () {
        if (!fb.validate()) { toast("Please fix the highlighted fields", "error"); return; }
        var vals = fb.getValues();
        vals.id = row ? row.id : uid(colId);
        Store.upsert(colId, vals);
        Store.log(row ? "edit" : "add", (row ? "Updated" : "Added") + " " + schema.label + ": " + itemLabel(vals));
        toast((row ? "Updated" : "Added") + " successfully");
        modal.close();
        dt.render();
      });
      modal.open();
    }

    function confirmDelete(colId, row) {
      var label = itemLabel(row);
      var body = el("div", null, "<p style='margin:0 0 0.25rem'>Move <b>" + esc(label) + "</b> to the trash?</p><p style='margin:0;color:#5c6678;font-size:.82rem'>You can restore it from the Trash page at any time.</p>");
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var del = el("button", { class: "btn btn-danger", type: "button" }, icon("trash", 15) + " Move to trash");
      footer.appendChild(cancel);
      footer.appendChild(del);
      var modal = new Modal({ title: "Delete " + schema.label, body: body, footer: footer });
      cancel.addEventListener("click", modal.close);
      del.addEventListener("click", function () {
        Store.toTrash(colId, row, Auth.user().u);
        toast("Moved to trash", "info");
        modal.close();
        dt.render();
      });
      modal.open();
    }

    function openView(schemaRow, row) {
      var rowsHtml = schemaRow.fields.map(function (f) {
        if (f.type === "section") return "";
        var v = row[f.key];
        var display;
        if (f.type === "list") {
          var list = Array.isArray(v) ? v : [];
          display = list.map(function (p) {
            var label = p.name || p.title || p.src || "";
            var extra = p.position || p.tag || "";
            var t = "• " + esc(label) + (extra ? " — " + esc(extra) : "");
            if (p.src) t += ' <small><a href="' + esc(p.src) + '" target="_blank" rel="noopener">open</a></small>';
            return t;
          }).join("<br>") || "—";
        } else if (f.type === "img" && v) {
          display = '<img src="' + esc(v) + '" alt="" style="max-width:180px;max-height:110px;border-radius:8px;border:1px solid #e2e7f0">';
        } else if (f.type === "file" && v) {
          display = '<span class="badge badge--blue">' + icon("file", 13) + " " + esc(A.fileLabel(v)) + "</span> <a href='" + esc(v) + "' target='_blank' rel='noopener'>open</a>";
        } else if (f.type === "url" && v) {
          display = '<a href="' + esc(v) + '" target="_blank" rel="noopener">' + esc(v) + "</a>";
        } else if (f.type === "toggle") {
          display = v ? '<span class="badge badge--green">Yes</span>' : '<span class="badge badge--gray">No</span>';
        } else if (f.type === "textarea") {
          var vStr = v == null ? "" : String(v);
          display = vStr.indexOf("<") === -1
            ? (esc(vStr).replace(/\n/g, "<br>") || "—")
            : (vStr || "—");
        } else {
          display = esc(v == null ? "" : v).replace(/\n/g, "<br>") || "—";
        }
        return '<div style="display:grid;grid-template-columns:160px 1fr;gap:0.5rem;padding:0.55rem 0;border-bottom:1px dashed #e2e7f0"><b style="font-size:.8rem;color:#5c6678">' + esc(f.label) + "</b><div>" + display + "</div></div>";
      }).join("");
      var modal = new Modal({ title: schemaRow.label, body: el("div", null, rowsHtml) });
      modal.open();
    }
  }

  /* ============ dashboard ============ */
  function dashboard(view) {
    var stats = Store.stats();
    var totalContent = (stats.news || 0) + (stats.notices || 0) + (stats.results || 0) + (stats.events || 0) +
      (stats.programs || 0) + (stats.scholarships || 0) + (stats.faqs || 0) + (stats.blogs || 0);
    var people = (stats.faculty || 0) + (stats.alumni || 0) + (stats.board || 0);

    view.innerHTML = "";
    view.appendChild(el("div", null, pageHead("Dashboard", "Analytics and quick overview of the PCM website content.",
      '<a class="btn" href="../index.html" target="_blank" rel="noopener" data-back-site>' + icon("globe", 16) + " Back to website</a>" +
      (Auth.can("contentAdd") ? '<a class="btn btn-primary" href="#/content/news">' + icon("add", 16) + " New post</a>" : ""))));

    var statsGrid = el("div", { class: "stats" });
    statsGrid.appendChild(statCard("brand", "notice", "Total content", totalContent, "across all collections"));
    statsGrid.appendChild(statCard("green", "faculty", "People", people, "faculty, alumni & board"));
    statsGrid.appendChild(statCard("gold", "gallery", "Gallery photos", stats.photos, "in " + (stats.gallery || 0) + " albums"));
    statsGrid.appendChild(statCard("blue", "pages", "Pages managed", stats.pages, stats.sections + " sections editable"));
    statsGrid.appendChild(statCard("violet", "seo", "SEO pages", stats.seo.done + "/" + stats.seo.pages, "pages with meta tags"));
    statsGrid.appendChild(statCard("red", "trash", "In trash", stats.trash, "restorable items"));
    statsGrid.appendChild(statCard("teal", "archive", "Backups", stats.backups, "snapshots saved"));
    view.appendChild(statsGrid);

    var chartsGrid = el("div", { class: "charts" });
    var barPanel = panel("Content by collection", "Number of records in each content type");
    barPanel.body.appendChild(el("div", { id: "chart-bar" }));
    chartsGrid.appendChild(barPanel.panel);

    var donutPanel = panel("Gallery by category", "Distribution of photo albums");
    donutPanel.body.appendChild(el("div", { id: "chart-donut" }));
    chartsGrid.appendChild(donutPanel.panel);

    var linePanel = panel("Site visits", "Traffic over the last 7 months (analytics view)");
    linePanel.body.appendChild(el("div", { id: "chart-line" }));
    chartsGrid.appendChild(linePanel.panel);

    var seoPanel = panel("SEO & Meta", "Meta tags are published live to the public website.");
    var seoBody = el("div", { class: "seo-health" });
    var seoPct = stats.seo.pages ? Math.round((stats.seo.done / stats.seo.pages) * 100) : 0;
    seoBody.appendChild(el("div", { class: "seo-health__head" },
      "<b>" + esc(stats.seo.done) + " of " + esc(stats.seo.pages) + " pages optimized</b>" +
      '<span class="badge badge--' + (seoPct === 100 ? "green" : seoPct >= 50 ? "gold" : "red") + '">' + seoPct + "% complete</span>"));
    seoBody.appendChild(el("div", { class: "seo-health__bar" }, '<div class="seo-health__fill" style="width:' + seoPct + '%"></div>'));
    var seoActions = el("div", { style: "display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.8rem" });
    var seoGo = el("a", { class: "btn btn-primary", href: "#/seo" }, icon("seo", 16) + " Manage SEO");
    seoGo.style.justifyContent = "flex-start";
    seoActions.appendChild(seoGo);
    var seoViewSite = el("a", { class: "btn", href: "../index.html", target: "_blank", rel: "noopener" }, icon("globe", 16) + " View website");
    seoViewSite.style.justifyContent = "flex-start";
    seoActions.appendChild(seoViewSite);
    seoBody.appendChild(seoActions);
    seoPanel.body.appendChild(seoBody);
    chartsGrid.appendChild(seoPanel.panel);

    var actPanel = panel("Recent activity", "Latest changes in the admin panel");
    var act = el("div", { class: "activity" });
    Store.activity.slice(0, 8).forEach(function (a) {
      var dot = a.type === "delete" ? "red" : a.type === "edit" ? "gold" : a.type === "add" ? "green" : a.type === "restore" ? "blue" : a.type === "purge" ? "red" : a.type === "backup" ? "violet" : "";
      act.appendChild(el("div", { class: "activity__item" },
        '<span class="activity__dot' + (dot ? " activity__dot--" + dot : "") + '"></span>' +
        "<div><p>" + esc(a.message) + "</p><small>" + timeAgo(a.time) + "</small></div>"));
    });
    actPanel.body.appendChild(act);
    chartsGrid.appendChild(actPanel.panel);

    view.appendChild(chartsGrid);

    var quick = panel("Quick actions", "Jump straight into common tasks");
    var qGrid = el("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:0.6rem" });
    [
      ["news", "Add news"], ["notices", "Add notice"], ["results", "Add result"],
      ["gallery", "Add album"], ["faculty", "Add member"], ["events", "Add event"]
    ].forEach(function (pair) {
      var a = el("a", { class: "btn", href: "#/content/" + pair[0] }, icon(SCHEMAS[pair[0]].icon, 16) + " " + pair[1]);
      a.style.justifyContent = "flex-start";
      qGrid.appendChild(a);
    });
    quick.body.appendChild(qGrid);
    view.appendChild(quick.panel);

    var barData = Object.keys(SCHEMAS).map(function (k, i) {
      return { label: SCHEMAS[k].plural, value: stats[k] || 0, color: ["#21409a", "#d9a514", "#1e9e56", "#d64545", "#7a54d6", "#e07a1f", "#2f8fb0", "#8a2d6d", "#4a6bd6", "#b8860b", "#3f9e35", "#c0504d"][i % 12] };
    }).filter(function (b) { return b.value > 0; });
    charts.bar(document.getElementById("chart-bar"), barData);

    var cats = {};
    Store.get("gallery").forEach(function (g) { cats[g.category] = (cats[g.category] || 0) + 1; });
    var donutData = Object.keys(cats).map(function (k, i) {
      return { label: k, value: cats[k], color: ["#21409a", "#d9a514", "#1e9e56", "#d64545", "#7a54d6"][i % 5] };
    });
    charts.donut(document.getElementById("chart-donut"), donutData);

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    var visits = [1240, 1560, 1480, 1820, 2140, 2460, 2780];
    charts.line(document.getElementById("chart-line"), months, visits, "#21409a");

    function statCard(tone, ic, label, value, sub) {
      return el("div", { class: "stat stat--" + tone },
        '<div class="stat__label">' + icon(ic, 15) + " " + esc(label) + '</div>' +
        '<div class="stat__value">' + value + "</div>" +
        '<div class="stat__sub">' + esc(sub) + "</div>");
    }
  }

  function panel(title, sub) {
    var p = el("div", { class: "panel" });
    p.appendChild(el("div", { class: "panel__head" }, "<div><h3>" + esc(title) + "</h3>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + "</div>"));
    var body = el("div", { class: "panel__body" });
    p.appendChild(body);
    return { panel: p, body: body };
  }

  /* ============ pages & sections manager ============ */
  function getPageSections(slug) {
    var map = Store.data.pageSections || {};
    if (!map[slug]) {
      var src = PAGES.find(function (p) { return p.slug === slug; });
      map[slug] = (src ? src.sections : []).map(function (s) {
        return { key: s.key, label: s.label, value: s.value, hidden: false };
      });
      Store.data.pageSections = map;
      Store.save();
    }
    return map[slug];
  }
  function persistPageSections(slug, sections) {
    var map = Store.data.pageSections || {};
    map[slug] = sections;
    Store.data.pageSections = map;
    Store.save();
  }

  function pagesManager(view) {
    view.innerHTML = "";
    var canEditPages = Auth.can("managePages");
    view.appendChild(el("div", null, pageHead("Pages & Sections", "Edit the components and sections of every page on the website.",
      canEditPages ? '<button class="btn btn-primary" data-add-page>' + icon("add", 16) + " Add page</button>" : "")));

    var wrap = el("div", { style: "display:grid;gap:0.8rem" });
    renderRows();
    view.appendChild(wrap);

    var addPageBtn = view.querySelector("[data-add-page]");
    if (addPageBtn) addPageBtn.addEventListener("click", addPage);

    function renderRows() {
      wrap.innerHTML = "";
      PAGES.forEach(function (pg) {
        var sections = getPageSections(pg.slug);
        var visible = sections.filter(function (s) { return !s.hidden; }).length;

        var row = el("div", { class: "page-row" });
        var head = el("div", { class: "page-row__head" },
          icon("pages", 16) +
          '<div><b>' + esc(pg.title) + "</b> <span class='slug'>" + esc(pg.url) + "</span></div>" +
          '<span class="badge badge--gray">' + visible + "/" + sections.length + " visible</span>" +
          '<a class="btn btn-sm" target="_blank" rel="noopener" href="../' + esc(pg.url) + '">' + icon("view", 14) + " View</a>" +
          '<span class="chev">' + icon("chev", 18) + "</span>");
        var body = el("div", { class: "page-row__sections" });

        sections.forEach(function (sec, idx) {
          var item = el("div", { class: "section-item" });
          var info = el("div", { class: "section-item__info" },
            "<b>" + esc(sec.label) + "</b><span>" + esc(sec.key) + "</span>" +
            '<span class="preview">' + esc(sec.value || "") + "</span>");
          item.appendChild(info);
          var sw = el("label", { class: "switch" });
          var cb = el("input", { type: "checkbox" });
          if (!sec.hidden) cb.checked = true;
          sw.appendChild(cb);
          sw.appendChild(el("span", { class: "track" }));
          item.appendChild(sw);
          cb.addEventListener("change", function () {
            sec.hidden = !cb.checked;
            persistPageSections(pg.slug, sections);
            Store.log("toggle", "Toggled section '" + sec.label + "' on " + pg.title);
            toast(cb.checked ? "Section enabled" : "Section hidden", "info");
            var badge = head.querySelector(".badge");
            var vis = sections.filter(function (s) { return !s.hidden; }).length;
            badge.textContent = vis + "/" + sections.length + " visible";
          });
          if (canEditPages) {
            var up = el("button", { class: "act-btn", title: "Move up" }, icon("chev", 15));
            up.addEventListener("click", function () {
              if (idx === 0) return;
              var a = sections[idx], b = sections[idx - 1];
              sections[idx - 1] = a; sections[idx] = b;
              persistPageSections(pg.slug, sections);
              Store.log("edit", "Reordered section on " + pg.title);
              renderRows();
            });
            up.style.transform = "rotate(180deg)";
            item.appendChild(up);
            var down = el("button", { class: "act-btn", title: "Move down" }, icon("chev", 15));
            down.addEventListener("click", function () {
              if (idx >= sections.length - 1) return;
              var a = sections[idx], b = sections[idx + 1];
              sections[idx + 1] = a; sections[idx] = b;
              persistPageSections(pg.slug, sections);
              Store.log("edit", "Reordered section on " + pg.title);
              renderRows();
            });
            item.appendChild(down);
            var editBtn = el("button", { class: "act-btn", title: "Edit content" }, icon("edit", 15));
            editBtn.addEventListener("click", function () {
              var ta = el("textarea", { style: "min-height:120px" }, esc(sec.value || ""));
              var footer = el("div", null);
              var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
              var save = el("button", { class: "btn btn-primary", type: "button" }, icon("save", 16) + " Save");
              footer.appendChild(cancel);
              footer.appendChild(save);
              var modal = new Modal({ title: "Edit — " + sec.label, body: ta, footer: footer });
              cancel.addEventListener("click", modal.close);
              save.addEventListener("click", function () {
                sec.value = ta.value;
                persistPageSections(pg.slug, sections);
                Store.log("edit", "Edited section '" + sec.label + "' on " + pg.title);
                toast("Section updated");
                info.querySelector(".preview").textContent = ta.value;
                modal.close();
              });
              modal.open();
              ta.focus();
            });
            item.appendChild(editBtn);
            var delSec = el("button", { class: "act-btn danger", title: "Remove section" }, icon("trash", 15));
            delSec.addEventListener("click", function () {
              sections.splice(idx, 1);
              persistPageSections(pg.slug, sections);
              Store.log("delete", "Removed section from " + pg.title);
              toast("Section removed", "info");
              renderRows();
            });
            item.appendChild(delSec);
          }
          body.appendChild(item);
        });

        if (canEditPages) {
          var addSec = el("button", { type: "button", class: "btn btn-sm btn-ghost", style: "margin:0.4rem 0 0 0.2rem" }, icon("add", 14) + " Add section");
          addSec.addEventListener("click", function () {
            var keyIn = el("input", { type: "text", placeholder: "key (e.g. custom_box)" });
            var labelIn = el("input", { type: "text", placeholder: "Label (e.g. Custom box)" });
            var valueIn = el("textarea", { placeholder: "Content…", style: "min-height:90px" });
            var grid = el("div", { class: "form-grid" });
            [["Key", keyIn], ["Label", labelIn], ["Content", valueIn]].forEach(function (pair) {
              var c = el("div", { class: "field" });
              c.appendChild(el("label", {}, pair[0]));
              c.appendChild(pair[1]);
              grid.appendChild(c);
            });
            var footer = el("div", null);
            var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
            var save = el("button", { class: "btn btn-primary", type: "button" }, icon("add", 16) + " Add");
            footer.appendChild(cancel);
            footer.appendChild(save);
            var modal = new Modal({ title: "Add section to " + pg.title, body: grid, footer: footer });
            cancel.addEventListener("click", modal.close);
            save.addEventListener("click", function () {
              if (!keyIn.value.trim() || !labelIn.value.trim()) { toast("Key and label are required", "error"); return; }
              sections.push({ key: keyIn.value.trim(), label: labelIn.value.trim(), value: valueIn.value, hidden: false });
              persistPageSections(pg.slug, sections);
              Store.log("add", "Added section to " + pg.title);
              toast("Section added");
              modal.close();
              renderRows();
            });
            modal.open();
          });
          body.appendChild(addSec);
        }

        head.addEventListener("click", function (e) {
          if (e.target.closest("a,button")) return;
          row.classList.toggle("open");
        });
        row.appendChild(head);
        row.appendChild(body);
        wrap.appendChild(row);
      });
    }

    function addPage() {
      var titleIn = el("input", { type: "text", placeholder: "Page title (e.g. About Us)" });
      var slugIn = el("input", { type: "text", placeholder: "slug (e.g. about)" });
      var grid = el("div", { class: "form-grid" });
      [["Title", titleIn], ["URL slug", slugIn]].forEach(function (pair) {
        var c = el("div", { class: "field" });
        c.appendChild(el("label", {}, pair[0]));
        c.appendChild(pair[1]);
        grid.appendChild(c);
      });
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var save = el("button", { class: "btn btn-primary", type: "button" }, icon("add", 16) + " Add page");
      footer.appendChild(cancel);
      footer.appendChild(save);
      var modal = new Modal({ title: "Add page", body: grid, footer: footer });
      cancel.addEventListener("click", modal.close);
      save.addEventListener("click", function () {
        var title = titleIn.value.trim(), slug = slugIn.value.trim();
        if (!title || !slug) { toast("Title and slug are required", "error"); return; }
        if (PAGES.some(function (p) { return p.slug === slug; })) { toast("A page with that slug already exists", "error"); return; }
        var key = "page_" + slug.replace(/[^a-z0-9_]/gi, "_").toLowerCase();
        PAGES.push({ slug: slug, title: title, url: slug + ".html", key: key, sections: [] });
        getPageSections(slug);
        Store.log("add", "Added page: " + title);
        toast("Page added");
        modal.close();
        renderRows();
      });
      modal.open();
    }
  }

  /* ============ trash / recycle bin ============ */
  function trashPage(view) {
    view.innerHTML = "";
    var canRestore = Auth.can("trashRestore");
    var canPurge = Auth.can("trashPurge");
    view.appendChild(el("div", null, pageHead("Trash", "Deleted items live here until restored or purged permanently.",
      canPurge && Store.trashCount() > 0 ? '<button class="btn btn-danger" data-empty>' + icon("trash", 16) + " Empty trash</button>" : "")));

    var total = Store.trashCount();
    if (total === 0) {
      view.appendChild(el("div", { class: "panel" }, '<div class="empty">' + icon("archive", 40) + "<p>Trash is empty. Deleted content will appear here.</p></div>"));
      return;
    }

    var sections = el("div", { style: "display:grid;gap:1rem" });
    Object.keys(SCHEMAS).forEach(function (col) {
      var items = Store.trashFor(col);
      if (!items.length) return;
      var schema = SCHEMAS[col];
      var p = panel(schema.plural + " (" + items.length + ")", "Deleted " + schema.label.toLowerCase() + " items");
      var list = el("div", { class: "trash-list" });
      items.forEach(function (item) {
        var row = el("div", { class: "trash-item" });
        var info = el("div", { class: "trash-item__info" },
          "<b>" + esc(fullName(item)) + "</b>" +
          "<span>" + esc(col) + " · deleted " + fmtDateTime(item._deletedAt) + " by " + esc(item._deletedBy || "—") + "</span>");
        row.appendChild(info);
        if (canRestore) {
          var res = el("button", { class: "btn btn-sm", type: "button" }, icon("restore", 14) + " Restore");
          res.addEventListener("click", function () {
            Store.restore(col, item);
            toast("Restored", "info");
            view.dispatchEvent(new Event("pcm:reload"));
            trashPage(view);
          });
          row.appendChild(res);
        }
        if (canPurge) {
          var pur = el("button", { class: "btn btn-sm btn-danger", type: "button" }, icon("trash", 14) + " Purge");
          pur.addEventListener("click", function () {
            Store.purge(col, item.id);
            toast("Purged permanently", "info");
            view.dispatchEvent(new Event("pcm:reload"));
            trashPage(view);
          });
          row.appendChild(pur);
        }
        list.appendChild(row);
      });
      p.body.appendChild(list);
      sections.appendChild(p.panel);
    });
    view.appendChild(sections);

    var emptyBtn = view.querySelector("[data-empty]");
    if (emptyBtn) emptyBtn.addEventListener("click", function () {
      var body = el("div", null, "<p style='margin:0'>This permanently deletes all " + total + " items in the trash. This cannot be undone.</p>");
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var yes = el("button", { class: "btn btn-danger", type: "button" }, icon("trash", 15) + " Empty trash");
      footer.appendChild(cancel);
      footer.appendChild(yes);
      var modal = new Modal({ title: "Empty trash?", body: body, footer: footer });
      cancel.addEventListener("click", modal.close);
      yes.addEventListener("click", function () {
        Store.purgeAll();
        toast("Trash emptied", "info");
        modal.close();
        view.dispatchEvent(new Event("pcm:reload"));
        trashPage(view);
      });
      modal.open();
    });
  }

  /* ============ backups manager ============ */
  function backupsPage(view) {
    view.innerHTML = "";
    var canManage = Auth.can("manageBackup");
    view.appendChild(el("div", null, pageHead("Backups", "Create, restore and download full snapshots of all content.",
      canManage ? '<button class="btn btn-primary" data-new-backup>' + icon("add", 16) + " New backup</button>" : "")));

    var list = Store.data.backups || [];
    if (!list.length) {
      view.appendChild(el("div", { class: "panel" }, '<div class="empty">' + icon("archive", 40) + "<p>No backups yet. Create your first snapshot to keep content safe.</p></div>"));
    } else {
      var p = panel("Saved backups", "Up to 20 snapshots are kept automatically.");
      var table = el("div", { class: "backup-list" });
      list.forEach(function (b) {
        var row = el("div", { class: "backup-item" });
        var info = el("div", { class: "backup-item__info" },
          "<b>" + esc(b.name) + "</b>" +
          "<span>" + fmtDateTime(b.createdAt) + " · by " + esc(b.by) + " · " + b.items + " items · " + esc(b.size) + "</span>" +
          (b.desc ? "<span class='hint'>" + esc(b.desc) + "</span>" : ""));
        row.appendChild(info);
        var dl = el("button", { class: "btn btn-sm", type: "button", title: "Download" }, icon("download", 14) + " Download");
        dl.addEventListener("click", function () {
          var blob = new Blob([Store.downloadBackup(b)], { type: "application/json" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "pcm-backup-" + b.createdAt.slice(0, 10) + ".json";
          a.click();
          URL.revokeObjectURL(url);
          toast("Backup downloaded");
        });
        row.appendChild(dl);
        if (canManage) {
          var rs = el("button", { class: "btn btn-sm", type: "button" }, icon("restore", 14) + " Restore");
          rs.addEventListener("click", function () {
            var body = el("div", null, "<p style='margin:0'>Restore <b>" + esc(b.name) + "</b>? All current content will be replaced by this snapshot. Users, roles and backups are preserved.</p>");
            var footer = el("div", null);
            var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
            var yes = el("button", { class: "btn btn-primary", type: "button" }, icon("restore", 15) + " Restore");
            footer.appendChild(cancel);
            footer.appendChild(yes);
            var modal = new Modal({ title: "Restore backup", body: body, footer: footer });
            cancel.addEventListener("click", modal.close);
            yes.addEventListener("click", function () {
              try {
                Store.restoreBackup(b.id);
                toast("Content restored from backup");
                modal.close();
                view.dispatchEvent(new Event("pcm:reload"));
                backupsPage(view);
              } catch (err) {
                toast("Restore failed: " + err.message, "error");
              }
            });
            modal.open();
          });
          row.appendChild(rs);
          var del = el("button", { class: "btn btn-sm btn-danger", type: "button" }, icon("trash", 14) + " Delete");
          del.addEventListener("click", function () {
            Store.deleteBackup(b.id);
            toast("Backup deleted", "info");
            backupsPage(view);
          });
          row.appendChild(del);
        }
        table.appendChild(row);
      });
      p.body.appendChild(table);
      view.appendChild(p.panel);
    }

    var newBtn = view.querySelector("[data-new-backup]");
    if (newBtn) newBtn.addEventListener("click", function () {
      var nameIn = el("input", { type: "text", placeholder: "Name (e.g. Before site redesign)" });
      var descIn = el("input", { type: "text", placeholder: "Optional note" });
      var grid = el("div", { class: "form-grid" });
      [["Name", nameIn], ["Note (optional)", descIn]].forEach(function (pair) {
        var c = el("div", { class: "field" });
        c.appendChild(el("label", {}, pair[0]));
        c.appendChild(pair[1]);
        grid.appendChild(c);
      });
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var save = el("button", { class: "btn btn-primary", type: "button" }, icon("save", 16) + " Create backup");
      footer.appendChild(cancel);
      footer.appendChild(save);
      var modal = new Modal({ title: "New backup", body: grid, footer: footer });
      cancel.addEventListener("click", modal.close);
      save.addEventListener("click", function () {
        var rec = Store.createBackup(nameIn.value.trim() || null, descIn.value.trim(), Auth.user().u);
        toast("Backup created");
        modal.close();
        backupsPage(view);
      });
      modal.open();
    });
  }

  /* ============ users & roles ============ */
  function usersPage(view) {
    view.innerHTML = "";
    var canManage = Auth.can("manageUsers");
    var me = Auth.user();
    view.appendChild(el("div", null, pageHead("Users & Roles", "Manage admin accounts and their permissions.",
      canManage ? '<button class="btn btn-primary" data-add-user>' + icon("add", 16) + " Add user</button>" : "")));

    var users = Store.data.users || [];
    var p = panel("Accounts", users.length + " admin account(s)");
    var list = el("div", { class: "user-list" });
    users.forEach(function (u) {
      var row = el("div", { class: "user-item" });
      var info = el("div", { class: "user-item__info" },
        '<span class="avatar-sm">' + esc(A.initials(u.name)) + "</span>" +
        "<div><b>" + esc(u.name) + "</b>" +
        (me.u === u.u ? ' <span class="badge badge--blue">you</span>' : "") +
        "<span>@" + esc(u.u) + " · joined " + fmtDate(u.createdAt) + (u.active === false ? " · <span style='color:#d64545'>disabled</span>" : "") + "</span></div>");
      row.appendChild(info);
      var roleBadge = el("span", { class: "badge badge--" + (u.role === "superadmin" ? "red" : u.role === "editor" ? "blue" : "green") }, u.role || "user");
      row.appendChild(roleBadge);
      if (canManage) {
        var ed = el("button", { class: "btn btn-sm", type: "button" }, icon("edit", 14) + " Edit");
        ed.addEventListener("click", function () { editUser(u); });
        row.appendChild(ed);
        var canDeleteUser = u.u !== me.u && !(u.role === "superadmin" && superAdminCount() <= 1);
        if (canDeleteUser) {
          var del = el("button", { class: "btn btn-sm btn-danger", type: "button" }, icon("trash", 14));
          del.title = "Remove user";
          del.addEventListener("click", function () {
            Store.data.users = users.filter(function (x) { return x.u !== u.u; });
            Store.log("delete", "Removed user account: " + u.u);
            Store.save();
            toast("User removed", "info");
            usersPage(view);
          });
          row.appendChild(del);
        }
      }
      list.appendChild(row);
    });
    p.body.appendChild(list);
    view.appendChild(p.panel);

    if (Auth.isSuperAdmin()) {
      var rp = panel("Roles & permissions", "Tune what each role is allowed to do.");
      var roles = Store.data.roles || {};
      var perms = A.ROLE_PERM_DEFS || [];
      var table = el("table", { class: "perm-table" });
      var thead = el("thead", null, "<tr><th>Permission</th>" +
        Object.keys(roles).map(function (r) { return "<th>" + esc(roles[r].label || r) + "</th>"; }).join("") + "</tr>");
      table.appendChild(thead);
      var tbody = el("tbody");
      perms.forEach(function (perm) {
        var tr = el("tr", null, "<td>" + esc(perm.label) + "</td>");
        Object.keys(roles).forEach(function (r) {
          var td = el("td");
          var sw = el("label", { class: "switch switch--sm" });
          var cb = el("input", { type: "checkbox" });
          if (roles[r][perm.key]) cb.checked = true;
          cb.addEventListener("change", function () {
            if (r === "superadmin" && !cb.checked && perm.key === "manageUsers") { toast("Super Admin must keep user management", "error"); cb.checked = true; return; }
            roles[r][perm.key] = cb.checked;
            Store.data.roles = roles;
            Store.log("edit", "Changed " + r + " permission: " + perm.label);
            Store.save();
            toast("Permission updated");
          });
          sw.appendChild(cb);
          sw.appendChild(el("span", { class: "track" }));
          td.appendChild(sw);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      rp.body.appendChild(table);
      view.appendChild(rp.panel);
    }

    function superAdminCount() {
      return users.filter(function (u) { return u.role === "superadmin" && u.active !== false; }).length;
    }

    function editUser(u) {
      var nameIn = el("input", { type: "text", value: u.name });
      var userIn = el("input", { type: "text", value: u.u });
      var passIn = el("input", { type: "password", placeholder: "New password (leave blank to keep)" });
      var roleIn = el("select");
      Object.keys(Store.data.roles).forEach(function (r) {
        var o = el("option", { value: r }, (Store.data.roles[r].label || r));
        if (r === u.role) o.selected = true;
        roleIn.appendChild(o);
      });
      var activeIn = el("input", { type: "checkbox" });
      if (u.active !== false) activeIn.checked = true;
      var activeWrap = el("label", { class: "switch" });
      activeWrap.appendChild(activeIn);
      activeWrap.appendChild(el("span", { class: "track" }));
      var grid = el("div", { class: "form-grid" });
      [["Full name", nameIn], ["Username", userIn], ["Password", passIn], ["Role", roleIn]].forEach(function (pair) {
        var c = el("div", { class: "field" });
        c.appendChild(el("label", {}, pair[0]));
        c.appendChild(pair[1]);
        grid.appendChild(c);
      });
      var c2 = el("div", { class: "field" });
      c2.appendChild(el("label", {}, "Active"));
      c2.appendChild(activeWrap);
      grid.appendChild(c2);
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var save = el("button", { class: "btn btn-primary", type: "button" }, icon("save", 16) + " Save");
      footer.appendChild(cancel);
      footer.appendChild(save);
      var modal = new Modal({ title: "Edit user — " + u.u, body: grid, footer: footer });
      cancel.addEventListener("click", modal.close);
      save.addEventListener("click", function () {
        if (!nameIn.value.trim() || !userIn.value.trim()) { toast("Name and username are required", "error"); return; }
        var dup = users.find(function (x) { return x.u === userIn.value.trim() && x.u !== u.u; });
        if (dup) { toast("That username is already in use", "error"); return; }
        u.name = nameIn.value.trim();
        u.u = userIn.value.trim();
        if (passIn.value) u.p = passIn.value;
        u.role = roleIn.value;
        u.active = activeIn.checked;
        if (u.u === me.u) { u.active = true; }
        Store.log("edit", "Updated user account: " + u.u);
        Store.save();
        toast("User updated");
        modal.close();
        usersPage(view);
      });
      modal.open();
    }

    var addBtn = view.querySelector("[data-add-user]");
    if (addBtn) addBtn.addEventListener("click", function () {
      var nameIn = el("input", { type: "text", placeholder: "Full name" });
      var userIn = el("input", { type: "text", placeholder: "Username" });
      var passIn = el("input", { type: "password", placeholder: "Password (min 6 chars)" });
      var roleIn = el("select");
      Object.keys(Store.data.roles).forEach(function (r) {
        roleIn.appendChild(el("option", { value: r }, Store.data.roles[r].label || r));
      });
      var grid = el("div", { class: "form-grid" });
      [["Full name", nameIn], ["Username", userIn], ["Password", passIn], ["Role", roleIn]].forEach(function (pair) {
        var c = el("div", { class: "field" });
        c.appendChild(el("label", {}, pair[0]));
        c.appendChild(pair[1]);
        grid.appendChild(c);
      });
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var save = el("button", { class: "btn btn-primary", type: "button" }, icon("add", 16) + " Add user");
      footer.appendChild(cancel);
      footer.appendChild(save);
      var modal = new Modal({ title: "Add user", body: grid, footer: footer });
      cancel.addEventListener("click", modal.close);
      save.addEventListener("click", function () {
        if (!nameIn.value.trim() || !userIn.value.trim() || !passIn.value) { toast("All fields are required", "error"); return; }
        if (passIn.value.length < 6) { toast("Password must be at least 6 characters", "error"); return; }
        if (users.some(function (x) { return x.u === userIn.value.trim(); })) { toast("That username already exists", "error"); return; }
        users.push({ id: uid("u"), u: userIn.value.trim(), p: passIn.value, name: nameIn.value.trim(), role: roleIn.value, active: true, createdAt: new Date().toISOString() });
        Store.log("add", "Created user account: " + userIn.value.trim());
        Store.save();
        toast("User added");
        modal.close();
        usersPage(view);
      });
      modal.open();
    });
  }

  /* ============ settings ============ */
  function settings(view) {
    view.innerHTML = "";
    var canBackup = Auth.can("manageBackup");
    var canSettings = Auth.can("manageSettings");
    view.appendChild(el("div", null, pageHead("Settings", "Storage, backup and account settings.")));

    var storage = panel("Storage", "Where the admin data is persisted.");
    var mode = Store.storageMode() === "IndexedDB" ? "IndexedDB (browser database)" : "LocalStorage";
    storage.body.appendChild(el("div", { class: "storage-line" },
      '<span class="badge badge--' + (mode.indexOf("IndexedDB") === 0 ? "green" : "gold") + '">' + esc(mode) + "</span>" +
      "<span>" + esc(Store.size()) + " stored · " + (Store.data.backups || []).length + " backups</span>"));
    view.appendChild(storage.panel);

    if (canBackup || canSettings) {
      var backup = panel("Backup & restore", "Export or import a full JSON backup of all content.");
      var bGrid = el("div", { style: "display:flex;gap:0.7rem;flex-wrap:wrap" });
      var exp = el("button", { class: "btn btn-primary", type: "button" }, icon("download", 16) + " Export JSON");
      bGrid.appendChild(exp);
      if (canBackup) {
        var imp = el("label", { class: "btn", style: "cursor:pointer" }, icon("upload", 16) + " Import JSON");
        var impFile = el("input", { type: "file", accept: ".json,application/json", style: "display:none" });
        imp.appendChild(impFile);
        bGrid.appendChild(imp);
        impFile.addEventListener("change", function () {
          var f = impFile.files[0];
          if (!f) return;
          var reader = new FileReader();
          reader.onload = function () {
            try {
              Store.importJSON(String(reader.result));
              toast("Content restored from backup");
              view.dispatchEvent(new Event("pcm:reload"));
              settings(view);
            } catch (err) {
              toast("Import failed: " + err.message, "error");
            }
          };
          reader.readAsText(f);
        });
      }
      backup.body.appendChild(bGrid);
      backup.body.appendChild(el("p", { class: "hint", style: "margin:0.8rem 0 0" }, "Importing a backup replaces all current content and activity. Users and roles are kept."));
      exp.addEventListener("click", function () {
        var blob = new Blob([Store.exportJSON()], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "pcm-admin-backup-" + new Date().toISOString().slice(0, 10) + ".json";
        a.click();
        URL.revokeObjectURL(url);
        Store.log("export", "Content exported as JSON backup");
        toast("Backup downloaded");
      });
      view.appendChild(backup.panel);
    }

    var account = panel("Account", "Change your admin password.");
    var oldP = A.el("input", { type: "password", placeholder: "Current password" });
    var newP = A.el("input", { type: "password", placeholder: "New password (min 6 chars)" });
    var confirmP = A.el("input", { type: "password", placeholder: "Confirm new password" });
    var fGrid = el("div", { class: "form-grid" });
    [oldP, newP, confirmP].forEach(function (i) {
      var c = el("div", { class: "field" });
      c.appendChild(el("label", {}, esc(i.placeholder)));
      c.appendChild(i);
      fGrid.appendChild(c);
    });
    var saveBtn = el("button", { class: "btn btn-primary", type: "button" }, icon("lock", 16) + " Update password");
    account.body.appendChild(fGrid);
    account.body.appendChild(el("div", { style: "margin-top:1rem" }, saveBtn));

    saveBtn.addEventListener("click", function () {
      if (newP.value.length < 6) { toast("Password must be at least 6 characters", "error"); return; }
      if (newP.value !== confirmP.value) { toast("Passwords do not match", "error"); return; }
      if (!A.Auth.changePassword(oldP.value, newP.value)) { toast("Current password is incorrect", "error"); return; }
      toast("Password updated");
      oldP.value = newP.value = confirmP.value = "";
    });

    view.appendChild(account.panel);
  }

  /* ============ SEO & meta ============ */
  var SEO_GLOBAL_FIELDS = [
    { key: "siteTitle", label: "Site title", type: "text", required: true, hint: "Shown in the browser tab and search results (e.g. Pokhara College of Management)." },
    { key: "siteDescription", label: "Site description", type: "textarea", required: true, hint: "Default meta description used when a page has no custom one." },
    { key: "siteKeywords", label: "Site keywords", type: "textarea", hint: "Comma-separated keywords." },
    { key: "ogType", label: "Default og:type", type: "select", options: ["website", "article"], hint: "Open Graph type for the homepage." },
    { key: "ogImage", label: "Default og:image", type: "img", hint: "Shared preview image for social shares." },
    { key: "twitterCard", label: "Twitter card", type: "select", options: ["summary", "summary_large_image"] },
    { key: "robots", label: "Default robots", type: "text", hint: "e.g. index, follow" },
    { key: "canonical", label: "Canonical URL", type: "url", hint: "Preferred base URL of the site." }
  ];

  function seoPage(view) {
    view.innerHTML = "";
    var canManage = Auth.can("manageSettings");
    var seo = Store.data.seo || {};
    var pages = seo.pages || {};
    var global = seo.global || {};

    view.appendChild(el("div", null, pageHead("SEO & Meta", "Site-wide defaults and per-page meta tags published live to the public website.",
      '<a class="btn" href="../index.html" target="_blank" rel="noopener" data-back-site>' + icon("globe", 16) + " Back to website</a>" +
      (canManage ? '<button class="btn btn-primary" data-save-seo>' + icon("save", 16) + " Save changes</button>" : ""))));

    var wrap = el("div", { style: "display:grid;gap:1rem" });
    view.appendChild(wrap);

    var globalPanel = panel("Site-wide defaults", "Applied to every page that does not define its own values.");
    var fb = new FormBuilder(SEO_GLOBAL_FIELDS, global || {});
    globalPanel.body.appendChild(fb.el);
    if (!canManage) {
      globalPanel.body.appendChild(el("p", { class: "hint" }, "You have read-only access to SEO settings."));
    }
    wrap.appendChild(globalPanel.panel);

    var pagesPanel = panel("Per-page meta", "Titles and descriptions for each page on the website.");
    var list = el("div", { class: "seo-list" });
    var seoPages = PAGES.slice();
    ["news-details", "blogs-student", "gpa-converter", "np-en-converter"].forEach(function (extra) {
      if (!seoPages.some(function (p) { return p.slug === extra; })) {
        var label = extra.split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        seoPages.push({ slug: extra, title: label, url: extra + ".html" });
      }
    });
    seoPages.forEach(function (pg) {
      var entry = pages[pg.slug] || {};
      var okTitle = !!(entry.title && entry.title.length);
      var okDesc = !!(entry.description && entry.description.length);
      var okKw = !!(entry.keywords && entry.keywords.length);
      var okOg = !!(entry.ogTitle && entry.ogTitle.length);
      var row = el("div", { class: "seo-item" });
      var info = el("div", { class: "seo-item__info" },
        icon("pages", 15) +
        "<div><b>" + esc(pg.title) + "</b><span>" + esc(pg.url) + " · " + esc(pg.slug) + "</span>" +
        "<span class='hint'>" + esc((entry.title || "No custom title — site default used").slice(0, 60)) + "</span></div>");
      row.appendChild(info);
      var badges = el("div", { class: "seo-item__badges" },
        '<span class="badge badge--' + (okTitle ? "green" : "gray") + '" title="Meta title">T</span>' +
        '<span class="badge badge--' + (okDesc ? "green" : "gray") + '" title="Meta description">D</span>' +
        '<span class="badge badge--' + (okKw ? "green" : "gray") + '" title="Keywords">K</span>' +
        '<span class="badge badge--' + (okOg ? "green" : "gray") + '" title="Open Graph title">OG</span>');
      row.appendChild(badges);
      var viewLink = el("a", { class: "btn btn-sm", target: "_blank", rel: "noopener", href: "../" + esc(pg.url) }, icon("view", 14) + " View");
      row.appendChild(viewLink);
      if (canManage) {
        var ed = el("button", { class: "btn btn-sm", type: "button" }, icon("edit", 14) + " Edit");
        ed.addEventListener("click", function () { editPageMeta(pg, entry); });
        row.appendChild(ed);
      }
      list.appendChild(row);
    });
    pagesPanel.body.appendChild(list);
    wrap.appendChild(pagesPanel.panel);

    function editPageMeta(pg, entry) {
      var titleIn = el("input", { type: "text", value: entry.title || "" });
      var descIn = el("textarea", { placeholder: "Meta description…", style: "min-height:80px" }, entry.description || "");
      var kwIn = el("textarea", { placeholder: "Comma-separated keywords…", style: "min-height:60px" }, entry.keywords || "");
      var robotsIn = el("input", { type: "text", placeholder: "e.g. index, follow", value: entry.robots || "" });
      var ogTitleIn = el("input", { type: "text", placeholder: "Social share title", value: entry.ogTitle || "" });
      var ogDescIn = el("textarea", { placeholder: "Social share description…", style: "min-height:60px" }, entry.ogDescription || "");
      var ogImageIn = el("input", { type: "text", placeholder: "assets/img/…", value: entry.ogImage || "" });
      var count = el("div", { class: "hint", style: "margin-top:.35rem" }, "Google shows ~50-60 characters of the title.");
      var grid = el("div", { class: "form-grid" });
      var c1 = el("div", { class: "field" });
      c1.appendChild(el("label", {}, "Meta title"));
      c1.appendChild(titleIn);
      c1.appendChild(count);
      grid.appendChild(c1);
      var c2 = el("div", { class: "field" });
      c2.appendChild(el("label", {}, "Meta description"));
      c2.appendChild(descIn);
      grid.appendChild(c2);
      var c3 = el("div", { class: "field" });
      c3.appendChild(el("label", {}, "Keywords"));
      c3.appendChild(kwIn);
      grid.appendChild(c3);
      var c4 = el("div", { class: "field" });
      c4.appendChild(el("label", {}, "Robots"));
      c4.appendChild(robotsIn);
      grid.appendChild(c4);
      var c5 = el("div", { class: "field" });
      c5.appendChild(el("label", {}, "Open Graph title"));
      c5.appendChild(ogTitleIn);
      grid.appendChild(c5);
      var c6 = el("div", { class: "field" });
      c6.appendChild(el("label", {}, "Open Graph description"));
      c6.appendChild(ogDescIn);
      grid.appendChild(c6);
      var c7 = el("div", { class: "field" });
      c7.appendChild(el("label", {}, "Open Graph image (optional)"));
      c7.appendChild(ogImageIn);
      grid.appendChild(c7);
      var footer = el("div", null);
      var cancel = el("button", { class: "btn", type: "button" }, "Cancel");
      var save = el("button", { class: "btn btn-primary", type: "button" }, icon("save", 16) + " Save");
      footer.appendChild(cancel);
      footer.appendChild(save);
      var modal = new Modal({ title: "SEO — " + pg.title, body: grid, footer: footer });
      cancel.addEventListener("click", modal.close);
      save.addEventListener("click", function () {
        var patch = {};
        if (titleIn.value.trim()) patch.title = titleIn.value.trim();
        if (descIn.value.trim()) patch.description = descIn.value.trim();
        if (kwIn.value.trim()) patch.keywords = kwIn.value.trim();
        if (robotsIn.value.trim()) patch.robots = robotsIn.value.trim();
        if (ogTitleIn.value.trim()) patch.ogTitle = ogTitleIn.value.trim();
        if (ogDescIn.value.trim()) patch.ogDescription = ogDescIn.value.trim();
        if (ogImageIn.value.trim()) patch.ogImage = ogImageIn.value.trim();
        Store.updateSeoPage(pg.slug, patch);
        toast("SEO updated for " + pg.title);
        modal.close();
        seoPage(view);
      });
      modal.open();
      titleIn.focus();
    }

    var saveBtn = view.querySelector("[data-save-seo]");
    if (saveBtn) saveBtn.addEventListener("click", function () {
      if (!fb.validate()) { toast("Please fix the highlighted fields", "error"); return; }
      Store.updateSeoGlobal(fb.getValues());
      toast("Site-wide SEO settings saved");
      seoPage(view);
    });
  }

  /* ============ router ============ */
  var routes = {
    dashboard: dashboard,
    content: contentPage,
    pages: pagesManager,
    trash: trashPage,
    backups: backupsPage,
    users: usersPage,
    seo: seoPage,
    settings: settings
  };

  function render(view, route) {
    view.innerHTML = "";
    if (route.name === "dashboard") dashboard(view);
    else if (route.name === "content") contentPage(view, route.col);
    else if (route.name === "pages") pagesManager(view);
    else if (route.name === "trash") trashPage(view);
    else if (route.name === "backups") backupsPage(view);
    else if (route.name === "users") usersPage(view);
    else if (route.name === "seo") seoPage(view);
    else if (route.name === "settings") settings(view);
  }

  window.PCMAdmin.routes = { render: render, settings: settings };
})();
