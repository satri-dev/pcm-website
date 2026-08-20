/* ============================================================
   PCM Admin — admin/js/admin.ui.js
   Reusable UI components: Toast, Modal, FormBuilder, DataTable,
   Charts. Pure vanilla, DOM-based.
   ============================================================ */
(function () {
  "use strict";
  var A = window.PCMAdmin;
  var esc = A.esc, icon = A.icon, fmtDate = A.fmtDate, initials = A.initials, rgba = A.rgba,
      isDataUrl = A.isDataUrl, isImageUrl = A.isImageUrl, fileLabel = A.fileLabel, bytesToSize = A.bytesToSize;

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "data") { for (var dk in attrs[k]) n.setAttribute("data-" + dk, attrs[k][dk]); }
      else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k]) n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- Toast ---------- */
  var toastWrap;
  function ensureWrap() {
    if (!toastWrap || !document.body.contains(toastWrap)) {
      toastWrap = el("div", { class: "toast-wrap" });
      document.body.appendChild(toastWrap);
    }
    return toastWrap;
  }
  window.PCMAdmin.toast = function (msg, type) {
    type = type || "success";
    var icons = { success: "check", error: "close", info: "notice" };
    var t = el("div", { class: "toast toast--" + type }, icon(icons[type], 18) + "<span>" + esc(msg) + "</span>");
    ensureWrap().appendChild(t);
    setTimeout(function () {
      t.classList.add("leaving");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
    }, 3200);
  };

  /* ---------- Modal ---------- */
  function Modal(opts) {
    var self = this;
    this.title = opts.title || "";
    this.onClose = opts.onClose || null;
    this.bodyEl = opts.body || null;   // element
    this.footerEl = opts.footer || null; // element or null

    this.scrim = el("div", { class: "modal-scrim" });
    var modal = el("div", { class: "modal" });
    var head = el("div", { class: "modal__head" },
      "<h3>" + esc(this.title) + "</h3>" +
      '<button class="icon-btn" aria-label="Close">' + icon("close", 18) + "</button>");
    this.scrim.appendChild(modal);
    modal.appendChild(head);
    var bodyWrap = el("div", { class: "modal__body" });
    if (this.bodyEl) bodyWrap.appendChild(this.bodyEl);
    modal.appendChild(bodyWrap);
    if (this.footerEl) {
      var foot = el("div", { class: "modal__foot" });
      foot.appendChild(this.footerEl);
      modal.appendChild(foot);
    }

    var closeBtn = head.querySelector(".icon-btn");
    var close = function () {
      self.scrim.classList.remove("is-open");
      document.removeEventListener("keydown", keyHandler);
      setTimeout(function () {
        if (self.scrim.parentNode) self.scrim.parentNode.removeChild(self.scrim);
        if (self.onClose) self.onClose();
      }, 180);
    };
    var keyHandler = function (e) { if (e.key === "Escape") close(); };
    closeBtn.addEventListener("click", close);
    this.scrim.addEventListener("click", function (e) { if (e.target === self.scrim) close(); });
    document.addEventListener("keydown", keyHandler);

    this.open = function () {
      document.body.appendChild(self.scrim);
      requestAnimationFrame(function () { self.scrim.classList.add("is-open"); });
    };
    this.close = close;
  }

  /* ---------- Form builder ---------- */
  function buildFileInput(f, val) {
    val = val == null ? "" : String(val);
    var limitMB = f.maxSizeMB || (f.kind === "image" ? 2 : 5);
    var limitBytes = limitMB * 1048576;
    var wrap = el("div", { class: "file-field" });
    var hidden = el("input", { type: "file", accept: f.accept || (f.kind === "image" ? "image/*" : "*/*"), style: "display:none" });
    var urlInput = el("input", { type: "text", name: f.key, value: val, placeholder: "…or paste a URL to an existing file" });
    urlInput.setAttribute("data-file-value", "1");
    var btn = el("button", { type: "button", class: "btn btn-sm btn-ghost", style: "cursor:pointer;flex:none" },
      icon("upload", 14) + " Choose file" + (f.kind === "image" ? " · max " + limitMB + "MB image" : " · max " + limitMB + "MB"));
    btn.addEventListener("click", function () { hidden.click(); });
    hidden.addEventListener("change", function () {
      var file = hidden.files && hidden.files[0];
      if (!file) { hidden.value = ""; return; }
      if (file.size > limitBytes) {
        A.toast("File too large — max " + limitMB + "MB", "error");
        hidden.value = "";
        return;
      }
      if (f.kind === "image" && file.type.indexOf("image/") !== 0) {
        A.toast("Please choose an image file", "error");
        hidden.value = "";
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        urlInput.value = String(reader.result);
        refresh();
      };
      reader.readAsDataURL(file);
    });
    var row1 = el("div", { style: "display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center" });
    row1.appendChild(hidden);
    row1.appendChild(btn);
    row1.appendChild(urlInput);
    var preview = el("div", { class: "img-prev", style: "margin-top:0.4rem;display:none" });
    var remove = el("button", { type: "button", class: "btn btn-sm btn-ghost btn-danger", style: "display:none;margin-top:0.4rem" }, icon("close", 13) + " Remove");
    function refresh() {
      var v = urlInput.value.trim();
      if (!v) { preview.style.display = "none"; remove.style.display = "none"; preview.innerHTML = ""; return; }
      preview.style.display = "block"; remove.style.display = "";
      if (isImageUrl(v)) {
        preview.innerHTML = '<img src="' + esc(v) + '" alt="" style="height:64px;width:auto;max-width:100%;border-radius:8px;border:1px solid #e2e7f0">';
      } else {
        preview.innerHTML = '<span class="badge badge--blue">' + icon("file", 13) + " " + esc(fileLabel(v)) + "</span>";
      }
    }
    urlInput.addEventListener("input", refresh);
    remove.addEventListener("click", function () { urlInput.value = ""; hidden.value = ""; refresh(); });
    wrap.appendChild(row1);
    wrap.appendChild(preview);
    wrap.appendChild(remove);
    if (val) refresh();
    wrap.__valueInput = urlInput;
    return wrap;
  }

  /* ---------- Rich text editor (lightweight, execCommand-based) ---------- */
  function buildRichText(f, val) {
    val = val == null ? "" : String(val);
    var wrap = el("div", { class: "rte" });

    var hidden = el("textarea", { name: f.key, class: "rte__value", style: "display:none", "data-rte-value": "1" });
    hidden.value = val;

    var editor = el("div", { class: "rte__editor", contenteditable: "true" });
    editor.innerHTML = val.indexOf("<") === -1 ? val.replace(/\n/g, "<br>") : val;
    if (!editor.innerHTML) editor.innerHTML = "<p><br></p>";

    function sync() {
      if (editor.innerText.trim() === "") hidden.value = "";
      else hidden.value = editor.innerHTML;
    }
    editor.addEventListener("input", sync);
    editor.addEventListener("keyup", sync);
    editor.addEventListener("blur", sync);

    var toolbar = el("div", { class: "rte__toolbar" });

    var cmds = [
      { cmd: "bold", label: "B", title: "Bold (Ctrl+B)" },
      { cmd: "italic", label: "I", title: "Italic (Ctrl+I)" },
      { cmd: "underline", label: "U", title: "Underline (Ctrl+U)" },
      { cmd: "strikeThrough", label: "S", title: "Strikethrough" },
      { sep: true },
      { cmd: "formatBlock", arg: "h2", label: "H2", title: "Heading 2" },
      { cmd: "formatBlock", arg: "h3", label: "H3", title: "Heading 3" },
      { cmd: "formatBlock", arg: "p", label: "¶", title: "Paragraph" },
      { sep: true },
      { cmd: "insertUnorderedList", label: "•=", title: "Bullet list" },
      { cmd: "insertOrderedList", label: "1·", title: "Numbered list" },
      { cmd: "formatBlock", arg: "blockquote", label: "❝", title: "Quote" },
      { sep: true },
      { cmd: "createLink", label: "🔗", title: "Insert link" },
      { cmd: "unlink", label: "Unlink", title: "Remove link" },
      { sep: true },
      { cmd: "removeFormat", label: "⌫", title: "Clear formatting" }
    ];

    cmds.forEach(function (c) {
      if (c.sep) {
        toolbar.appendChild(el("span", { class: "rte__sep" }, ""));
        return;
      }
      var b = el("button", { type: "button", class: "rte__btn", title: c.title }, c.label);
      b.addEventListener("mousedown", function (e) { e.preventDefault(); editor.focus(); });
      b.addEventListener("click", function () {
        if (c.cmd === "createLink") {
          var url = prompt("Link URL", "https://");
          if (url && url.trim()) document.execCommand("createLink", false, url.trim());
          else return;
        } else {
          document.execCommand(c.cmd, false, c.arg || null);
        }
        sync();
      });
      toolbar.appendChild(b);
    });

    editor.addEventListener("keydown", function (e) {
      if (e.ctrlKey || e.metaKey) {
        var k = e.key.toLowerCase();
        var map = { b: "bold", i: "italic", u: "underline" };
        if (map[k]) {
          e.preventDefault();
          document.execCommand(map[k], false, null);
          sync();
        }
      }
    });

    wrap.appendChild(toolbar);
    wrap.appendChild(editor);
    wrap.appendChild(hidden);
    wrap.__valueInput = hidden;
    return wrap;
  }

  function buildInput(f, val) {
    val = val == null ? "" : val;
    var input;
    if (f.type === "file") {
      input = buildFileInput(f, val);
    } else if (f.type === "textarea") {
      input = f.rich === false ? el("textarea", { name: f.key, rows: f.rows || 4 }, esc(val)) : buildRichText(f, val);
    } else if (f.type === "select") {
      var opts = '<option value="">— Select —</option>';
      (f.options || []).forEach(function (o) {
        opts += '<option value="' + esc(o) + '"' + (String(val) === String(o) ? " selected" : "") + ">" + esc(o) + "</option>";
      });
      input = el("select", { name: f.key }, opts);
    } else if (f.type === "toggle") {
      var w = el("div", { class: "switch" });
      var cb = el("input", { type: "checkbox", name: f.key });
      if (val === true || val === "true" || val === 1 || val === "1") cb.checked = true;
      w.appendChild(cb);
      w.appendChild(el("span", { class: "track" }));
      input = w;
      input.__isToggle = true;
    } else if (f.type === "number") {
      input = el("input", { type: "number", name: f.key, value: val == null ? "" : String(val) });
    } else {
      var type = f.type === "email" ? "email" : f.type === "url" ? "url" : f.type === "date" ? "date" : "text";
      input = el("input", { type: type, name: f.key, value: String(val) });
    }
    return input;
  }

  function buildListField(f, val) {
    var rows = Array.isArray(val) ? val : [];
    var wrap = el("div", { class: "list-field" });
    var addBtn = el("button", { type: "button", class: "btn btn-sm", style: "margin-top:0.5rem" }, icon("add", 14) + " Add " + (f.itemLabel || "row"));
    function renderRow(row) {
      var r = el("div", { class: "list-field__row" });
      (f.itemFields || []).forEach(function (it) {
        var c = el("div", { class: "list-field__cell" });
        c.appendChild(el("label", {}, esc(it.label)));
        c.appendChild(buildInput(it, row ? row[it.key] : ""));
        var ctrl = c.querySelector(".file-field") || c.querySelector("input,textarea,select");
        if (ctrl) ctrl.dataset.rowInput = it.key;
        r.appendChild(c);
      });
      var del = el("button", { type: "button", class: "icon-btn list-field__del", "aria-label": "Remove " + (f.itemLabel || "row") }, icon("trash", 15));
      del.addEventListener("click", function () { r.parentNode.removeChild(r); });
      r.appendChild(del);
      return r;
    }
    rows.forEach(function (row) { wrap.appendChild(renderRow(row)); });
    addBtn.addEventListener("click", function () { wrap.appendChild(renderRow({})); });
    wrap.appendChild(addBtn);
    wrap.__getRows = function () {
      return Array.prototype.slice.call(wrap.querySelectorAll(".list-field__row")).map(function (row) {
        var o = {};
        row.querySelectorAll("[data-row-input]").forEach(function (inp) {
          if (inp.classList && inp.classList.contains("file-field")) {
            o[inp.dataset.rowInput] = inp.__valueInput ? inp.__valueInput.value : "";
            return;
          }
          o[inp.dataset.rowInput] = inp.type === "checkbox" ? inp.checked : inp.value;
        });
        return o;
      });
    };
    return wrap;
  }

  function FormBuilder(fields, values) {
    this.fields = fields || [];
    this.values = values || {};
    var grid = el("div", { class: "form-grid" });
    this.controls = {};

    var self = this;
    this.fields.forEach(function (f) {
      if (f.type === "section") {
        grid.appendChild(el("div", { class: "form-section field--full" },
          (f.icon ? icon(f.icon, 14) + " " : "") + "<b>" + esc(f.label || "") + "</b>" +
          (f.sub ? "<span>" + esc(f.sub) + "</span>" : "")));
        return;
      }
      var fieldEl = el("div", { class: "field" + (f.full ? " field--full" : "") });
      var label = el("label", {}, esc(f.label) + (f.required ? ' <span class="req">*</span>' : ""));
      fieldEl.appendChild(label);
      var input;
      if (f.type === "list") {
        input = buildListField(f, self.values[f.key]);
      } else {
        input = buildInput(f, self.values[f.key]);
      }
      input.setAttribute("data-validate", f.required ? "required" : "");
      fieldEl.appendChild(input);
      if (f.type !== "list" && f.hint) fieldEl.appendChild(el("div", { class: "hint" }, esc(f.hint)));
      if (f.type === "img") {
        var prev = el("div", { class: "img-prev", style: "margin-top:0.4rem;display:none" });
        fieldEl.appendChild(prev);
        if (input.addEventListener) {
          input.addEventListener("input", function () {
            var v = input.value.trim();
            if (v) { prev.style.display = "block"; prev.innerHTML = '<img src="' + esc(v) + '" alt="" style="height:64px;width:auto;max-width:100%;border-radius:8px;border:1px solid #e2e7f0">'; }
            else { prev.style.display = "none"; prev.innerHTML = ""; }
          });
          if (self.values[f.key]) { input.value = self.values[f.key]; input.dispatchEvent(new Event("input")); }
        }
      }
      fieldEl.appendChild(el("div", { class: "field__err" }, "This field is required"));
      self.controls[f.key] = input;
      grid.appendChild(fieldEl);
    });

    this.el = grid;

    this.validate = function () {
      var ok = true;
      self.fields.forEach(function (f) {
        if (f.type === "section") return;
        var c = self.controls[f.key];
        var fieldEl = c && c.closest ? c.closest(".field") : null;
        if (!fieldEl) return;
        fieldEl.classList.remove("is-invalid");
        if (f.required) {
          var v = self.controls[f.key].__isToggle ? self.controls[f.key].querySelector("input").checked
            : self.controls[f.key].__valueInput ? self.controls[f.key].__valueInput.value
            : self.controls[f.key].value;
          if (f.type === "list") v = self.controls[f.key].__getRows().length;
          if (v == null || String(v).trim() === "") {
            fieldEl.classList.add("is-invalid");
            ok = false;
          }
        }
        if (ok && f.type === "email" && String(self.controls[f.key].value).trim() !== "") {
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(self.controls[f.key].value)) {
            fieldEl.classList.add("is-invalid");
            ok = false;
          }
        }
      });
      return ok;
    };

    this.getValues = function () {
      var out = {};
      self.fields.forEach(function (f) {
        var c = self.controls[f.key];
        if (!c) return;
        if (f.type === "list") out[f.key] = c.__getRows();
        else if (c.__isToggle) out[f.key] = c.querySelector("input").checked;
        else if (c.__valueInput) out[f.key] = c.__valueInput.value;
        else out[f.key] = c.value;
      });
      return out;
    };
  }

  /* ---------- DataTable ---------- */
  function DataTable(container, config) {
    var self = this;
    this.container = container;
    this.config = config || {};
    this.columns = this.config.columns || [];
    this.searchFields = this.config.searchFields || [];
    this.filters = this.config.filters || [];
    this.perPage = this.config.perPage || 8;
    this.rows = this.config.rows || [];
    this.getRows = this.config.getRows || function () { return this.rows; };
    this.onEdit = this.config.onEdit || null;
    this.onDelete = this.config.onDelete || null;
    this.onView = this.config.onView || null;

    this.state = { search: "", filters: {}, sortKey: null, sortDir: "asc", page: 1, pageSize: this.perPage };

    this.render = function () {
      this.container.innerHTML = "";
      this.container.appendChild(this.buildToolbar());

      var rows = this.getFilteredSorted();
      var total = rows.length;
      var pages = Math.max(1, Math.ceil(total / this.state.pageSize));
      if (this.state.page > pages) this.state.page = pages;

      var wrap = el("div", { class: "panel" });
      var tableWrap = el("div", { class: "dtable-wrap" });
      tableWrap.appendChild(this.buildTable(rows));
      wrap.appendChild(tableWrap);
      wrap.appendChild(this.buildPager(total, pages));
      this.container.appendChild(wrap);
      this.container.__count = total;
    };

    this.buildToolbar = function () {
      var bar = el("div", { class: "toolbar" });

      var sb = el("div", { class: "search-box" }, icon("search", 16));
      var input = el("input", { type: "text", placeholder: "Search " + (this.config.searchLabel || "records") + "…" });
      var t = null;
      input.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () { self.state.search = input.value.trim().toLowerCase(); self.state.page = 1; self.render(); }, 220);
      });
      sb.appendChild(input);
      bar.appendChild(sb);

      this.filters.forEach(function (f) {
        var sel = el("select", { class: "select-sm", "aria-label": "Filter by " + f.label });
        sel.appendChild(el("option", { value: "" }, "All " + f.label.toLowerCase()));
        var seen = {};
        self.getRows().forEach(function (r) {
          var v = r[f.key];
          if (v == null || String(v) === "") return;
          var key = String(v);
          if (seen[key]) return;
          seen[key] = 1;
          sel.appendChild(el("option", { value: key }, esc(key)));
        });
        sel.addEventListener("change", function () {
          self.state.filters[f.key] = sel.value;
          self.state.page = 1;
          self.render();
        });
        bar.appendChild(sel);
      });

      bar.appendChild(el("div", { style: "font-size:0.8rem;color:#5c6678;margin-left:auto" }, "<b>" + this.getRows().length + "</b> total"));
      return bar;
    };

    this.getFilteredSorted = function () {
      var q = this.state.search;
      var rows = this.getRows().filter(function (r) {
        if (q) {
          var hay = self.searchFields.map(function (k) { return String(r[k] == null ? "" : r[k]).toLowerCase(); }).join(" ");
          if (hay.indexOf(q) === -1) return false;
        }
        for (var fk in self.state.filters) {
          if (self.state.filters[fk] && String(r[fk]) !== self.state.filters[fk]) return false;
        }
        return true;
      });
      if (this.state.sortKey) {
        var key = this.state.sortKey, dir = this.state.sortDir === "asc" ? 1 : -1;
        rows.sort(function (a, b) {
          var va = a[key], vb = b[key];
          var na = parseFloat(va), nb = parseFloat(vb);
          var cmp;
          if (!isNaN(na) && !isNaN(nb)) cmp = na - nb;
          else cmp = String(va == null ? "" : va).localeCompare(String(vb == null ? "" : vb));
          return cmp * dir;
        });
      }
      return rows;
    };

    this.buildTable = function (rows) {
      var table = el("table", { class: "dtable" });
      var thead = el("thead");
      var tr = el("tr");
      this.columns.forEach(function (col) {
        var th = el("th", { class: "sortable" });
        th.innerHTML = esc(col.label) + ' <span class="sort-ind">' + (self.state.sortKey === col.key ? (self.state.sortDir === "asc" ? "▲" : "▼") : "↕") + "</span>";
        th.addEventListener("click", function () {
          if (self.state.sortKey === col.key) self.state.sortDir = self.state.sortDir === "asc" ? "desc" : "asc";
          else { self.state.sortKey = col.key; self.state.sortDir = "asc"; }
          self.state.page = 1;
          self.render();
        });
        if (self.state.sortKey === col.key) th.classList.add("sorted");
        tr.appendChild(th);
      });
      tr.appendChild(el("th", { style: "text-align:right" }, "Actions"));
      thead.appendChild(tr);
      table.appendChild(thead);

      var tbody = el("tbody");
      if (!rows.length) {
        var emptyTr = el("tr");
        emptyTr.appendChild(el("td", { colspan: String(this.columns.length + 1) },
          '<div class="empty">' + icon("search", 40) + "<p>No records match your search.</p></div>"));
        tbody.appendChild(emptyTr);
      } else {
        var start = (this.state.page - 1) * this.state.pageSize;
        var slice = rows.slice(start, start + this.state.pageSize);
        slice.forEach(function (row) {
          var rtr = el("tr");
          self.columns.forEach(function (col) {
            var td = el("td", { "data-label": col.label });
            if (col.main) td.innerHTML = self.renderMain(row, col);
            else td.innerHTML = self.renderCell(row, col);
            rtr.appendChild(td);
          });
          var actTd = el("td", { "data-label": "Actions" });
          var acts = el("div", { class: "row-actions", style: "justify-content:flex-end" });
          if (self.onView) {
            var v = el("button", { class: "act-btn", title: "View" }, icon("eye", 15));
            v.addEventListener("click", function () { self.onView(row); });
            acts.appendChild(v);
          }
          if (self.onEdit) {
            var e = el("button", { class: "act-btn", title: "Edit" }, icon("edit", 15));
            e.addEventListener("click", function () { self.onEdit(row); });
            acts.appendChild(e);
          }
          if (self.onDelete) {
            var del = el("button", { class: "act-btn danger", title: "Delete" }, icon("trash", 15));
            del.addEventListener("click", function () { self.onDelete(row); });
            acts.appendChild(del);
          }
          actTd.appendChild(acts);
          rtr.appendChild(actTd);
          tbody.appendChild(rtr);
        });
      }
      table.appendChild(tbody);
      return table;
    };

    this.renderMain = function (row, col) {
      var title = row[col.key] || "—";
      var sub = col.subKey ? row[col.subKey] : "";
      var thumbKey = col.thumbKey;
      var thumb = "";
      if (thumbKey && row[thumbKey]) {
        thumb = '<img class="cell-thumb" src="' + esc(row[thumbKey]) + '" alt="" loading="lazy">';
      } else {
        thumb = '<span class="avatar-sm">' + esc(initials(title)) + "</span>";
      }
      return '<div style="display:flex;align-items:center;gap:0.7rem">' + thumb +
        '<div class="cell-main"><b>' + esc(title) + "</b>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</div></div>";
    };

    this.renderCell = function (row, col) {
      var v = row[col.key];
      switch (col.type) {
        case "date": return fmtDate(v);
        case "toggle": return v === true || v === "true" || v === 1 || v === "1"
          ? '<span class="badge badge--green">Yes</span>' : '<span class="badge badge--gray">No</span>';
        case "select": return '<span class="badge badge--blue">' + esc(v == null ? "" : v) + "</span>";
        case "status": return String(v) === "published" || String(v) === "open"
          ? '<span class="badge badge--green">' + esc(v) + "</span>" : '<span class="badge badge--gray">' + esc(v) + "</span>";
        case "url": return v ? '<a href="' + esc(v) + '" target="_blank" rel="noopener">' + esc(String(v).split("/").pop()) + "</a>" : "—";
        case "img": return v ? '<a href="' + esc(v) + '" target="_blank" rel="noopener" style="font-size:.78rem">view</a>' : "—";
        case "file":
          if (!v) return "—";
          if (isImageUrl(v)) return '<a class="cell-thumb" href="' + esc(v) + '" target="_blank" rel="noopener" title="' + esc(fileLabel(v)) + '"><img src="' + esc(v) + '" alt="" loading="lazy"></a>';
          return '<a class="badge badge--blue" href="' + esc(v) + '" target="_blank" rel="noopener" title="' + esc(v) + '">' + icon("file", 12) + " " + esc(fileLabel(v)) + "</a>";
        case "list":
          if (!Array.isArray(v) || !v.length) return "—";
          return '<span class="badge badge--blue">' + v.length + " " + (col.listLabel || "items") + "</span>";
        default: return v == null || String(v) === "" ? "—" : esc(String(v).length > 48 ? String(v).slice(0, 48) + "…" : v);
      }
    };

    this.buildPager = function (total, pages) {
      var pager = el("div", { class: "pager" });
      var info = el("div", { class: "pager__info" },
        "Showing " + ((this.state.page - 1) * this.state.pageSize + 1) + "–" + Math.min(this.state.page * this.state.pageSize, total) + " of <b>" + total + "</b>");
      var right = el("div", { style: "display:flex;gap:0.7rem;align-items:center;flex-wrap:wrap" });

      var sizeSel = el("select", { class: "select-sm", "aria-label": "Rows per page" });
      [5, 8, 12, 20].forEach(function (n) {
        var o = el("option", { value: String(n) }, n + " / page");
        if (n === self.state.pageSize) o.selected = true;
        sizeSel.appendChild(o);
      });
      sizeSel.addEventListener("change", function () {
        self.state.pageSize = parseInt(sizeSel.value, 10);
        self.state.page = 1;
        self.render();
      });
      right.appendChild(sizeSel);

      var pagesBox = el("div", { class: "pager__pages" });
      var prev = el("button", { class: "page-btn", disabled: this.state.page <= 1 ? "disabled" : "" }, "‹");
      prev.addEventListener("click", function () { if (self.state.page > 1) { self.state.page--; self.render(); } });
      pagesBox.appendChild(prev);

      var win = this.pageWindow(this.state.page, pages);
      win.forEach(function (p) {
        var b = el("button", { class: "page-btn" + (p === self.state.page ? " active" : "") }, String(p));
        b.addEventListener("click", function () { self.state.page = p; self.render(); });
        pagesBox.appendChild(b);
      });

      var next = el("button", { class: "page-btn", disabled: this.state.page >= pages ? "disabled" : "" }, "›");
      next.addEventListener("click", function () { if (self.state.page < pages) { self.state.page++; self.render(); } });
      pagesBox.appendChild(next);

      right.appendChild(pagesBox);
      pager.appendChild(info);
      pager.appendChild(right);
      return pager;
    };

    this.pageWindow = function (cur, pages) {
      var out = [], start = Math.max(1, cur - 2), end = Math.min(pages, cur + 2);
      for (var i = start; i <= end; i++) out.push(i);
      return out;
    };
  }

  /* ---------- Charts ---------- */
  function barChart(container, items) {
    container.innerHTML = "";
    var max = Math.max.apply(null, items.map(function (i) { return i.value; })) || 1;
    items.forEach(function (it) {
      var row = el("div", { class: "bar-row" });
      row.appendChild(el("div", { class: "bar-row__label" }, esc(it.label)));
      var track = el("div", { class: "bar-row__track" });
      var fill = el("div", { class: "bar-row__fill", style: "background:" + (it.color || "#21409a") + ";width:0%" });
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el("div", { class: "bar-row__value" }, String(it.value)));
      container.appendChild(row);
      setTimeout(function () { fill.style.width = Math.max(3, (it.value / max) * 100) + "%"; }, 60);
    });
  }

  function donut(container, items) {
    container.innerHTML = "";
    var total = items.reduce(function (n, i) { return n + i.value; }, 0) || 1;
    var r = 15.9, c = 2 * Math.PI * r;
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 42 42");
    svg.setAttribute("width", "150");
    svg.setAttribute("height", "150");
    var bg = document.createElementNS(svgNS, "circle");
    bg.setAttribute("cx", "21"); bg.setAttribute("cy", "21"); bg.setAttribute("r", r);
    bg.setAttribute("fill", "none"); bg.setAttribute("stroke", "#eef1f6"); bg.setAttribute("stroke-width", "4");
    svg.appendChild(bg);
    var offset = 0;
    items.forEach(function (it) {
      var len = (it.value / total) * c;
      var seg = document.createElementNS(svgNS, "circle");
      seg.setAttribute("cx", "21"); seg.setAttribute("cy", "21"); seg.setAttribute("r", r);
      seg.setAttribute("fill", "none");
      seg.setAttribute("stroke", it.color || "#21409a");
      seg.setAttribute("stroke-width", "4");
      seg.setAttribute("stroke-dasharray", len + " " + (c - len));
      seg.setAttribute("stroke-dashoffset", -offset);
      seg.setAttribute("transform", "rotate(-90 21 21)");
      svg.appendChild(seg);
      offset += len;
    });
    var wrap = el("div", { style: "display:grid;place-items:center;position:relative" });
    wrap.appendChild(svg);
    wrap.appendChild(el("div", { style: "position:absolute;text-align:center" }, "<b style='font-size:1.5rem'>" + total + "</b><br><span style='font-size:.72rem;color:#5c6678'>total</span>"));
    container.appendChild(wrap);

    var legend = el("div", { class: "chart-legend", style: "margin-top:1rem;justify-content:center" });
    items.forEach(function (it) {
      legend.appendChild(el("span", {}, "<i style='background:" + it.color + "'></i>" + esc(it.label) + " · <b>" + it.value + "</b>"));
    });
    container.appendChild(legend);
  }

  function lineChart(container, labels, values, color) {
    container.innerHTML = "";
    color = color || "#21409a";
    var max = Math.max.apply(null, values.concat([1]));
    var n = values.length;
    var W = 100, H = 40, pad = 4;
    var pts = values.map(function (v, i) {
      var x = pad + (n === 1 ? 0 : (i * (W - 2 * pad)) / (n - 1));
      var y = H - pad - (v / max) * (H - 2 * pad);
      return [x, y];
    });
    var line = pts.map(function (p) { return p[0] + "," + p[1]; }).join(" ");
    var area = pad + "," + (H - pad) + " " + line + " " + (W - pad) + "," + (H - pad);

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("style", "width:100%;height:170px");
    var polyArea = document.createElementNS(svgNS, "polygon");
    polyArea.setAttribute("points", area);
    polyArea.setAttribute("fill", rgba(color, 0.12));
    svg.appendChild(polyArea);
    var poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", line);
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", color);
    poly.setAttribute("stroke-width", "1.4");
    poly.setAttribute("stroke-linejoin", "round");
    poly.setAttribute("stroke-linecap", "round");
    svg.appendChild(poly);
    pts.forEach(function (p) {
      var c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", p[0]); c.setAttribute("cy", p[1]); c.setAttribute("r", "1.1");
      c.setAttribute("fill", color);
      svg.appendChild(c);
    });
    container.appendChild(svg);
    var axis = el("div", { style: "display:flex;justify-content:space-between;font-size:.72rem;color:#5c6678;margin-top:0.35rem" });
    var mid = Math.floor(n / 2);
    [0, mid, n - 1].forEach(function (i) {
      if (i < 0) return;
      axis.appendChild(el("span", {}, esc(labels[i] != null ? labels[i] : "")));
    });
    container.appendChild(axis);
  }

  window.PCMAdmin.el = el;
  window.PCMAdmin.Modal = Modal;
  window.PCMAdmin.FormBuilder = FormBuilder;
  window.PCMAdmin.DataTable = DataTable;
  window.PCMAdmin.charts = { bar: barChart, donut: donut, line: lineChart };
})();
