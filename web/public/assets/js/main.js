/* ============================================================
   PCMC — assets/js/main.js
   Vanilla JS: drawer, accordion, dropdowns, reveal, gallery,
   lightbox, tabs, counters, forms, carousel, news-details.
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var doc = document;
  var $ = function (sel, ctx) {
    return (ctx || doc).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  };

  /* ---------- Theme bootstrap (before paint to avoid flash) ---------- */
  /* Light is the default; only an explicit "dark" stored preference (set via
     the theme toggle) switches the site to dark mode. */
  (function applyStoredTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem("pcm-theme");
    } catch (e) {}
    var dark = stored ? stored === "dark" : false;
    doc.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    var mt = $('meta[name="theme-color"]');
    if (mt) mt.setAttribute("content", dark ? "#0e1424" : "#21409A");
  })();

  /* ---------- Header scroll state ---------- */
  function initHeader() {
    var header = $(".header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Drawer ---------- */
  function initDrawer() {
    var burger = $(".burger");
    var drawer = $(".drawer");
    if (!burger || !drawer) return;

    var scrim = $(".drawer__scrim", drawer);
    var close = $(".drawer__close", drawer);
    var body = document.body;

    function open() {
      drawer.setAttribute("data-open", "");
      burger.setAttribute("aria-expanded", "true");
      body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.removeAttribute("data-open");
      burger.setAttribute("aria-expanded", "false");
      body.style.overflow = "";
    }

    burger.addEventListener("click", open);
    if (close) close.addEventListener("click", closeDrawer);
    if (scrim) scrim.addEventListener("click", closeDrawer);

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });

    // Close drawer when a nav link inside it is clicked
    $$(".drawer__nav a, .m-acc__btn", drawer).forEach(function (a) {
      a.addEventListener("click", function () {
        if (!a.classList.contains("m-acc__btn")) closeDrawer();
      });
    });
  }

  /* ---------- Mobile accordion ---------- */
  function initAccordion() {
    $$(".m-acc__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
      });
    });
  }

  /* ---------- Desktop dropdown (click + focus for touch) ---------- */
  function initDropdowns() {
    $$(".has-drop").forEach(function (drop) {
      var nav = $(".drop", drop);
      if (!nav) return;

      drop.addEventListener("click", function (e) {
        if (window.innerWidth > 1024 && !e.target.closest(".drop")) {
          e.preventDefault();
          if (nav.hasAttribute("data-open")) {
            nav.removeAttribute("data-open");
          } else {
            $$(".drop").forEach(function (d) {
              d.removeAttribute("data-open");
            });
            nav.setAttribute("data-open", "");
          }
        }
      });

      drop.addEventListener("mouseleave", function () {
        nav.removeAttribute("data-open");
      });
    });

    $$(".util-drop").forEach(function (drop) {
      var menu = $(".util-drop__menu", drop);
      if (!menu) return;

      drop.addEventListener("click", function (e) {
        if (window.innerWidth > 1024 && !e.target.closest(".util-drop__menu")) {
          e.preventDefault();
          if (menu.hasAttribute("data-open")) {
            menu.removeAttribute("data-open");
          } else {
            $$(".util-drop__menu").forEach(function (m) {
              m.removeAttribute("data-open");
            });
            menu.setAttribute("data-open", "");
          }
        }
      });

      drop.addEventListener("mouseleave", function () {
        menu.removeAttribute("data-open");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = $$(".reveal");
    if (!items.length || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-inview");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Gallery filters ---------- */
  function initFilters() {
    var buttons = $$(".filter-btn");
    if (!buttons.length) return;
    var cards = $$(".gal-card");
    var items = $$(".g-item");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("is-active", "active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active", "active");
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-filter") || "all";
        cards.forEach(function (card) {
          var cats = (card.getAttribute("data-cat") || "all").split(" ");
          var show = filter === "all" || cats.indexOf(filter) !== -1;
          card.classList.toggle("is-hidden", !show);
        });
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-cat") || "all").split(" ");
          var show = filter === "all" || cats.indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
        doc.dispatchEvent(new CustomEvent("pcm:filter"));
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var lb = $("#lightbox");
    if (!lb) return;

    var scrim = $(".lightbox__scrim", lb);
    var closeBtn = $(".lightbox__close", lb);
    var prevBtn = $(".lightbox__arrow.prev", lb);
    var nextBtn = $(".lightbox__arrow.next", lb);
    var media = $(".lightbox__media", lb);
    var lbTag = $("#lb-tag", lb);
    var lbTitle = $("#lb-title", lb);
    var lbDesc = $("#lb-desc", lb);
    var lbCat = $("#lb-cat", lb);
    var lbDate = $("#lb-date", lb);

    var allItems = $$(".g-item[data-title]");
    var items = allItems;
    var index = 0;
    var body = document.body;

    function render(i) {
      index = (i + items.length) % items.length;
      var el = items[index];
      var title = el.getAttribute("data-title") || "";
      var desc = el.getAttribute("data-desc") || "";
      var cat = el.getAttribute("data-cat") || "";
      var date = el.getAttribute("data-date") || "";
      var tag = el.getAttribute("data-tag") || cat;

      var visual = $(".g-item__visual", el);
      var inner = "";
      if (visual) {
        inner = visual.tagName === "IMG"
          ? '<img src="' + (visual.getAttribute("src") || "") + '" alt="' + (visual.getAttribute("alt") || "") + '">'
          : visual.innerHTML;
      }

      if (media) media.innerHTML = inner;
      if (lbTitle) lbTitle.textContent = title;
      if (lbDesc) lbDesc.textContent = desc;
      if (lbCat) lbCat.textContent = cat;
      if (lbDate) lbDate.textContent = date;
      if (lbTag) lbTag.textContent = tag;
    }

    function open(i) {
      render(i);
      lb.setAttribute("data-open", "");
      body.style.overflow = "hidden";
    }

    function close() {
      lb.removeAttribute("data-open");
      body.style.overflow = "";
    }

    items.forEach(function (el, i) {
      if (el.tagName === "A") return; // plain links navigate to gallery page
      el.addEventListener("click", function (e) {
        e.preventDefault();
        open(i);
      });
    });

    $$("[data-open-album]").forEach(function (card) {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        var key = card.getAttribute("data-open-album");
        var scoped = allItems.filter(function (it) {
          return it.getAttribute("data-album-key") === key;
        });
        items = scoped.length ? scoped : allItems;
        open(0);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (scrim) scrim.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function (e) { e.stopPropagation(); render(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function (e) { e.stopPropagation(); render(index + 1); });

    doc.addEventListener("keydown", function (e) {
      if (!lb.hasAttribute("data-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") render(index - 1);
      if (e.key === "ArrowRight") render(index + 1);
    });
  }

  /* ---------- PDF preview modal ---------- */
  function initPdfPreview() {
    var links = $$("a[data-pdf-preview]");
    if (!links.length) return;

    var modal = $("#pdfModal");
    if (!modal) {
      modal = doc.createElement("div");
      modal.className = "pdf-modal";
      modal.id = "pdfModal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.innerHTML =
        '<div class="pdf-modal__scrim" data-pdf-close></div>' +
        '<div class="pdf-modal__panel">' +
          '<div class="pdf-modal__head">' +
            '<b class="pdf-modal__title"></b>' +
            '<div class="pdf-modal__actions">' +
              '<a class="btn btn-ghost pdf-modal__open" href="#" target="_blank" rel="noopener">Open PDF <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/></svg></a>' +
              '<button class="pdf-modal__close" data-pdf-close aria-label="Close preview">&times;</button>' +
            '</div>' +
          '</div>' +
          '<iframe class="pdf-modal__frame" title="PDF preview"></iframe>' +
        '</div>';
      doc.body.appendChild(modal);
    }

    var frame = $(".pdf-modal__frame", modal);
    var openBtn = $(".pdf-modal__open", modal);
    var titleEl = $(".pdf-modal__title", modal);
    var body = document.body;

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      if (frame) frame.removeAttribute("src");
      body.style.overflow = "";
    }

    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (titleEl) titleEl.textContent = (a.getAttribute("data-title") || a.textContent || "PDF Preview").trim();
        if (openBtn) openBtn.href = a.href;
        if (frame) frame.src = a.href;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        body.style.overflow = "hidden";
      });
    });

    $$("[data-pdf-close]", modal).forEach(function (b) {
      b.addEventListener("click", close);
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ---------- Card / photo modal (system-wide) ---------- */
  function initCardModal() {
    var modal = doc.getElementById("cardModal");
    if (!modal) {
      modal = doc.createElement("div");
      modal.className = "card-modal";
      modal.id = "cardModal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Photo and card viewer");
      modal.innerHTML =
        '<div class="card-modal__scrim" data-card-close></div>' +
        '<div class="card-modal__panel">' +
          '<button class="card-modal__close" data-card-close aria-label="Close viewer">&times;</button>' +
          '<div class="card-modal__media"></div>' +
          '<div class="card-modal__body">' +
            '<h3 class="card-modal__title"></h3>' +
            '<span class="card-modal__role"></span>' +
            '<small class="card-modal__prog"></small>' +
            '<p class="card-modal__desc"></p>' +
          "</div>" +
        "</div>";
      doc.body.appendChild(modal);
    }

    var media = $(".card-modal__media", modal);
    var title = $(".card-modal__title", modal);
    var role = $(".card-modal__role", modal);
    var prog = $(".card-modal__prog", modal);
    var desc = $(".card-modal__desc", modal);
    var body = document.body;

    function open(data) {
      if (media) {
        media.innerHTML = data.media || "";
        if (!data.media) media.style.display = "none";
        else media.style.display = "";
      }
      if (title) title.textContent = data.title || "";
      if (role) role.textContent = data.role || "";
      if (prog) {
        prog.textContent = data.prog || "";
        prog.style.display = data.prog ? "" : "none";
      }
      if (desc) desc.textContent = data.desc || "";
      if (title) title.style.display = data.title ? "" : "none";
      if (role) role.style.display = data.role ? "" : "none";
      if (desc) desc.style.display = data.desc ? "" : "none";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
    }

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
    }

    $$("[data-card-close]", modal).forEach(function (b) {
      b.addEventListener("click", close);
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target === $(".card-modal__scrim", modal)) close();
    });

    function photoHtml(img) {
      return '<img src="' + (img.getAttribute("src") || "") + '" alt="' + (img.getAttribute("alt") || "") + '">';
    }

    function cardData(card) {
      var img = $("img", card) || $("svg", card);
      var h3 = $("h3", card);
      var data = {
        media: img
          ? img.tagName === "IMG" ? photoHtml(img) : '<div style="display:grid;place-items:center">' + img.outerHTML + "</div>"
          : "",
        title: h3 ? h3.textContent.trim() : "",
        role: "",
        prog: "",
        desc: ""
      };
      if (card.classList.contains("fac-card")) {
        var roleEl = $(".fac-card h3 + span", card);
        if (roleEl) data.role = roleEl.textContent.trim();
      } else if (card.classList.contains("alumni-card")) {
        var r2 = $(".alumni-card__role", card);
        var p2 = $(".alumni-card__prog", card);
        if (r2) data.role = r2.textContent.trim();
        if (p2) data.prog = p2.textContent.trim();
      } else if (card.classList.contains("bod-card")) {
        var r3 = $(".bod-card__role", card);
        if (r3) data.role = r3.textContent.trim();
      }
      return data;
    }

    doc.addEventListener("click", function (e) {
      var target = e.target;
      if (!target || target.nodeType !== 1) return;
      if (target.closest(".card-modal, .lightbox, #lightbox, .pdf-modal")) return;
      if (target.closest("a")) return;

      var card = target.closest(".fac-card, .alumni-card, .bod-card");
      if (card) {
        e.preventDefault();
        open(cardData(card));
        return;
      }

      var img = target.closest("img");
      if (!img) return;
      if (img.closest(".g-item, .hero, .hero-carousel, .page-hero, .brand, .ticker, .utility, .drawer, .lightbox__media, .club-card")) return;
      var rect = img.getBoundingClientRect();
      if (rect.width < 48 || rect.height < 48) return;
      e.preventDefault();
      open({
        media: photoHtml(img),
        title: (img.getAttribute("alt") || "").trim(),
        role: "",
        prog: "",
        desc: ""
      });
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    $$(".tabs").forEach(function (tabs) {
      var buttons = $$(".tabs__btn", tabs);
      var panels = $$(".tabs__panel", tabs);
      if (!buttons.length || !panels.length) return;

      buttons.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) {
            b.setAttribute("aria-selected", "false");
          });
          panels.forEach(function (p) {
            p.classList.remove("active");
          });
          btn.setAttribute("aria-selected", "true");
          if (panels[i]) panels[i].classList.add("active");
        });
      });
    });
  }

  /* ---------- Stats counters ---------- */
  function initCounters() {
    var els = $$(".stat b[data-count], [data-count]");
    if (!els.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count") || "0");
      var suffix = el.getAttribute("data-suffix") || "";
      var prefix = el.getAttribute("data-prefix") || "";
      var decimals = String(target).split(".")[1] ? String(target).split(".")[1].length : 0;
      var dur = 1600;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              run(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      els.forEach(function (el) {
        io.observe(el);
      });
    } else {
      els.forEach(run);
    }
  }

  /* ---------- Demo forms ---------- */
  function initForms() {
    $$("form").forEach(function (form) {
      if (form.hasAttribute("data-newsletter")) return;
      if (form.hasAttribute("data-admission")) return;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var success = $(".form-success", form);
        if (success) {
          success.classList.add("is-visible");
          var kids = Array.prototype.slice.call(form.children);
          kids.forEach(function (kid) {
            if (kid !== success) kid.style.display = "none";
          });
        } else {
          var inline = $(".form-note", form);
          if (inline) {
            inline.textContent = "Thank you — your message has been received. We'll respond within 2 working days.";
          }
        }
        if (form.reset) form.reset();
      });
    });
  }

  /* ---------- Footer newsletter ---------- */
  function initNewsletter() {
    $$("form[data-newsletter]").forEach(function (form) {
      var input = $("input[type=email]", form);
      var msg = $(".newsletter-msg", form.closest(".newsletter"));
      if (!input || !msg) return;

      function show(text, ok) {
        msg.textContent = text;
        msg.classList.remove("ok", "err");
        msg.classList.add(ok ? "ok" : "err");
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = (input.value || "").trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          show("Please enter a valid email address.", false);
          input.focus();
          return;
        }
        try {
          var list = JSON.parse(localStorage.getItem("pcm-newsletter-v1") || "[]");
          if (list.indexOf(email) === -1) list.push(email);
          localStorage.setItem("pcm-newsletter-v1", JSON.stringify(list));
        } catch (err) {}
        show("Subscribed! Please check your inbox to confirm.", true);
        form.reset();
      });
    });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    var btn = $("#toTop");
    if (!btn) return;
    var onScroll = function () {
      btn.style.opacity = window.scrollY > 400 ? "1" : "0";
      btn.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Ticker / marquee duplication (seamless loop) ---------- */
  function initTicker() {
    $$(".ticker__inner").forEach(function (track) {
      if (!track.dataset.looped) {
        track.innerHTML += track.innerHTML;
        track.dataset.looped = "1";
      }
    });
  }

  function initMarquee() {
    $$(".marquee__track").forEach(function (track) {
      if (!track.dataset.looped) {
        track.innerHTML += track.innerHTML;
        track.dataset.looped = "1";
      }
    });
  }

  /* ---------- Testimonial carousel ---------- */
  function initCarousel() {
    $$("[data-carousel]").forEach(function (carousel) {
      var track = $(".tst__track", carousel);
      if (!track) return;
      var slides = $$(".tst__slide", track);
      if (!slides.length) return;

      var prev = $(".tst__btn.prev", carousel);
      var next = $(".tst__btn.next", carousel);
      var dotsWrap = $(".tst__dots", carousel);
      var index = 0;

      var dots = [];
      if (dotsWrap) {
        slides.forEach(function (_, i) {
          var d = doc.createElement("button");
          d.type = "button";
          d.setAttribute("aria-label", "Go to slide " + (i + 1));
          d.addEventListener("click", function () { go(i); });
          dotsWrap.appendChild(d);
          dots.push(d);
        });
      }

      function go(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dots.forEach(function (d, di) {
          d.classList.toggle("is-active", di === index);
        });
      }

      if (prev) prev.addEventListener("click", function () { go(index - 1); });
      if (next) next.addEventListener("click", function () { go(index + 1); });

      go(0);

      var autoplay = carousel.getAttribute("data-carousel") === "auto";
      if (autoplay) {
        setInterval(function () { go(index + 1); }, 6000);
      }
    });
  }

  /* ---------- GPA Converter ---------- */
  function initGpa() {
    var tool = $("#gpa-rows");
    if (!tool) return;

    var gradeMap = {
      A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
      "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0.0
    };

    var scoreEl = $("#gpa-score");
    var labelEl = $("#gpa-label");
    var creditsEl = $("#gpa-credits");
    var pointsEl = $("#gpa-points");

    function gradeOptions() {
      var out = "";
      Object.keys(gradeMap).forEach(function (g) {
        out += '<option value="' + gradeMap[g] + '">' + g + " (" + gradeMap[g].toFixed(1) + ")</option>";
      });
      return out;
    }

    function makeRow() {
      var row = doc.createElement("div");
      row.className = "gpa-row";
      row.innerHTML =
        '<input class="gpa-input gpa-code" type="text" placeholder="e.g. MGT 201">' +
        '<input class="gpa-input gpa-name" type="text" placeholder="Course name">' +
        '<input class="gpa-input gpa-num gpa-credit" type="number" min="1" max="4" step="0.5" placeholder="3" value="3">' +
        '<select class="gpa-input gpa-grade">' + gradeOptions() + "</select>";
      return row;
    }

    function recalc() {
      var totalCredits = 0;
      var totalPoints = 0;
      $$(".gpa-row", tool).forEach(function (row) {
        var credit = parseFloat($(".gpa-credit", row).value);
        var point = parseFloat($(".gpa-grade", row).value);
        if (isNaN(credit)) credit = 0;
        if (isNaN(point)) point = 0;
        totalCredits += credit;
        totalPoints += credit * point;
      });
      var gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
      if (scoreEl) scoreEl.textContent = gpa.toFixed(2);
      if (labelEl) {
        labelEl.textContent = gpa >= 3.6 ? "Outstanding"
          : gpa >= 3.2 ? "Excellent"
          : gpa >= 2.8 ? "Very Good"
          : gpa >= 2.4 ? "Good"
          : gpa >= 2.0 ? "Satisfactory"
          : gpa > 0 ? "Needs Improvement" : "N/A";
      }
      if (creditsEl) creditsEl.textContent = String(totalCredits);
      if (pointsEl) pointsEl.textContent = totalPoints.toFixed(1);
    }

    function wire(row) {
      $$(".gpa-input", row).forEach(function (input) {
        input.addEventListener("input", recalc);
        input.addEventListener("change", recalc);
      });
    }

    $$(".gpa-row", tool).forEach(wire);

    var add = $("#gpa-add");
    if (add) {
      add.addEventListener("click", function () {
        var row = makeRow();
        tool.appendChild(row);
        wire(row);
        recalc();
      });
    }

    var clear = $("#gpa-clear");
    if (clear) {
      clear.addEventListener("click", function () {
        tool.innerHTML = "";
        var row = makeRow();
        tool.appendChild(row);
        wire(row);
        recalc();
      });
    }

    var program = $("#gpa-program");
    if (program) {
      var match = (window.location.search || "").match(/[?&]program=([^&]+)/);
      if (match) {
        var val = match[1];
        if (Array.prototype.some.call(program.options, function (o) { return o.value === val; })) {
          program.value = val;
        }
      }
      program.addEventListener("change", recalc);
    }

    recalc();
  }

  /* ---------- Hero carousel ---------- */
  function initHeroCarousel() {
    var carousel = $("[data-hero-carousel]");
    if (!carousel) return;

    var track = $(".hero-carousel__track", carousel);
    if (!track) return;
    var slides = $$(".hero-carousel__slide", track);
    if (!slides.length) return;

    var prev = $(".hero-carousel__btn--prev", carousel);
    var next = $(".hero-carousel__btn--next", carousel);
    var dotsWrap = $(".hero-carousel__dots", carousel);
    var index = 0;
    var timer = null;

    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var d = doc.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", "Go to slide " + (i + 1));
        d.addEventListener("click", function () { go(i); restart(); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) {
        d.classList.toggle("is-active", di === index);
      });
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function () { go(index + 1); }, 6000);
    }

    if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(index + 1); restart(); });

    carousel.addEventListener("mouseenter", function () {
      if (timer) window.clearInterval(timer);
    });
    carousel.addEventListener("mouseleave", restart);

    go(0);
    restart();
  }

  /* ---------- Pagination ---------- */
  function initPagination() {
    var scopes = $$("[data-paginate]");
    if (!scopes.length) return;

    var PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
    var NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

    scopes.forEach(function (scope) {
      var items = $$(":scope > *", scope).filter(function (el) {
        return el.nodeType === 1;
      });
      if (!items.length) return;

      var per = parseInt(scope.getAttribute("data-per") || "3", 10) || 3;
      var key = scope.getAttribute("data-page-key") || "page";

      var nav = scope.nextElementSibling;
      while (nav && !nav.hasAttribute("data-pagination")) nav = nav.nextElementSibling;
      if (!nav) return;

      var info = $(".pagination__info", nav);
      var list = $(".pagination__list", nav);
      if (!list) return;

      var current = 1;

      function visible() {
        return items.filter(function (it) {
          return !it.classList.contains("is-hidden");
        });
      }

      function totalPages() {
        return Math.max(1, Math.ceil(visible().length / per));
      }

      function readPage() {
        var params = new URLSearchParams(location.search);
        var p = parseInt(params.get(key) || "1", 10);
        if (isNaN(p) || p < 1) return 1;
        return p;
      }

      function renderNav() {
        var total = totalPages();
        list.innerHTML = "";

        var prev = doc.createElement("button");
        prev.type = "button";
        prev.className = "pagination__btn";
        prev.innerHTML = PREV + '<span class="pagination__label">Prev</span>';
        prev.setAttribute("aria-label", "Previous page");
        if (current <= 1) prev.setAttribute("aria-disabled", "true");
        prev.addEventListener("click", function () { go(current - 1, true); });
        list.appendChild(prev);

        for (var p = 1; p <= total; p++) {
          (function (p) {
            var b = doc.createElement("button");
            b.type = "button";
            b.className = "pagination__num";
            b.textContent = p;
            b.setAttribute("aria-label", "Page " + p);
            if (p === current) {
              b.classList.add("is-current");
              b.setAttribute("aria-current", "page");
            }
            b.addEventListener("click", function () { go(p, true); });
            list.appendChild(b);
          })(p);
        }

        var next = doc.createElement("button");
        next.type = "button";
        next.className = "pagination__btn";
        next.innerHTML = '<span class="pagination__label">Next</span>' + NEXT;
        next.setAttribute("aria-label", "Next page");
        if (current >= total) next.setAttribute("aria-disabled", "true");
        next.addEventListener("click", function () { go(current + 1, true); });
        list.appendChild(next);

        if (info) info.textContent = "Page " + current + " of " + total;
      }

      function apply(p, scroll) {
        var total = totalPages();
        current = Math.min(Math.max(1, p), total);

        var start = (current - 1) * per;
        var end = start + per;
        var vis = visible();
        items.forEach(function (it) {
          var i = vis.indexOf(it);
          var on = i !== -1 && i >= start && i < end;
          it.classList.toggle("is-paged", !on);
          if (on) it.classList.add("is-inview");
        });

        renderNav();

        var params = new URLSearchParams(location.search);
        if (current === 1) params.delete(key);
        else params.set(key, String(current));
        var qs = params.toString();
        history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);

        if (scroll) {
          var top = scope.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      }

      function go(p, scroll) {
        apply(p, scroll);
      }

      doc.addEventListener("pcm:filter", function () {
        apply(1, false);
      });

      apply(readPage(), false);
    });
  }

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    var toggles = $$(".theme-toggle");
    if (!toggles.length) return;
    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var next =
          doc.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        doc.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem("pcm-theme", next);
        } catch (e) {}
        var mt = $('meta[name="theme-color"]');
        if (mt)
          mt.setAttribute("content", next === "dark" ? "#0e1424" : "#21409A");
        toggles.forEach(function (t) {
          t.setAttribute(
            "aria-label",
            next === "dark" ? "Switch to light mode" : "Switch to dark mode"
          );
        });
      });
    });
  }

  /* ---------- Global site search ---------- */
  function initSearch() {
    var overlay = $("#searchOverlay");
    if (!overlay) return;
    var openBtns = $$("[data-search-open]");
    var closeBtn = $(".search-overlay__close", overlay);
    var input = $(".search-overlay__input", overlay);
    var meta = $(".search-overlay__meta", overlay);
    var body = $(".search-overlay__body", overlay);
    var index = window.PCM_SEARCH || [];
    var activeIndex = -1;
    var results = [];

    function open() {
      overlay.setAttribute("data-open", "");
      openBtns.forEach(function (b) {
        if (b) b.setAttribute("aria-expanded", "true");
      });
      document.body.style.overflow = "hidden";
      setTimeout(function () {
        if (input) input.focus();
      }, 60);
    }

    function close() {
      overlay.removeAttribute("data-open");
      openBtns.forEach(function (b) {
        if (b) b.setAttribute("aria-expanded", "false");
      });
      document.body.style.overflow = "";
      activeIndex = -1;
    }

    function setActive(els) {
      els.forEach(function (el, i) {
        el.classList.toggle("is-active", i === activeIndex);
      });
      var cur = els[activeIndex];
      if (cur) cur.scrollIntoView({ block: "nearest" });
    }

    function render(query) {
      query = (query || "").trim().toLowerCase();
      if (!body) return;
      body.innerHTML = "";
      results = [];
      if (!query) {
        if (meta) meta.textContent = "Type to search across the site";
        return;
      }
      index.forEach(function (item) {
        var hay = (
          item.t + " " + item.s + " " + (item.k || "") + " " + (item.x || "")
        ).toLowerCase();
        if (hay.indexOf(query) !== -1) results.push(item);
      });
      if (meta) {
        meta.textContent =
          results.length +
          " result" +
          (results.length === 1 ? "" : "s") +
          " for \u201C" +
          query +
          "\u201D";
      }
      if (!results.length) {
        body.innerHTML =
          '<div class="search-overlay__empty"><b>No results found</b>Try a different keyword \u2014 e.g. "BBA", "scholarship" or "gallery".</div>';
        return;
      }
      var groups = {};
      results.forEach(function (r) {
        (groups[r.s] = groups[r.s] || []).push(r);
      });
      Object.keys(groups).forEach(function (section) {
        var g = doc.createElement("div");
        g.className = "search-result__group";
        g.textContent = section;
        body.appendChild(g);
        groups[section].forEach(function (r) {
          var a = doc.createElement("a");
          a.className = "search-result";
          a.href = r.u;
          a.innerHTML =
            '<span class="search-result__title"></span>' +
            '<span class="search-result__url"></span>' +
            '<span class="search-result__excerpt"></span>';
          a.querySelector(".search-result__title").textContent = r.t;
          a.querySelector(".search-result__url").textContent = r.u;
          if (r.x)
            a.querySelector(".search-result__excerpt").textContent = r.x;
          body.appendChild(a);
        });
      });
    }

    openBtns.forEach(function (b) {
      if (!b) return;
      b.addEventListener("click", function (e) {
        if (e) e.preventDefault();
        open();
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay)
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
      });
    if (input)
      input.addEventListener("input", function () {
        activeIndex = -1;
        render(input.value);
      });

    doc.addEventListener("keydown", function (e) {
      if (!overlay.hasAttribute("data-open")) return;
      if (e.key === "Escape") {
        close();
        return;
      }
      var els = $$(".search-result", body);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, els.length - 1);
        setActive(els);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        setActive(els);
      } else if (e.key === "Enter") {
        var cur = els[activeIndex];
        if (cur) window.location = cur.href;
      }
    });

    doc.addEventListener("keydown", function (e) {
      if (overlay.hasAttribute("data-open")) return;
      if (
        e.key === "/" &&
        !/input|textarea|select/i.test((e.target || {}).tagName || "")
      ) {
        e.preventDefault();
        open();
      }
    });
  }

  /* ---------- Page-level search + filter (news / blogs / notices / results) ---------- */
  function initPageFilters() {
    $$("[data-filter-scope]").forEach(function (scope) {
      var input = $("[data-filter-input]", scope);
      var selects = $$("[data-filter-select]", scope);
      var items = $$("[data-filter-item]", scope);
      var count = $("[data-filter-count]", scope);
      if (!items.length) return;

      function apply() {
        var q = (input ? input.value : "").trim().toLowerCase();
        var shown = 0;
        items.forEach(function (item) {
          var text = (
            (item.getAttribute("data-search") || item.textContent) +
            " " +
            (item.getAttribute("data-cat") || "")
          ).toLowerCase();
          var matchQ = !q || text.indexOf(q) !== -1;
          var matchF = true;
          selects.forEach(function (sel) {
            var f = sel.value;
            if (!f || f === "all") return;
            if ((item.getAttribute("data-cat") || "").indexOf(f) === -1)
              matchF = false;
          });
          var show = matchQ && matchF;
          item.classList.toggle("is-hidden", !show);
          if (show) shown++;
        });
        if (count) count.textContent = shown + " of " + items.length + " shown";
        doc.dispatchEvent(new CustomEvent("pcm:filter"));
      }

      if (input) input.addEventListener("input", apply);
      selects.forEach(function (sel) {
        sel.addEventListener("change", apply);
      });
      apply();
    });
  }

  /* ---------- Achievers spotlight picker ---------- */
  function initAchievers() {
    var spot = $("[data-achv-spot]");
    if (!spot) return;
    var photo = $("[data-achv-photo]", spot);
    var quote = $("[data-achv-quote]", spot);
    var name = $("[data-achv-name]", spot);
    var role = $("[data-achv-role]", spot);
    var items = $$("[data-achv-item]");

    function render(i) {
      items.forEach(function (el, idx) {
        el.classList.toggle("is-active", idx === i);
      });
      var el = items[i];
      if (!el) return;
      var ph = el.getAttribute("data-photo");
      if (photo && ph) {
        photo.setAttribute("src", ph);
        photo.setAttribute("alt", "Photo of " + (el.getAttribute("data-name") || ""));
      }
      if (quote) quote.textContent = el.getAttribute("data-quote") || "";
      if (name) name.textContent = el.getAttribute("data-name") || "";
      if (role) role.textContent = el.getAttribute("data-role") || "";
    }

    items.forEach(function (el, i) {
      el.addEventListener("click", function () {
        render(i);
      });
    });

    render(0);
  }

  /* ---------- NP-EN transliteration converter ---------- */
  function initNpEn() {
    var npIn = $("#npen-np");
    var enOut = $("#npen-en");
    var enIn = $("#npen-en2");
    var npOut = $("#npen-np2");
    if (!npIn || !enOut || !enIn || !npOut) return;
    if (!window.Sanscript) return;

    function toLatin() {
      var txt = npIn.value;
      enOut.value = txt.trim() === ""
        ? ""
        : window.Sanscript.t(txt, "devanagari", "itrans_lowercase");
    }

    function toDevanagari() {
      var txt = enIn.value;
      npOut.value = txt.trim() === ""
        ? ""
        : window.Sanscript.t(txt, "itrans_lowercase", "devanagari");
    }

    npIn.addEventListener("input", toLatin);
    enIn.addEventListener("input", toDevanagari);
    npIn.addEventListener("change", toLatin);
    enIn.addEventListener("change", toDevanagari);

    var copied = false;
    $$("[data-npen-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-npen-copy");
        var area = $("#" + id);
        if (!area) return;
        area.select();
        try { doc.execCommand("copy"); } catch (e) {}
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(area.value).catch(function () {});
        }
        if (!copied) {
          copied = true;
          var old = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = old; copied = false; }, 1400);
        }
      });
    });

    $$("[data-npen-clear]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-npen-clear");
        var area = $("#" + id);
        if (!area) return;
        area.value = "";
        if (id === "npen-np") toLatin();
        if (id === "npen-en2") toDevanagari();
      });
    });

    toLatin();
    toDevanagari();
  }

  /* ---------- Hero height: fills viewport below header block ---------- */
  function initHeroHeight() {
    var hero = $("[data-hero-carousel]");
    if (!hero) return;

    function setVar() {
      var total = 0;
      ["ticker", "utility", "header"].forEach(function (cls) {
        var el = $("." + cls);
        if (el) total += el.getBoundingClientRect().height;
      });
      doc.documentElement.style.setProperty("--header-total", total + "px");
    }

    setVar();
    window.addEventListener("resize", setVar);
    window.addEventListener("load", setVar);
  }

  /* ---------- Language switcher (EN / ने) ---------- */
  var PCM_NE = {
    "Home": "गृहपृष्ठ",
    "About": "हाम्रो बारे",
    "About PCM": "PCM को बारे",
    "About Us": "हाम्रो बारे",
    "Words from our leaders": "नेतृत्वका शब्दहरू",
    "From the Principal": "प्रिन्सिपलबाट",
    "Board of Directors": "संचालक समिति",
    "Faculty & Staff": "शिक्षक तथा कर्मचारी",
    "Programs": "कार्यक्रमहरू",
    "All Programs": "सबै कार्यक्रमहरू",
    "BBA": "BBA",
    "BBA-Finance": "BBA-Finance",
    "BCSIT": "BCSIT",
    "News": "समाचार",
    "News & Notices": "समाचार तथा सूचना",
    "Notices": "सूचनाहरू",
    "Results": "नतिजाहरू",
    "Events": "घटनाहरू",
    "Events & Workshops": "घटना तथा कार्यशालाहरू",
    "Gallery": "ग्यालरी",
    "Blogs": "ब्लगहरू",
    "Articles": "लेखहरू",
    "Student Blogs": "विद्यार्थी ब्लगहरू",
    "Contact": "सम्पर्क",
    "Contact Us": "सम्पर्क गर्नुहोस्",
    "More": "थप",
    "Admission": "भर्ना",
    "Admission Information": "भर्ना सम्बन्धी जानकारी",
    "Scholarships": "छात्रवृत्तिहरू",
    "Clubs": "क्लबहरू",
    "Alumni": "पूर्व विद्यार्थीहरू",
    "Alumni Network": "पूर्व विद्यार्थी सञ्जाल",
    "Life at PCM": "PCM मा जीवन",
    "Login": "लगइन",
    "Apply Now": "अहिले नै आवेदन गर्नुहोस्",
    "Call Admissions": "भर्ना कार्यालयलाई कल गर्नुहोस्",
    "Apply for 2083": "२०८३ का लागि आवेदन गर्नुहोस्",
    "Explore Programs": "कार्यक्रमहरू अन्वेषण गर्नुहोस्",
    "Browse Programs": "कार्यक्रमहरू हेर्नुहोस्",
    "About BBA": "BBA को बारे",
    "Start Application": "आवेदन सुरु गर्नुहोस्",
    "View Scholarships": "छात्रवृत्ति हेर्नुहोस्",
    "Read our story": "हाम्रो कथा पढ्नुहोस्",
    "Open Gallery": "ग्यालरी खोल्नुहोस्",
    "More Info": "थप जानकारी",
    "Quick Links": "द्रुत लिंकहरू",
    "Get in Touch": "सम्पर्कमा रहनुहोस्",
    "Opening Hours": "खुल्ने समय",
    "Sunday – Friday": "आइतबार – शुक्रबार",
    "Saturday": "शनिबार",
    "Closed": "बन्द",
    "Affiliated to": "सम्बद्ध",
    "Pokhara University": "पोखरा विश्वविद्यालय",
    "Terms & Services": "नियम तथा सेवाहरू",
    "Privacy Policy": "गोपनीयता नीति",
    "GPA Converter": "GPA कन्भर्टर",
    "NP-EN Converter": "NP-EN कन्भर्टर",
    "Download": "डाउनलोड",
    "Downloads": "डाउनलोडहरू",
    "Forms & Downloads": "फारम तथा डाउनलोडहरू",
    "Search the site": "साइट खोज्नुहोस्",
    "Switch to dark mode": "डार्क मोडमा जानुहोस्",
    "Switch to light mode": "लाइट मोडमा जानुहोस्",
    "Back to top": "माथि जानुहोस्",
    "Welcome to PCM": "PCM मा स्वागत छ",
    "Our Programs": "हाम्रा कार्यक्रमहरू",
    "Campus calendar": "क्याम्पस क्यालेन्डर",
    "Upcoming events": "आगामी घटनाहरू",
    "Voices of PCM": "PCM का आवाजहरू",
    "Newsroom": "समाचार कक्ष",
    "Our Compass": "हाम्रो दिशा",
    "What's happening at PCM": "PCM मा के चलिरहेको छ",
    "Enter to Learn.Go Forth to Serve.": "सिक्न आउनुहोस्, सेवा गर्न जानुहोस्।",
    "Enter to Learn — Go Forth to Serve": "सिक्न आउनुहोस् — सेवा गर्न जानुहोस्",
    "Latest from campus": "क्याम्पसका पछिल्ला समाचारहरू",
    "Latest stories": "पछिल्ला समाचारहरू",
    "Latest articles": "पछिल्ला लेखहरू",
    "Latest notices": "पछिल्ला सूचनाहरू",
    "Explore the courses at PCM": "PCM का पाठ्यक्रमहरू अन्वेषण गर्नुहोस्",
    "A place to learn, grow and lead": "सिक्न, बढ्न र नेतृत्व गर्ने ठाउँ",
    "Become a part of something big": "ठूलो कुराको हिस्सा बन्नुहोस्",
    "A legacy measured in outcomes": "नतिजाबाट मापन हुने विरासत",
    "More than a degree": "डिग्रीभन्दा बढी",
    "Life at PCM": "PCM मा जीवन",
    "Beyond the classroom": "कक्षाभन्दा बाहिर",
    "Find your people": "आफ्ना साथीहरू खोज्नुहोस्",
    "Skills that set you apart": "अरूभन्दा फरक बनाउने सीपहरू",
    "News & Notices": "समाचार तथा सूचना",
    "Academic Programs": "शैक्षिक कार्यक्रमहरू",
    "Compare the programs": "कार्यक्रमहरू तुलना गर्नुहोस्",
    "Undergraduate degrees at PCM": "PCM का स्नातक डिग्रीहरू",
    "Choose your path": "आफ्नो बाटो रोज्नुहोस्",
    "At a glance": "एक नजरमा",
    "Student stories": "विद्यार्थीका कथाहरू",
    "Forms & downloads": "फारम तथा डाउनलोडहरू",
    "What our achievers say": "हाम्रा सफल विद्यार्थीहरू के भन्छन्",
    "What's happening at PCM": "PCM मा के चलिरहेको छ",
    "How it works": "कसरी काम गर्छ",
    "Your future starts with one application.": "तपाईंको भविष्य एउटा आवेदनबाट सुरु हुन्छ।",
    "Three career-focused degree programs.": "तीन करियर-केन्द्रित डिग्री कार्यक्रमहरू।",
    "A step towards your future": "तपाईंको भविष्यतर्फको एक कदम",
    "Start your application": "आफ्नो आवेदन सुरु गर्नुहोस्",
    "Read More": "थप पढ्नुहोस्",
    "View All": "सबै हेर्नुहोस्",
    "All Events": "सबै घटनाहरू",
    "All Downloads": "सबै डाउनलोडहरू",
    "Years": "वर्षहरू",
    "Duration": "अवधि",
    "Credit Hours": "क्रेडिट घण्टा",
    "Seats": "सिटहरू",
    "Welcome to PCM": "PCM मा स्वागत छ",
    "Get in Touch": "सम्पर्कमा रहनुहोस्",
    "Official documents": "आधिकारिक कागजातहरू",
    "Campus Gallery": "क्याम्पस ग्यालरी",
    "Explore our albums": "हाम्रा एल्बमहरू अन्वेषण गर्नुहोस्",
    "Frequently Asked Questions": "बारम्बार सोधिने प्रश्नहरू",
    "Common questions": "सामान्य प्रश्नहरू",
    "Help center": "सहायता केन्द्र",
    "Get involved": "सहभागी हुनुहोस्",
    "Why join?": "किन सामेल हुने?",
    "Clubs & activities": "क्लब तथा गतिविधिहरू",
    "Leadership happens outside the lecture hall": "नेतृत्व कक्षाकोठाबाहिर पनि विकास हुन्छ",
    "News": "समाचार",
    "Examinations": "परीक्षाहरू",
    "Keep reading": "पढ्दै रहनुहोस्",
    "Related stories": "सम्बन्धित समाचारहरू",
    "Our team": "हाम्रो टोली",
    "Guiding PCM": "PCM लाई मार्गदर्शन",
    "Leadership": "नेतृत्व",
    "Faculty & administration": "शिक्षक तथा प्रशासन",
    "Who we are": "हामी को हौं",
    "Why study at PCM?": "PCM मा किन पढ्ने?",
    "Vision, Mission & Values": "दृष्टि, लक्ष्य र मूल्यहरू",
    "The PCM difference": "PCM को विशेषता",
    "What we stand for": "हामी केका लागि खडा छौं",
    "A balanced approach to management": "व्यवस्थापनका लागि सन्तुलित दृष्टिकोण",
    "What makes us different": "हामीलाई फरक बनाउने कुरा",
    "Quality management education, made affordable": "गुणस्तरीय व्यवस्थापन शिक्षा, किफायती मूल्यमा",
    "Words from our leaders": "हाम्रा नेताहरूका शब्दहरू",
    "Governance rooted in student success": "विद्यार्थी सफलतामा आधारित शासन",
    "Our promise": "हाम्रो प्रतिज्ञा",
    "Governance": "शासन",
    "Message from the Chairperson": "अध्यक्षको सन्देश",
    "Message from our Advisor": "सल्लाहकारको सन्देश",
    "Message from the BCSIT Coordinator": "BCSIT संयोजकको सन्देश",
    "Message from the BBA Coordinator": "BBA संयोजकको सन्देश",
    "Leadership voices": "नेतृत्वका आवाजहरू",
    "Why study BBA at PCM?": "PCM मा BBA किन पढ्ने?",
    "Why study BCSIT at PCM?": "PCM मा BCSIT किन पढ्ने?",
    "Why study BBA-Finance at PCM?": "PCM मा BBA-Finance किन पढ्ने?",
    "Program overview": "कार्यक्रम सिंहावलोकन",
    "Curriculum": "पाठ्यक्रम",
    "Beyond the syllabus": "पाठ्यक्रमभन्दा बाहिर",
    "Program structure & syllabus": "कार्यक्रम संरचना तथा पाठ्यक्रम",
    "How BBA students grow at PCM": "PCM मा BBA विद्यार्थीहरू कसरी अगाडि बढ्छन्",
    "How BCSIT students grow at PCM": "PCM मा BCSIT विद्यार्थीहरू कसरी अगाडि बढ्छन्",
    "How BBA-Finance students grow at PCM": "PCM मा BBA-Finance विद्यार्थीहरू कसरी अगाडि बढ्छन्",
    "Opportunities": "अवसरहरू",
    "Ways we support you": "हामी तपाईंलाई सहयोग गर्ने तरिकाहरू",
    "Applying for a scholarship": "छात्रवृत्तिका लागि आवेदन गर्दा",
    "Scholarship FAQs": "छात्रवृत्ति सम्बन्धी FAQ",
    "Good to know": "जान्नुपर्ने कुरा",
    "The admission process": "भर्ना प्रक्रिया",
    "Two easy ways to apply": "आवेदन गर्ने दुई सजिला तरिकाहरू",
    "How it works": "कसरी काम गर्छ",
    "Enquiry / Application": "सोधपुछ / आवेदन",
    "Apply for admission": "भर्नाका लागि आवेदन गर्नुहोस्",
    "PCM Blog & Articles": "PCM ब्लग तथा लेखहरू",
    "Student Blogs": "विद्यार्थी ब्लगहरू",
    "Voices from campus": "क्याम्पसका आवाजहरू",
    "Glimpses of PCM": "PCM का झलकहरू",
    "1000+ graduates": "१०००+ स्नातकहरू",
    "Alumni spotlight": "पूर्व विद्यार्थी विशेष",
    "Where they go": "तिनीहरू कहाँ जान्छन्",
    "Once a PCM student, always part of the PCM family": "एकपटक PCM विद्यार्थी, सधैं PCM परिवारको हिस्सा",
    "Meet our graduates": "हाम्रा स्नातकहरूलाई भेट्नुहोस्",
    "Alumni in the world": "विश्वका पूर्व विद्यार्थीहरू",
    "Events & Tours": "घटना तथा भ्रमणहरू",
    "Workshops & Seminars": "कार्यशाला तथा सेमिनारहरू",
    "Student Clubs": "विद्यार्थी क्लबहरू",
    "Calculate your GPA": "आफ्नो GPA गणना गर्नुहोस्",
    "Understanding SGPA & CGPA": "SGPA र CGPA बुझ्नुहोस्",
    "Nepali ⇄ English Converter": "नेपाली ⇄ अंग्रेजी कन्भर्टर",
    "Transliterate between Nepali (Devanagari) and romanized English.": "नेपाली (देवनागरी) र रोमन अंग्रेजीबीच अनुवाद गर्नुहोस्।",
    "Type in Nepali": "नेपालीमा टाइप गर्नुहोस्",
    "Devanagari → English": "देवनागरी → अंग्रेजी",
    "English → Devanagari": "अंग्रेजी → देवनागरी",
    "Romanization rules": "रोमनाइजेसन नियमहरू",
    "Copy": "कपी",
    "Clear": "मेट्नुहोस्",
    "Contact details": "सम्पर्क विवरणहरू",
    "We're here to help": "हामी मद्दत गर्न यहाँ छौं",
    "Get in Touch": "सम्पर्कमा रहनुहोस्",
    "Placements": "प्लेसमेन्टहरू",
    "Testimonials": "विद्यार्थी प्रतिक्रियाहरू",
    "Placements & Careers": "प्लेसमेन्ट तथा करियर",
    "Student Testimonials": "विद्यार्थी प्रतिक्रियाहरू",
    "Stay in the Loop": "सूचित रहनुहोस्",
    "Subscribe": "सदस्यता लिनुहोस्",
    "Campus & Facilities": "क्याम्पस तथा सुविधाहरू",
    "Facilities": "सुविधाहरू",
    "Campus Map": "क्याम्पस नक्सा",
    "Our campus": "हाम्रो क्याम्पस",
    "Getting around": "यात्रा गर्दै",
    "Places on campus": "क्याम्पसका स्थानहरू",
    "Facilities designed around you": "तपाईंकै लागि डिजाइन गरिएका सुविधाहरू",
    "Explore the Nadipur campus": "नादिपुर क्याम्पस अन्वेषण गर्नुहोस्",
    "Everything a student needs to learn, create and grow — all on one campus at Nadipur.": "सिक्न, सिर्जना गर्न र बढ्न चाहिने सबै कुरा — सबै एकै नादिपुर क्याम्पसमा।",
    "Find your way around the PCM campus — tap a marker to see what's nearby.": "PCM क्याम्पसमा आफ्नो बाटो पत्ता लगाउनुहोस् — नजिक के छ हेर्न मार्करमा ट्याप गर्नुहोस्।",
    "Designed for learning": "सिकाइका लागि डिजाइन गरिएको",
    "A campus that feels like home": "घरजस्तै लाग्ने क्याम्पस",
    "Easy to reach, hard to leave": "पुग्न सजिलो, छोड्न गाह्रो",
    "Location": "स्थान",
    "See the campus for yourself": "क्याम्पस आफैं हेर्नुहोस्",
    "Come visit us at Nadipur": "नादिपुरमा हामीलाई भेट्न आउनुहोस्",
    "View campus map": "क्याम्पस नक्सा हेर्नुहोस्",
    "Browse facilities": "सुविधाहरू हेर्नुहोस्",
    "Book a Visit": "भ्रमण बुक गर्नुहोस्",
    "Get Directions": "दिशा निर्देशन पाउनुहोस्",
    "Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM.": "निर्देशित भ्रमणका लागि नादिपुरमा हामीलाई भेट्नुहोस्, वा आजै आवेदन दिनुहोस् र PCM मा आफ्नो यात्रा सुरु गर्नुहोस्।",
    "Drop by the campus for a tour, or talk to our admissions team about joining the 2083 intake.": "भ्रमणका लागि क्याम्पसमा आउनुहोस्, वा २०८३ भर्नामा सामेल हुन हाम्रो प्रवेश टोलीसँग कुरा गर्नुहोस्।",
    "Click a marker on the map or a place in the list to learn more about each spot.": "प्रत्येक स्थानको बारेमा थप जान्न नक्सामा मार्कर वा सूचीमा रहेको स्थानमा क्लिक गर्नुहोस्।",
    "Monthly highlights — events, scholarships and results. No spam, unsubscribe anytime.": "मासिक विशेष — घटनाहरू, छात्रवृत्ति र नतिजाहरू। स्प्याम छैन, जहिले पनि सदस्यता खारेज गर्न सक्नुहुन्छ।",
    "From your first internship to your first job — PCM prepares you for the world of work.": "पहिलो इन्टर्नसिपदेखि पहिलो जागिरसम्म — PCM तपाईंलाई कामको संसारका लागि तयार गर्छ।",
    "Career support": "करियर सहयोग",
    "Dedicated career guidance, resume clinics, mock interviews and a growing network of recruitment partners.": "समर्पित करियर मार्गदर्शन, रिजुम क्लिनिक, मक इन्टरभ्यु र बढ्दो भर्ती साझेदारहरूको सञ्जाल।",
    "Talk to careers": "करियरसँग कुरा गर्नुहोस्",
    "Where they work": "तिनीहरू कहाँ काम गर्छन्",
    "Graduates placed across sectors": "विभिन्न क्षेत्रमा रोजगारी पाएका स्नातकहरू",
    "Our alumni work in banking, tech, consulting, startups and beyond — in Nepal and abroad.": "हाम्रा पूर्व विद्यार्थीहरू बैंकिङ, प्रविधि, परामर्श, स्टार्टअपलगायत क्षेत्रमा नेपाल र विदेशमा काम गर्छन्।",
    "Recruitment partners": "भर्ती साझेदारहरू",
    "Who hires PCM graduates": "PCM स्नातकहरूलाई कसले रोजगारी दिन्छ",
    "A growing panel of employers who return to PCM year after year.": "वर्षौंदेखि PCM मा फर्किने नियोक्ताहरूको बढ्दो समूह।",
    "How we help": "हामी कसरी सहयोग गर्छौं",
    "From campus to career": "क्याम्पसबाट करियरसम्म",
    "Your career starts at PCM": "तपाईंको करियर PCM बाट सुरु हुन्छ",
    "Join a college that invests in your future — with the skills, network and guidance to get hired.": "तपाईंको भविष्यमा लगानी गर्ने कलेजमा सामेल हुनुहोस् — रोजगारी पाउन सीप, सञ्जाल र मार्गदर्शनसहित।",
    "Placement rate": "प्लेसमेन्ट दर",
    "Internships every year": "हरेक वर्ष इन्टर्नसिपहरू",
    "Career workshops annually": "वार्षिक करियर कार्यशालाहरू",
    "Banking & Finance": "बैंकिङ तथा वित्त",
    "NABIL, Global IME, Prabhu, NIC Asia and more hire PCM finance graduates every year.": "NABIL, Global IME, Prabhu, NIC Asia लगायतले हरेक वर्ष PCM का वित्त स्नातकहरूलाई रोजगारी दिन्छन्।",
    "Technology": "प्रविधि",
    "Software and IT firms value BCSIT problem-solvers for development, QA and systems roles.": "सफ्टवेयर र IT कम्पनीहरूले विकास, QA र सिस्टम भूमिकाका लागि BCSIT समस्या-समाधानकर्ताहरूलाई मूल्यवान् ठान्छन्।",
    "Business & Consulting": "व्यवसाय तथा परामर्श",
    "Management graduates lead operations, marketing and HR in corporates and consultancies.": "व्यवस्थापन स्नातकहरू कम्पनी र परामर्श फर्महरूमा सञ्चालन, मार्केटिङ र HR को नेतृत्व गर्छन्।",
    "Startups & NGOs": "स्टार्टअप तथा गैरसरकारी संस्थाहरू",
    "Entrepreneurial PCM graduates build ventures and contribute across the non-profit sector.": "उद्यमशील PCM स्नातकहरू उद्यम स्थापना गर्छन् र गैर-लाभकारी क्षेत्रमा योगदान दिन्छन्।",
    "Real words from the PCM community — students, graduates and the families who trust us.": "PCM समुदायका वास्तविक शब्दहरू — विद्यार्थीहरू, स्नातकहरू र हामीलाई विश्वास गर्ने परिवारहरू।",
    "A legacy measured in outcomes — hear it from the people who lived it.": "नतिजाबाट मापन हुने विरासत — यसलाई अनुभव गरेकाहरूबाट सुन्नुहोस्।",
    "Write your own story": "आफ्नै कथा लेख्नुहोस्",
    "Join a community where students grow, succeed and belong. Your journey starts here.": "विद्यार्थीहरू बढ्ने, सफल हुने र आफ्नै ठाउँ पाउने समुदायमा सामेल हुनुहोस्। तपाईंको यात्रा यहाँबाट सुरु हुन्छ।",
    "See Campus Life": "क्याम्पस जीवन हेर्नुहोस्",
    "Explore Programs": "कार्यक्रमहरू हेर्नुहोस्",
    "Enter to Learn. Go Forth to Serve.": "सिक्न आउनुहोस्। सेवा गर्न अगाडि बढ्नुहोस्।",
    "Pokhara College of Management develops confident, creative and adaptive graduates in Business & IT — ready to make an impact from the first day of their careers.": "पोखरा कलेज अफ म्यानेजमेन्टले व्यवसाय र आईटीमा आत्मविश्वासी, रचनात्मक र अनुकूलनशील स्नातकहरू तयार पार्छ — आफ्नो करियरको पहिलो दिनदेखि नै प्रभाव पार्न तयार।",
    "Business administration, finance specialisation or computer systems & IT — every PCM program blends theory with real-world practice.": "व्यवसाय व्यवस्थापन, वित्त विशेषज्ञता वा कम्प्युटर प्रणाली र आईटी — हरेक PCM कार्यक्रमले सिद्धान्तलाई व्यवहारिक अभ्याससँग मिसाउँछ।",
    "Apply online or in person. Scholarships and Pokhara University merit awards are available for eligible students.": "अनलाइन वा प्रत्यक्ष रूपमा आवेदन दिनुहोस्। योग्य विद्यार्थीहरूका लागि छात्रवृत्ति र पोखरा विश्वविद्यालयका योग्यता पुरस्कारहरू उपलब्ध छन्।",
    "Pokhara College of Management (PCM), affiliated to Pokhara University, was established in 2002 with an unwavering dedication to developing well-educated, confident, creative and adaptive graduates able to shape an organisation's strategic capability and competitive advantage.": "पोखरा कलेज अफ म्यानेजमेन्ट (PCM), पोखरा विश्वविद्यालयमा सम्बद्ध, सन् २००२ मा सुशिक्षित, आत्मविश्वासी, रचनात्मक र अनुकूलनशील स्नातकहरू तयार गर्ने अटल समर्पणका साथ स्थापित भएको थियो, जसले संगठनको रणनीतिक क्षमता र प्रतिस्पर्धात्मक लाभ निर्माण गर्न सक्छन्।",
    "To identify, develop and unveil the potential of future business leaders who can define their own role, responsibilities and boundaries — and grasp the opportunities of a dynamic new world.": "गतिशील नयाँ संसारका अवसरहरू बुझ्न — आफ्नो भूमिका, जिम्मेवारी र सीमाहरू परिभाषित गर्न सक्ने भविष्यका व्यावसायिक नेताहरूको सम्भावना पहिचान, विकास र प्रकट गर्न।",
    "We are a value-based organisation. Discipline, sincerity, hard work and innovation are our individual values; respect for diverse opinions, professionalism, fairness, transparency and team spirit are our organisational values.": "हामी मूल्य-आधारित संस्था हौं। अनुशासन, इमानदारी, कठोर परिश्रम र नवीनता हाम्रा व्यक्तिगत मूल्यहरू हुन्; विविध विचारहरूको सम्मान, व्यावसायिकता, निष्पक्षता, पारदर्शिता र टोली भावना हाम्रा संगठनात्मक मूल्यहरू हुन्।",
    "To offer highly competitive, professionally oriented management education — equipping students with advanced conceptual, analytical and quantitative techniques for confident decision-making.": "आत्मविश्वासपूर्ण निर्णय लिनका लागि उन्नत अवधारणात्मक, विश्लेषणात्मक र मात्रात्मक प्रविधिहरूले सुसज्जित — अत्यन्त प्रतिस्पर्धी, व्यावसायिक रूपमा उन्मुख व्यवस्थापन शिक्षा प्रदान गर्न।",
    "The principles that guide every decision we make and every graduate we send into the world.": "हामीले गर्ने हरेक निर्णय र संसारमा पठाउने हरेक स्नातकलाई मार्गदर्शन गर्ने सिद्धान्तहरू।",
    "Designed to produce professional managers, giving students sound conceptual foundations alongside the practical skills to lead in a dynamic business world.": "व्यावसायिक व्यवस्थापकहरू उत्पादन गर्न डिजाइन गरिएको — गतिशील व्यवसायिक संसारमा नेतृत्व गर्नका लागि विद्यार्थीहरूलाई बलियो सैद्धान्तिक आधार र व्यावहारिक सीपहरू दिन्छ।",
    "A four-year, eight-semester degree merging information technology with business management to meet the evolving demands of modern organisations.": "आधुनिक संगठनहरूको विकसित मागहरू पूरा गर्न सूचना प्रविधिलाई व्यवसाय व्यवस्थापनसँग मिलाउने चारवर्षे, आठ-सेमेस्टरको डिग्री।",
    "A finance-focused BBA that builds deep expertise in financial analysis, investment and corporate finance for careers in banking and beyond.": "बैंकिङ र सोभन्दा परका करियरहरूका लागि वित्तीय विश्लेषण, लगानी र कर्पोरेट वित्तमा गहिरो विशेषज्ञता निर्माण गर्ने वित्त-केन्द्रित BBA।",
    "Three Pokhara University degrees, each designed to turn ambition into a profession.": "तीनवटा पोखरा विश्वविद्यालय डिग्रीहरू, प्रत्येक महत्वाकांक्षालाई पेशामा परिणत गर्न डिजाइन गरिएको।",
    "It gives me profound pleasure to have completed my BBA from PCM. The relationship between faculty and students is very cordial here, and the college gave me the opportunity to excel in my area of interest. The four years I spent here helped me grow professionally and personally.": "PCM बाट BBA पूरा गर्न पाउँदा मलाई अत्यन्त खुसी लागेको छ। यहाँ संकाय र विद्यार्थीबीचको सम्बन्ध अत्यन्त सौहार्दपूर्ण छ, र कलेजले मलाई मेरो रुचिको क्षेत्रमा उत्कृष्ट बन्ने अवसर दियो। यहाँ बिताएका चार वर्षले मलाई व्यावसायिक र व्यक्तिगत रूपमा बढ्न मद्दत गर्यो।",
    "Applications for the 2083 intake are open across all three programs. Take the first step today.": "तीनैवटा कार्यक्रमहरूमा २०८३ भर्नाका लागि आवेदन खुला छन्। आजै पहिलो कदम चाल्नुहोस्।",
    "Fests, tours, workshops and clubs — the moments that turn classmates into a community.": "फेस्टहरू, भ्रमणहरू, कार्यशालाहरू र क्लबहरू — सहपाठीहरूलाई समुदायमा बदल्ने क्षणहरू।",
    "Affordable, quality management & IT education in the heart of Pokhara since 2002.": "सन् २००२ देखि पोखराको मुटुमा किफायती, गुणस्तरीय व्यवस्थापन र आईटी शिक्षा।",
    "BBA student Prabhat has secured a Rs. 12 lakh entrepreneurship grant to bring his startup idea to life — a proud milestone for PCM's culture of enterprise and innovation.": "BBA विद्यार्थी प्रभातले आफ्नो स्टार्टअप विचारलाई जीवनमा ल्याउन रु. १२ लाख उद्यमशीलता अनुदान प्राप्त गरेका छन् — PCM को उद्यम र नवीनता संस्कृतिको गौरवपूर्ण कोसेढुङ्गा।",
    "Music, dance, food stalls and friendly competition brought the whole college together for Annual Fest 2026 — one of the most anticipated events on the PCM calendar.": "सङ्गीत, नृत्य, खाना स्टलहरू र मैत्रीपूर्ण प्रतिस्पर्धाले २०२६ को वार्षिक फेस्टमा सम्पूर्ण कलेजलाई एकैसाथ ल्यायो — PCM पात्रोको सबैभन्दा प्रतीक्षित कार्यक्रमहरूमध्ये एक।",
    "The much-loved annual festival returned to PCM with vibrant performances, inter-batch contests and a celebration of student creativity and community.": "जीवन्त प्रस्तुतिहरू, अन्तर-ब्याच प्रतियोगिताहरू र विद्यार्थी रचनात्मकता तथा समुदायको उत्सवका साथ अत्यन्त प्रिय वार्षिक फेस्ट PCM मा फर्कियो।",

    /* ---- Nav / mega dropdown / shared UI ---- */
    "Community": "समुदाय",
    "Admission & Support": "भर्ना तथा सहयोग",
    "Campus & Careers": "क्याम्पस तथा करियर",
    "Resources": "स्रोतहरू",
    "Careers": "करियरहरू",
    "Virtual Tour": "भर्चुअल भ्रमण",
    "PCM Life": "PCM मा जीवन",
    "FAQ": "बारम्बार सोधिने प्रश्नहरू",
    "About PCM": "PCM बारेमा",
    "Join BBA, BBA-Finance & BCSIT": "BBA, BBA-Finance र BCSIT मा सामेल हुनुहोस्",
    "Enter to Learn — Go Forth to Serve. Affordable, quality management & IT education in the heart of Pokhara since 2002.": "सिक्न आउनुहोस्, सेवा गर्न जानुहोस्। सन् २००२ देखि पोखराको मुटुमा किफायती, गुणस्तरीय व्यवस्थापन र आईटी शिक्षा।",
    "🎓 Admissions Open for BBA · BBA-Finance · BCSIT —": "🎓 BBA · BBA-Finance · BCSIT का लागि भर्ना खुला छ —",
    "📅 Entrance: Ashar 29, 2083, 8:00 AM · Form deadline: Ashar 26, 2083": "📅 प्रवेश: असार २९, २०८३, ८:०० बजे · फारम अन्तिम मिति: असार २६, २०८३",

    /* ---- Notice feed titles (site-wide) ---- */
    "BBA student Prabhat awarded Rs. 12 lakh entrepreneurship grant": "BBA विद्यार्थी प्रभातलाई रु. १२ लाख उद्यमशीलता अनुदान प्रदान",
    "Annual Fest 2026 lights up the PCM campus": "वार्षिक महोत्सव २०२६ ले PCM क्याम्पस उज्यालो पार्यो",
    "Model press conference sharpens student communication skills": "मोडल पत्रकार सम्मेलनले विद्यार्थीहरूको सञ्चार क्षमता निखार्यो",
    "BCSIT cohort tours leading tech company in Kathmandu": "BCSIT समूहले काठमाडौंको अग्रणी प्रविधि कम्पनीको भ्रमण गर्‍यो",
    "PCM clubs organise blood-donation drive": "PCM क्लबहरूले रक्तदान अभियान आयोजना गरे",
    "Entrance Examination Schedule - 2083": "प्रवेश परीक्षा तालिका - २०८३",
    "Admission Form Deadline": "भर्ना फारमको अन्तिम मिति",
    "Scholarship Applications Open": "छात्रवृत्ति आवेदन खुला",
    "Semester Result Publication": "सेमेस्टर नतिजा प्रकाशन",
    "Annual Fest 2083 Dates Announced": "वार्षिक महोत्सव २०८३ को मिति घोषणा",
    "BBA 8th Semester Result - 2082": "BBA आठौं सेमेस्टरको नतिजा - २०८२",
    "BCSIT 3rd Semester Result - 2082": "BCSIT तेस्रो सेमेस्टरको नतिजा - २०८२",
    "BBA-Finance 5th Semester Result - 2082": "BBA-Finance पाँचौं सेमेस्टरको नतिजा - २०८२",
    "BBA 6th Semester Result - 2082": "BBA छैठौं सेमेस्टरको नतिजा - २०८२",
    "BCSIT 1st Semester Result - 2082": "BCSIT पहिलो सेमेस्टरको नतिजा - २०८२",
    "Coding Bootcamp for BCSIT": "BCSIT का लागि कोडिङ बुटक्याम्प",
    "Guest Lecture: Careers in Banking": "अतिथि व्याख्यान: बैंकिङ करियर",
    "Inter-Batch Sports Tournament": "अन्तर-ब्याच खेलकुद प्रतियोगिता",
    "Annapurna Educational Tour": "अन्नपूर्ण शैक्षिक भ्रमण",
    "Annual Fest 2083": "वार्षिक महोत्सव २०८३",

    /* ---- Home ---- */
    "Applications are open for BBA, BBA-Finance and BCSIT. Entrance exam on Ashar 29, 2083 — don't miss your chance to join PCM.": "BBA, BBA-Finance र BCSIT का लागि आवेदन खुला छन्। प्रवेश परीक्षा असार २९, २०८३ मा — PCM मा सामेल हुने मौका नछुटाउनुहोस्।",
    "A campus that comes alive": "जीवन्त क्याम्पस",
    "Fests, sports, clubs and community drives build confidence and a network that lasts a lifetime.": "फेस्ट, खेलकुद, क्लब र सामुदायिक अभियानहरूले आत्मविश्वास र जीवनभर टिक्ने सञ्जाल बनाउँछन्।",
    "Affiliated to Pokhara University, PCM has been shaping confident, capable graduates since 2002 through hands-on learning, dedicated mentors and a vibrant campus culture.": "पोखरा विश्वविद्यालयसँग सम्बद्ध, PCM ले सन् २००२ देखि व्यावहारिक सिकाइ, समर्पित मार्गदर्शक र जीवन्त क्याम्पस संस्कृतिमार्फत आत्मविश्वासी, सक्षम स्नातकहरू निर्माण गर्दै आएको छ।",
    "Why choose PCM?": "किन PCM रोज्ने?",
    "Three paths to a strong career": "बलियो करियरका लागि तीन बाटो",
    "Every PCM program blends conceptual depth with real-world practice, non-credit skill courses and internship experience.": "हरेक PCM कार्यक्रमले सैद्धान्तिक गहिराइलाई व्यावहारिक अभ्यास, नन-क्रेडिट सीप पाठ्यक्रम र इन्टर्नसिप अनुभवसँग जोड्छ।",
    "Join PCM this intake": "यस भर्नामा PCM मा सामेल हुनुहोस्",
    "A simple, transparent admission process — scholarships available for deserving students.": "सरल र पारदर्शी भर्ना प्रक्रिया — योग्य विद्यार्थीहरूका लागि छात्रवृत्ति उपलब्ध छन्।",
    "Appear for the entrance": "प्रवेश परीक्षा दिनुहोस्",
    "The entrance exam is held on Ashar 29, 2083, 8:00 AM at the PCM campus.": "प्रवेश परीक्षा असार २९, २०८३, बिहान ८:०० बजे PCM क्याम्पसमा सञ्चालन हुनेछ।",
    "Modern classrooms, dedicated labs and space to play and unwind — everything you need to learn well.": "आधुनिक कक्षाकोठा, समर्पित प्रयोगशाला र खेल्ने तथा आराम गर्ने स्थान — राम्रोसँग सिक्न चाहिने सबै कुरा।",
    "Spacious, well-lit classrooms with modern projectors, AV systems and comfortable seating.": "आधुनिक प्रोजेक्टर, AV प्रणाली र आरामदायी सिट भएका फराकिला, उज्याला कक्षाकोठाहरू।",
    "A quiet, fully-stocked library with reference texts, journals, e-resources and study desks.": "सन्दर्भ पुस्तकहरू, जर्नलहरू, इ-स्रोतहरू र अध्ययन टेबलहरू भएको शान्त र पूर्ण रूपमा व्यवस्थित पुस्तकालय।",
    "Dedicated labs with up-to-date computers and software for BCSIT practicals and coding workshops.": "BCSIT प्रयोगात्मक कक्षा र कोडिङ कार्यशालाका लागि नवीनतम कम्प्युटर र सफ्टवेयर भएका समर्पित प्रयोगशालाहरू।",
    "IT & Computer Labs": "IT र कम्प्युटर प्रयोगशालाहरू",
    "Latest from PCM": "PCM का पछिल्ला समाचारहरू",
    "Stories, achievements and campus updates.": "कथाहरू, उपलब्धिहरू र क्याम्पसका अपडेटहरू।",
    "See PCM": "PCM हेर्नुहोस्",
    "Campus Tour — Nadipur, Pokhara": "क्याम्पस भ्रमण — नादिपुर, पोखरा",
    "Annual Fest 2083 Highlights": "वार्षिक महोत्सव २०८३ का झलकहरू",
    "BCSIT Student Projects": "BCSIT विद्यार्थी परियोजनाहरू",
    "A look at the software and systems PCM computing students build.": "PCM कम्प्युटिङ विद्यार्थीहरूले बनाउने सफ्टवेयर र प्रणालीहरूको झलक।",
    "Walk through smart classrooms, labs and the learning resource centre.": "स्मार्ट कक्षाकोठा, प्रयोगशाला र सिकाइ स्रोत केन्द्रको भ्रमण गर्नुहोस्।",
    "Music, dance and inter-batch contests from the flagship PCM celebration.": "PCM को प्रमुख महोत्सवका सङ्गीत, नृत्य र अन्तर-ब्याच प्रतियोगिताहरू।",
    "Applications are open for the 2083 intake at Pokhara College of Management. Seats are limited and the deadline is close.": "पोखरा कलेज अफ म्यानेजमेन्टमा २०८३ भर्नाका लागि आवेदन खुला छन्। सिटहरू सीमित छन् र अन्तिम मिति नजिकिँदै छ।",

    /* ---- About ---- */
    "Pokhara College of Management (PCM), affiliated to Pokhara University, was established in 2002 with an unwavering dedication to developing well-educated, confident, creative and adaptive graduates able to make an impact on an organisation's strategic capability and competitive advantage.": "पोखरा कलेज अफ म्यानेजमेन्ट (PCM), पोखरा विश्वविद्यालयसँग सम्बद्ध, सन् २००२ मा स्थापित भएको हो — संगठनको रणनीतिक क्षमता र प्रतिस्पर्धात्मक लाभमा प्रभाव पार्न सक्ने सुशिक्षित, आत्मविश्वासी, रचनात्मक र अनुकूलनशील स्नातकहरू निर्माण गर्ने अटल प्रतिबद्धताका साथ।",
    "The PCM team firmly believes that quality management education is the need of the hour, as the world transforms into a common business arena. A business leader must understand the global rules to excel in local fields — and that spirit has guided us from humble beginnings to a college trusted by guardians, students and society alike.": "PCM टोली विश्वास गर्छ कि संसार साझा व्यावसायिक क्षेत्रमा रूपान्तरण हुँदै गर्दा गुणस्तरीय व्यवस्थापन शिक्षा नै आजको आवश्यकता हो। व्यावसायिक नेताले स्थानीय क्षेत्रमा उत्कृष्टता हासिल गर्न विश्वव्यापी नियमहरू बुझ्नुपर्छ — र त्यही भावनाले हामीलाई सामान्य सुरुवातबाट अभिभावक, विद्यार्थी र समाजको विश्वास जितेको कलेजसम्म पुर्‍याएको छ।",
    "A value-based organisation promoting discipline, sincerity, hard work and innovation as individual values, and respect, professionalism, fairness, transparency and team spirit as organisational values.": "अनुशासन, इमानदारी, कठोर परिश्रम र नवीनतालाई व्यक्तिगत मूल्यका रूपमा, तथा सम्मान, व्यावसायिकता, निष्पक्षता, पारदर्शिता र टोली भावनालाई संस्थागत मूल्यका रूपमा प्रवर्द्धन गर्ने मूल्यमान्यतामा आधारित संस्था।",
    "A dedicated faculty pool with extensive experience across management and IT, bringing practical, cutting-edge learning into every classroom.": "व्यवस्थापन र IT मा व्यापक अनुभव भएका समर्पित संकाय टोली, हरेक कक्षाकोठामा व्यावहारिक र अत्याधुनिक सिकाइ ल्याउँदै।",
    "Frequent guest lectures from business and IT industry leaders, plus hands-on workshops, are a regular part of the curriculum.": "व्यवसाय र IT उद्योगका नेताहरूबाट नियमित अतिथि व्याख्यान र व्यावहारिक कार्यशालाहरू पाठ्यक्रमको नियमित हिस्सा हुन्।",
    "An IT curriculum integrated with management — focused on data analytics, cybersecurity, AI and machine learning.": "व्यवस्थापनसँग एकीकृत IT पाठ्यक्रम — डाटा विश्लेषण, साइबर सुरक्षा, AI र मेसिन लर्निङमा केन्द्रित।",
    "A wide network of industry partners for internships and placement support, opening doors after graduation.": "इन्टर्नसिप र प्लेसमेन्ट सहयोगका लागि उद्योग साझेदारहरूको व्यापक सञ्जाल, स्नातकपछि ढोकाहरू खोल्ने।",
    "A caring culture that supports every student personally — the difference students notice most about PCM.": "हरेक विद्यार्थीलाई व्यक्तिगत रूपमा सहयोग गर्ने हेरचाहपूर्ण संस्कृति — विद्यार्थीहरूले PCM बारे सबैभन्दा बढी महसुस गर्ने विशेषता।",
    "Student clubs organise sports, entertainment, art and literature, idea pitching and more, all year round.": "विद्यार्थी क्लबहरूले वर्षभरि खेलकुद, मनोरञ्जन, कला र साहित्य, विचार प्रस्तुतीकरण लगायतका गतिविधिहरू आयोजना गर्छन्।",

    /* ---- Admission ---- */
    "Apply online in minutes, or download the prospectus and drop your form at the admissions office in Nadipur.": "केही मिनेटमै अनलाइन आवेदन गर्नुहोस्, वा प्रस्पेक्टस डाउनलोड गरेर नादिपुरस्थित भर्ना कार्यालयमा फारम बुझाउनुहोस्।",
    "Gather your certificates, transcripts and photographs from the checklist below and keep the originals ready for verification.": "तलको सूचीबाट आफ्ना प्रमाणपत्रहरू, ट्रान्सक्रिप्टहरू र फोटोहरू जुटाउनुहोस् र प्रमाणीकरणका लागि मूल कागजातहरू तयार राख्नुहोस्।",
    "Appear for the Pokhara University entrance examination on the scheduled date. Bring your admit card and a valid ID.": "तोकिएको मितिमा पोखरा विश्वविद्यालयको प्रवेश परीक्षामा उपस्थित हुनुहोस्। आफ्नो प्रवेश कार्ड र मान्य परिचयपत्र ल्याउनुहोस्।",
    "Selection is merit-based on your entrance result and academic record, followed by a brief counselling interview.": "तपाईंको प्रवेश परीक्षाको नतिजा र शैक्षिक अभिलेखका आधारमा योग्यतानुसार छनोट गरिन्छ, त्यसपछि छोटो परामर्श अन्तर्वार्ता हुन्छ।",
    "Complete registration, submit your migration certificate and secure your seat. Welcome to the PCM family!": "दर्ता पूरा गर्नुहोस्, स्थानान्तरण प्रमाणपत्र बुझाउनुहोस् र आफ्नो सिट सुरक्षित गर्नुहोस्। PCM परिवारमा स्वागत छ!",
    "Applying to Pokhara College of Management is quick and simple. Submit your application online, or if you prefer, download the prospectus/form as a PDF and drop it at our admissions office.": "पोखरा कलेज अफ म्यानेजमेन्टमा आवेदन दिनु छिटो र सरल छ। अनलाइन आवेदन पेश गर्नुहोस्, वा रुचि भए प्रस्पेक्टस/फारम PDF को रूपमा डाउनलोड गरी हाम्रो भर्ना कार्यालयमा बुझाउनुहोस्।",

    /* ---- Clubs ---- */
    "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and build skills beyond the classroom.": "PCM मा छ सक्रिय विद्यार्थी क्लबहरू — वातावरण, वित्त, कोडिङ, वादविवाद, संगीत र खेलकुद — जहाँ विद्यार्थीहरूले कक्षाभन्दा बाहिर नेतृत्व, सिर्जना र सीप विकास गर्छन्।",
    "Employers look for more than grades. Club leadership, event management and teamwork give PCM students the confidence and experience that make their résumés stand out.": "नियोक्ताहरू अंकभन्दा धेरै खोज्छन्। क्लब नेतृत्व, घटना व्यवस्थापन र टोली कार्यले PCM विद्यार्थीहरूलाई उनीहरूको रिजुमे फरक बनाउने आत्मविश्वास र अनुभव दिन्छ।",
    "Inter-college debates, elocution, public speaking workshops and model UN participation.": "अन्तर-कलेज वादविवाद, वाचन, सार्वजनिक वक्तृत्व कार्यशाला र मोडल संयुक्त राष्ट्र सहभागिता।",

    /* ---- Home extras ---- */
    "Fests, sports, clubs and community drives — at PCM, education goes far beyond the classroom.": "महोत्सव, खेलकुद, क्लब र सामुदायिक अभियान — PCM मा शिक्षा कक्षाकोठाभन्दा धेरै टाढासम्म पुग्छ।",
    "Quality management & IT education": "गुणस्तरीय व्यवस्थापन तथा IT शिक्षा",
    "in the heart of Pokhara": "पोखराको मुटुमा",
    "A finance-focused BBA that builds deep expertise in financial analysis, investment and corporate finance for careers in banking and beyond.": "बैंकिङ र सोभन्दा अगाडिका करियरहरूका लागि वित्तीय विश्लेषण, लगानी र कर्पोरेट वित्तमा गहिरो विशेषज्ञता निर्माण गर्ने वित्त-केन्द्रित BBA।",
    "Explore PCM Life": "PCM जीवन अन्वेषण गर्नुहोस्",
    "Watch PCM": "PCM हेर्नुहोस्",
    "See the campus in motion": "क्याम्पसलाई गतिमा हेर्नुहोस्",
    "Short films from campus life, celebrations and student work.": "क्याम्पस जीवन, उत्सवहरू र विद्यार्थी कार्यहरूका छोटा फिल्महरू।",
    "Visit gallery": "ग्यालरी हेर्नुहोस्",
    "Glimpses of PCM": "PCM का झलकहरू",
    "Moments from our campus": "हाम्रो क्याम्पसका क्षणहरू",
    "A quick look at life, learning and celebration at PCM.": "PCM मा जीवन, सिकाइ र उत्सवको छोटो झलक।",
    "Full gallery": "पूर्ण ग्यालरी",
    "Fests, seminars, workshops and tours — find your next moment at PCM.": "महोत्सवहरू, सेमिनारहरू, कार्यशालाहरू र भ्रमणहरू — PCM मा आफ्नो अर्को क्षण भेट्टाउनुहोस्।",
    "The flagship celebration of the PCM year — music, dance, food stalls, inter-batch competitions and performances by students.": "PCM वर्षको प्रमुख उत्सव — संगीत, नृत्य, खाना स्टलहरू, अन्तर-ब्याच प्रतियोगिताहरू र विद्यार्थीहरूद्वारा प्रस्तुतिहरू।",
    "A hands-on weekend bootcamp covering modern web development — open to all BCSIT students.": "आधुनिक वेब विकास समेट्ने व्यावहारिक सप्ताहन्त बुटक्याम्प — सबै BCSIT विद्यार्थीहरूका लागि खुला।",
    "Industry leaders from the banking sector share real-world insight on building a career in finance and banking.": "बैंकिङ क्षेत्रका उद्योग नेताहरूले वित्त र बैंकिङमा करियर निर्माणका बारेमा वास्तविक-संसारको अन्तर्दृष्टि साझा गर्छन्।",

    /* ---- Admission extras ---- */
    "Applying to PCM is quick and simple — online or in person. Here's everything you need for the 2083 intake.": "PCM मा आवेदन दिनु छिटो र सरल छ — अनलाइन वा व्यक्तिगत रूपमा। २०८३ भर्नाका लागि चाहिने सबै कुरा यहाँ छ।",
    "Submit the form": "फारम पेश गर्नुहोस्",
    "Fill out the online application or pick up a form from the college office before Ashar 26, 2083.": "असार २६, २०८३ भन्दा अगाडि अनलाइन आवेदन भर्नुहोस् वा कलेज कार्यालयबाट फारम लिनुहोस्।",
    "SEE Mark-sheet & Character Certificate": "SEE अंकपत्र र चरित्र प्रमाणपत्र",
    "SEE Transfer Certificate": "SEE स्थानान्तरण प्रमाणपत्र",
    "10+2 / Equivalent Mark-sheet & Transcript": "१०+२ / समकक्ष अंकपत्र तथा ट्रान्सक्रिप्ट",
    "10+2 / Equivalent Character Certificate": "१०+२ / समकक्ष चरित्र प्रमाणपत्र",
    "Migration Certificate (original required for registration)": "स्थानान्तरण प्रमाणपत्र (दर्ताका लागि मूल कागजात आवश्यक)",
    "Passport-sized photographs (3 copies)": "पासपोर्ट आकारका फोटोहरू (३ प्रति)",

    /* ---- Events ---- */
    "Fests, seminars, workshops, tours and competitions — find your next moment at PCM.": "महोत्सवहरू, सेमिनारहरू, कार्यशालाहरू, भ्रमणहरू र प्रतियोगिताहरू — PCM मा आफ्नो अर्को क्षण भेट्टाउनुहोस्।",
    "What's happening at PCM": "PCM मा के हुँदैछ",
    "Upcoming events across the college. Follow along, or join us on campus.": "कलेजका आगामी कार्यक्रमहरू। सँगै पछ्याउनुहोस्, वा क्याम्पसमा हामीसँग सामेल हुनुहोस्।",
    "Our annual field trip into the Annapurna region — combining outdoor learning, teamwork and unforgettable views.": "अन्नपूर्ण क्षेत्रको हाम्रो वार्षिक भ्रमण — बाहिरी सिकाइ, टोली कार्य र अविस्मरणीय दृश्यहरूको संयोजन।",
    "Friendly competition across batches in football, volleyball and basketball. Come cheer your batch!": "फुटबल, भलिबल र बास्केटबलमा ब्याचहरूबीच मैत्रीपूर्ण प्रतियोगिता। आफ्नो ब्याचलाई हौसला दिन आउनुहोस्!",
    "Panel talks, resume reviews and one-on-one mentoring with professionals from banking, technology and consulting.": "बैंकिङ, प्रविधि र परामर्श क्षेत्रका पेशेवरहरूसँग प्यानल वार्ता, रिजुमे समीक्षा र एक-एक मार्गदर्शन।",
    "Debaters from colleges across Pokhara battle it out on current affairs and campus topics.": "पोखराका विभिन्न कलेजका वक्ताहरूले समसामयिक मुद्दा र क्याम्पस विषयमा प्रतिस्पर्धा गर्छन्।",
    "A beginner-friendly introduction to MUN procedure, committee rules and resolution drafting.": "MUN प्रक्रिया, समिति नियमहरू र प्रस्ताव मस्यौदाको सुरुवात-मैत्री परिचय।",
    "Model United Nations (MUN) Workshop": "मोडल संयुक्त राष्ट्र (MUN) कार्यशाला",
    "A weekend of community service — teaching, cleaning drives and interaction with local students.": "सामुदायिक सेवाको सप्ताहन्त — शिक्षण, सरसफाइ अभियान र स्थानीय विद्यार्थीहरूसँग अन्तरक्रिया।",
    "A full week of tournaments, prize distributions and house-level rivalry across every sport.": "हरेक खेलमा प्रतियोगिता, पुरस्कार वितरण र हाउस-स्तरीय प्रतिस्पर्धाले भरिएको पूरै हप्ता।",
    "Digital payments, neobanking and the future of finance — insights from industry practitioners.": "डिजिटल भुक्तानी, नियोबैंकिङ र वित्तको भविष्य — उद्योग अभ्यासकहरूको अन्तर्दृष्टि।",
    "A mid-year celebration with cultural performances, stalls and inter-batch competitions to close the year.": "वर्ष बन्द गर्न सांस्कृतिक प्रस्तुतिहरू, स्टलहरू र अन्तर-ब्याच प्रतियोगिताहरूसहितको मध्यवर्ष उत्सव।",

    /* ---- Contact ---- */
    "Sun–Fri: 6:00 AM – 4:00 PM · Sat: Closed": "आइतबार–शुक्रबार: बिहान ६:०० – साँझ ४:०० · शनिबार: बन्द",
    "This demo form does not transmit data. Please email info@pcm.edu.np for real enquiries.": "यो डेमो फारमले तथ्याङ्क पठाउँदैन। वास्तविक सोधपुछका लागि कृपया info@pcm.edu.np मा इमेल गर्नुहोस्।"
  };

  var langOrigNodes = [];

  function initLang() {
    var toggles = $$(".lang a[data-lang]");
    if (!toggles.length) return;

    var langActive = false;
    var langObserver = null;
    var SKIP_CTX = ".rte__editor, script, style, textarea, input, .search-overlay";
    var WORD_RE = /[A-Za-z]+(?:['\u2019-][A-Za-z]+)*/g;

    function norm(s) {
      return String(s || "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    }

    function hasDeva(s) {
      return /[\u0900-\u097F]/.test(s);
    }

    function isSkippedNode(n) {
      var p = n.parentElement;
      return !!(p && p.closest && p.closest(SKIP_CTX));
    }

    function translateWord(raw) {
      if (raw.length === 1 && /[A-Z]/.test(raw)) return raw;
      if (/^[A-Z]{2,}$/.test(raw)) return raw;
      if (raw.indexOf("@") > -1) return raw;
      if (/^[\w.-]+\.[a-z]{2,}(\/[\w./-]*)?$/i.test(raw)) return raw;
      var lw = raw.toLowerCase();
      var L = window.PCM_LANG;
      if (L) {
        if (L.words && L.words[lw] !== undefined) return L.words[lw];
        if (L.proper && L.proper[lw]) return L.proper[lw];
        if (L.skip && L.skip[lw]) return raw;
      }
      if (window.Sanscript) {
        var tr = window.Sanscript.t(lw.replace(/[^a-z]/g, ""), "itrans_lowercase", "devanagari");
        if (tr && tr !== lw && hasDeva(tr)) return tr;
      }
      return raw;
    }

    function translateText(txt) {
      var changed = false;
      var protect = [];
      txt = txt.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, function (m) {
        protect.push(m);
        return "\u0001" + (protect.length - 1) + "\u0001";
      });
      var out = txt.replace(WORD_RE, function (tok, off) {
        if (off > 0 && /\d/.test(txt.charAt(off - 1))) return tok;
        if (off + tok.length < txt.length && /\d/.test(txt.charAt(off + tok.length))) return tok;
        var tr = translateWord(tok);
        if (tr !== tok) changed = true;
        return tr;
      });
      if (protect.length) {
        out = out.replace(/\u0001(\d+)\u0001/g, function (_, i) { return protect[+i]; });
      }
      if (!changed) return txt;
      return out.replace(/[ ]{2,}/g, " ").replace(/\s+([,.;:!?)\]%])/g, "$1").replace(/\(\s+/g, "(").replace(/\s+$/, "");
    }

    function translateNode(n) {
      if (isSkippedNode(n)) return;
      var raw = n.nodeValue;
      var txt = norm(raw);
      if (!txt) return;
      if (hasDeva(txt)) return;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt)) return;
      if (/^[\w-]+(\.[\w-]+)+(\/[\w./-]*)?$/i.test(txt)) return;
      for (var i = 0; i < langOrigNodes.length; i++) {
        if (langOrigNodes[i].node === n) return;
      }
      var ne = PCM_NE[txt];
      if (ne) {
        langOrigNodes.push({ node: n, orig: raw });
        n.nodeValue = ne;
        return;
      }
      var out = translateText(raw);
      if (out !== raw) {
        langOrigNodes.push({ node: n, orig: raw });
        n.nodeValue = out;
      }
    }

    function walk(el) {
      var nodes = [];
      var it = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (it.nextNode()) nodes.push(it.currentNode);
      return nodes;
    }

    function translateToNepali() {
      walk(doc.body).forEach(translateNode);
    }

    function translateToEnglish() {
      langOrigNodes.forEach(function (rec) {
        rec.node.nodeValue = rec.orig;
      });
      langOrigNodes = [];
    }

    function apply(lang) {
      if (lang === "ne") {
        translateToNepali();
        langActive = true;
        if (!langObserver) {
          langObserver = new MutationObserver(function () {
            if (langActive) translateToNepali();
          });
          langObserver.observe(doc.body, { childList: true, subtree: true, characterData: true });
        }
      } else {
        langActive = false;
        if (langObserver) {
          langObserver.disconnect();
          langObserver = null;
        }
        translateToEnglish();
      }
      toggles.forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-lang") === lang);
      });
      doc.documentElement.setAttribute("lang", lang);
      try {
        localStorage.setItem("pcm-lang", lang);
      } catch (e) {}
    }

    toggles.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        apply(t.getAttribute("data-lang"));
      });
    });

    var saved = null;
    try {
      saved = localStorage.getItem("pcm-lang");
    } catch (e) {}
    if (saved === "ne") apply("ne");

    window.PCMTranslate = {
      apply: apply,
      refresh: translateToNepali,
      isActive: function () { return langActive; }
    };
  }

  /* ---------- Init ---------- */
  /* ---------- Popup notice (home page only, every home load) ---------- */
  function initNotice() {
    var pop = $("[data-notice-pop]");
    if (!pop) return;

    var page = (doc.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page !== "index.html") return;

    var lastFocus = doc.activeElement;

    function open() {
      pop.setAttribute("data-open", "");
      pop.setAttribute("aria-hidden", "false");
      doc.body.style.overflow = "hidden";
      var closeBtn = $(".notice-pop__close", pop);
      if (closeBtn && closeBtn.focus) closeBtn.focus();
    }

    function close() {
      pop.removeAttribute("data-open");
      pop.setAttribute("aria-hidden", "true");
      doc.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    $$("[data-notice-close]", pop).forEach(function (el) {
      el.addEventListener("click", close);
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && pop.hasAttribute("data-open")) close();
    });

    window.setTimeout(open, 800);
  }

  /* ---------- Home: video highlight grid ---------- */
  /* Add a real YouTube video ID (the part after ?v=) to any entry to enable
     playback. Entries left with id:"" show a poster with a play badge. */
  var PCM_HOME_VIDEOS = [
    { id: "", poster: "assets/img/about-1.jpg", title: "Campus Tour — Nadipur, Pokhara", desc: "Walk through smart classrooms, labs and the learning resource centre." },
    { id: "", poster: "assets/img/hero-4.jpg", title: "Annual Fest 2083 Highlights", desc: "Music, dance and inter-batch contests from the flagship PCM celebration." },
    { id: "", poster: "assets/img/hero-6.jpg", title: "BCSIT Student Projects", desc: "A look at the software and systems PCM computing students build." }
  ];

  function initHomeVideos() {
    var grid = $(".home-videos-grid");
    if (!grid) return;
    grid.innerHTML = PCM_HOME_VIDEOS.map(function (v, i) {
      var media = v.id
        ? '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id +
          '" title="' + v.title + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        : '<img class="vid-card__poster" src="' + v.poster + '" alt="' + v.title + '" loading="lazy">' +
          '<span class="vid-card__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>';
      return '<article class="vid-card reveal" style="transition-delay:' + (i * 70) + 'ms">' +
        '<div class="vid-card__media">' + media + "</div>" +
        '<div class="vid-card__body"><h3>' + v.title + "</h3><p>" + v.desc + "</p></div>" +
        "</article>";
    }).join("");
  }

  /* ---------- Nav: mark the active item for the current page ---------- */
  var PCM_NAV_ACTIVE = {
    "index.html": "index.html",
    "about.html": "about.html", "about-message.html": "about.html", "about-board.html": "about.html",
    "faculty.html": "about.html", "facilities.html": "about.html", "campus-map.html": "about.html",
    "programs.html": "programs.html", "program-bba.html": "programs.html",
    "program-bba-finance.html": "programs.html", "program-bcsit.html": "programs.html",
    "news.html": "news.html", "news-details.html": "news.html", "notice.html": "news.html",
    "results.html": "news.html", "events.html": "news.html",
    "gallery.html": "gallery.html",
    "blogs.html": "blogs.html", "blogs-student.html": "blogs.html",
    "contact.html": "contact.html",
    "clubs.html": "more.html", "alumni.html": "more.html", "testimonials.html": "more.html", "life.html": "more.html",
    "admission.html": "more.html", "scholarship.html": "more.html", "downloads.html": "more.html", "faq.html": "more.html",
    "placements.html": "more.html", "career.html": "more.html", "virtual-tour.html": "more.html",
    "gpa-converter.html": "more.html", "np-en-converter.html": "more.html"
  };

  function initNavActive() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var target = PCM_NAV_ACTIVE[file] || "";

    function clean(h) {
      return String(h || "").split("#")[0].split("?")[0].split("/").pop();
    }

    $$("nav.nav .nav__list").forEach(function (list) {
      $$("a.nav__link", list).forEach(function (a) {
        var hit = target && (clean(a.getAttribute("href")) === target || (target === "more.html" && a.parentElement && a.parentElement.classList && a.parentElement.classList.contains("drop-more")));
        if (hit) {
          a.classList.add("active");
          a.setAttribute("aria-current", "page");
        } else {
          a.classList.remove("active");
          a.removeAttribute("aria-current");
        }
      });
      $$(".drop a", list).forEach(function (a) {
        if (clean(a.getAttribute("href")) === file) a.classList.add("active");
        else a.classList.remove("active");
      });
    });

    $$("#drawer .drawer__nav a").forEach(function (a) {
      if (clean(a.getAttribute("href")) === file) a.classList.add("active");
      else a.classList.remove("active");
    });
  }

  function init() {
    initHeader();
    initDrawer();
    initAccordion();
    initDropdowns();
    initHomeVideos();
    initReveal();
    initFilters();
    initLightbox();
    initTabs();
    initCounters();
    initForms();
    initNewsletter();
    initToTop();
    initYear();
    initTicker();
    initMarquee();
    initCarousel();
    initGpa();
    initNpEn();
    initHeroCarousel();
    initHeroHeight();
    initTheme();
    initLang();
    initSearch();
    initPageFilters();
    initPagination();
    initPdfPreview();
    initCardModal();
    initAchievers();
    initNotice();
    initNavActive();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
