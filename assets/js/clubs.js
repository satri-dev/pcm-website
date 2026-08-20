/* ============================================================
   PCM website — assets/js/clubs.js
   Reads the clubs data saved by the admin panel (pcm-admin-data-v1)
   and renders the club cards + members live.
   If the admin has no saved data, the hardcoded grid stays as is.
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ALLOWED = /^(p|div|br|b|strong|i|em|u|s|ul|ol|li|blockquote|h[2-4]|a|span)$/i;

  function richText(s) {
    s = String(s == null ? "" : s);
    if (s.indexOf("<") === -1) return esc(s).replace(/\n/g, "<br>");
    var d = document.createElement("div");
    d.innerHTML = s;
    function clean(node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (child) {
        if (child.nodeType === 3) return;
        if (child.nodeType !== 1) { child.parentNode.removeChild(child); return; }
        if (!ALLOWED.test(child.tagName)) {
          while (child.firstChild) child.parentNode.insertBefore(child.firstChild, child);
          child.parentNode.removeChild(child);
          return;
        }
        if (child.tagName.toLowerCase() === "a") {
          var href = child.getAttribute("href");
          if (!href || !/^(https?:|mailto:|tel:)/i.test(href)) {
            while (child.firstChild) child.parentNode.insertBefore(child.firstChild, child);
            child.parentNode.removeChild(child);
            return;
          }
          child.setAttribute("target", "_blank");
          child.setAttribute("rel", "noopener");
        } else {
          Array.prototype.slice.call(child.attributes).forEach(function (a) {
            if (a.name !== "href") child.removeAttribute(a.name);
          });
        }
        clean(child);
      });
    }
    clean(d);
    return d.innerHTML;
  }

  function initials(name) {
    return String(name || "?").split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ""; }).join("").toUpperCase();
  }

  function memberHtml(m) {
    var photo = m && m.photo
      ? '<img class="club-member__photo" src="' + esc(m.photo) + '" alt="' + esc(m.name || "") + '" loading="lazy">'
      : '<span class="club-member__photo club-member__photo--ph">' + esc(initials(m && m.name)) + "</span>";
    return '<div class="club-member">' + photo +
      '<div class="club-member__info"><b>' + esc(m && m.name ? m.name : "—") + "</b>" +
      (m && m.position ? '<span class="club-member__role">' + esc(m.position) + "</span>" : "") +
      (m && m.program ? '<small class="club-member__prog">' + esc(m.program) + "</small>" : "") +
      "</div></div>";
  }

  function clubHtml(c, delay) {
    var members = Array.isArray(c.members) ? c.members : [];
    var list = members.map(function (m) { return memberHtml(m); }).join("");
    return '<article class="club-card reveal" style="transition-delay:' + (delay || 0) + 'ms">' +
      '<div class="club-card__head"><span class="club-card__icon">' + esc(c.icon || "🎓") + "</span><div>" +
      "<h3>" + esc(c.name || "") + "</h3><p>" + richText(c.desc) + "</p></div></div>" +
      '<div class="club-card__members">' + list + "</div>" +
      "</article>";
  }

  function apply() {
    var raw = null;
    try { raw = localStorage.getItem("pcm-admin-data-v1"); } catch (e) {}
    if (!raw) return;

    var parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) { return; }
    var clubs = parsed && parsed.data && parsed.data.clubs;
    if (!Array.isArray(clubs) || !clubs.length) return;

    var card = document.querySelector(".club-card");
    var grid = card ? card.closest(".grid") : null;
    if (!grid) return;

    grid.innerHTML = clubs.map(function (c, i) { return clubHtml(c, i * 50); }).join("");
  }

  /* ---------- Club detail modal ---------- */
  function initClubModal() {
    var modal = null;

    function ensure() {
      if (modal) return modal;
      modal = document.createElement("div");
      modal.className = "card-modal club-modal";
      modal.id = "clubModal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Club details");
      modal.innerHTML =
        '<div class="card-modal__scrim" data-club-close></div>' +
        '<div class="card-modal__panel">' +
          '<button class="card-modal__close" data-club-close aria-label="Close">&times;</button>' +
          '<div class="card-modal__body">' +
            '<div class="club-modal__head">' +
              '<span class="club-card__icon"></span>' +
              '<h3 class="card-modal__title"></h3>' +
            "</div>" +
            '<p class="card-modal__desc"></p>' +
            '<h4 class="club-modal__members-title">Members</h4>' +
            '<div class="club-modal__members"></div>' +
          "</div>" +
        "</div>";
      document.body.appendChild(modal);

      function close() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target === modal.querySelector(".card-modal__scrim") || e.target.closest("[data-club-close]")) close();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("is-open")) close();
      });
      return modal;
    }

    function open(card) {
      ensure();
      var icon = modal.querySelector(".club-modal__head .club-card__icon");
      var title = modal.querySelector(".card-modal__title");
      var desc = modal.querySelector(".card-modal__desc");
      var membersTitle = modal.querySelector(".club-modal__members-title");
      var list = modal.querySelector(".club-modal__members");

      var iconEl = card.querySelector(".club-card__icon");
      if (icon) icon.innerHTML = iconEl ? iconEl.innerHTML : "";

      var h3 = card.querySelector(".club-card__head h3");
      if (title) title.textContent = h3 ? h3.textContent.trim() : "";

      var p = card.querySelector(".club-card__head p");
      if (desc) desc.innerHTML = p ? p.innerHTML : "";

      var members = card.querySelectorAll(".club-member");
      if (list) {
        list.innerHTML = "";
        if (!members.length) {
          list.innerHTML = '<p class="club-modal__empty">Member details coming soon.</p>';
        } else {
          members.forEach(function (m) { list.appendChild(m.cloneNode(true)); });
        }
      }
      if (membersTitle) membersTitle.textContent = "Members" + (members.length ? " (" + members.length + ")" : "");

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    document.addEventListener("click", function (e) {
      var target = e.target;
      if (!target || target.nodeType !== 1) return;
      if (target.closest(".card-modal, .club-modal, .lightbox, #lightbox, .pdf-modal")) return;
      var card = target.closest(".club-card");
      if (!card) return;
      e.preventDefault();
      open(card);
    });
  }

  function boot() {
    apply();
    initClubModal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
