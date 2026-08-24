/* ============================================================
   PCM website — assets/js/chat.js
   Multiple-chatbox assistant widget. Floating launcher that
   opens a chat panel with three assistant channels:
     Admissions · Programs · Support
   Answers come from a keyword knowledge base that the admin
   panel manages (pcm-admin-data-v1 -> data.chat). A sensible
   built-in fallback keeps the widget useful without admin data.
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var L = {
    channels: {
      admissions: {
        label: "Admissions",
        icon: "🎓",
        greeting: "Hi! I'm the PCM Admissions Assistant. Ask me about the application process, entrance exam, deadlines or scholarships.",
        quick: ["How do I apply?", "Entrance exam date", "Application deadline", "Scholarships"]
      },
      programs: {
        label: "Programs",
        icon: "📚",
        greeting: "Hi! I'm the Programs Assistant. Ask me about BBA, BBA-Finance or BCSIT.",
        quick: ["Tell me about BBA", "BBA-Finance details", "BCSIT details", "Which program for me?"]
      },
      support: {
        label: "Support",
        icon: "🎧",
        greeting: "Hi! I'm the PCM Support Assistant. Ask me about the campus, fees, contact details or anything else.",
        quick: ["Where is the campus?", "Contact the college", "Fee structure", "Talk to a human"]
      }
    }
  };

  var KB = [
    { c: "admissions", q: ["how to apply", "how do i apply", "application process", "apply now", "admission process", "how can i apply"], a: "Applying is easy. Visit the <b>admission.html</b> page to start your application, or drop by the college office at Nadipur. Keep your SLC/SEE marksheet, character certificate and photos ready." },
    { c: "admissions", q: ["entrance exam", "entrance date", "exam schedule", "when is the exam"], a: "The entrance exam is held each year before the new intake. The exact date and hall details are published on the Notices page — keep an eye on the notice board." },
    { c: "admissions", q: ["deadline", "last date", "application deadline", "closing date"], a: "Admissions for the 2083 intake are currently open. Forms close before the entrance exam — check <b>admission.html</b> for the official deadline and fees." },
    { c: "admissions", q: ["scholarship", "scholarships", "financial aid", "merit", "free"], a: "PCM offers scholarships based on merit and need — including Dean's List awards and need-based support. See the <b>scholarship.html</b> page for full criteria." },
    { c: "admissions", q: ["documents", "required documents", "what do i need"], a: "You'll typically need: SEE/SLC marksheet & certificate, character certificate, citizenship (or birth certificate), passport photos and the filled application form." },
    { c: "admissions", q: ["eligibility", "who can apply", "qualification", "grade"], a: "You need to have completed SEE or equivalent and meet the minimum grade requirements for your chosen program. Contact admissions for personalised guidance." },
    { c: "admissions", q: ["tuition fee", "fees", "cost", "price", "how much"], a: "PCM keeps fees affordable. The exact tuition depends on your program and semester. Call (061) 544761 or visit the office for the latest fee structure." },

    { c: "programs", q: ["bba", "business administration", "tell me about bba"], a: "The BBA is a 4-year, 120-credit degree producing professional managers. It blends conceptual foundations with practical leadership skills. Explore the full curriculum on <b>program-bba.html</b>." },
    { c: "programs", q: ["bba finance", "finance"], a: "BBA-Finance is a finance-specialised BBA — deep expertise in financial analysis, investment and corporate finance, ideal for banking careers. See <b>program-bba-finance.html</b>." },
    { c: "programs", q: ["bcsit", "computer science", "it program", "csit"], a: "BCSIT is a 4-year, 127-credit degree merging IT with business management — perfect for modern tech careers. See <b>program-bcsit.html</b> for details." },
    { c: "programs", q: ["which program", "which one", "best program", "choose"], a: "Love leadership & management? Choose BBA. Interested in banking & investment? BBA-Finance. Want tech & IT careers? BCSIT. Visit <b>programs.html</b> to compare all three." },
    { c: "programs", q: ["seats", "intake", "how many students"], a: "Each program admits a limited intake each year. Check the individual program pages for current seat numbers." },
    { c: "programs", q: ["duration", "how long", "years", "semester"], a: "All three programs are 4 years / 8 semesters: BBA (120 credits), BBA-Finance (120 credits) and BCSIT (127 credits)." },

    { c: "support", q: ["where is", "location", "campus", "address", "find us"], a: "We're at Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal. See the campus on the <b>contact.html</b> page." },
    { c: "support", q: ["contact", "phone", "call", "email", "reach", "talk"], a: "Call us at (061) 544761 / 570124, email <b>info@pcm.edu.np</b>, or use the contact form on <b>contact.html</b>." },
    { c: "support", q: ["open hours", "opening hours", "office hours", "time"], a: "We're open Sunday to Friday, 6:00 AM to 4:00 PM. Saturday is closed." },
    { c: "support", q: ["human", "staff", "person", "talk to someone", "help desk"], a: "Our admissions team is happy to help — call (061) 544761 or drop by the office at Nadipur during opening hours." },
    { c: "support", q: ["hostel", "accommodation", "transport", "canteen", "facilities"], a: "PCM provides a supportive campus environment with learning facilities, and the college can advise on local accommodation in the Nadipur area." },
    { c: "support", q: ["gpa", "converter", "marks"], a: "Use our GPA Converter tool at <b>gpa-converter.html</b> to calculate your GPA, and the NP-EN converter at <b>np-en-converter.html</b>." }
  ];

  var FALLBACK = "I'm not sure about that one — but our team is happy to help. Call <b>(061) 544761</b>, email <b>info@pcm.edu.np</b>, or try one of the quick questions above.";

  var adminKB = null;

  function loadAdminKB() {
    try {
      var raw = localStorage.getItem("pcm-admin-data-v1");
      if (!raw) return;
      var parsed = JSON.parse(raw);
      var items = parsed && parsed.data && parsed.data.chat;
      if (!Array.isArray(items) || !items.length) return;
      adminKB = items.map(function (it) {
        var keys = String(it.keywords || it.question || "").toLowerCase();
        return {
          c: (it.channel || "support").toLowerCase(),
          q: keys.split(/[,;]/).map(function (k) { return k.trim().toLowerCase(); }).filter(Boolean),
          a: it.answer || it.question || ""
        };
      });
    } catch (e) { adminKB = null; }
  }

  function answerFor(channel, text) {
    var t = String(text || "").toLowerCase();
    var pool = (adminKB || KB).filter(function (k) { return k.c === channel; });
    var best = null, bestScore = 0;
    pool.forEach(function (k) {
      k.q.forEach(function (kw) {
        if (kw && t.indexOf(kw) !== -1) {
          var score = kw.length;
          if (score > bestScore) { bestScore = score; best = k; }
        }
      });
    });
    return best ? best.a : FALLBACK;
  }

  var state = { open: false, channel: "admissions", threads: {} };

  function el(tag, cls, html) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function bubble(type, html) {
    var wrap = el("div", "pcm-chat__row pcm-chat__row--" + type);
    var b = el("div", "pcm-chat__bubble", html);
    wrap.appendChild(b);
    return wrap;
  }

  function buildWidget() {
    var host = el("div", "pcm-chat");
    host.id = "pcmChat";

    var launcher = el("button", "pcm-chat__launcher", null);
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open chat assistant");
    launcher.innerHTML =
      '<svg class="pcm-chat__launch-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.35 8.5 8.5 0 0 1-3.2-.6L3 21l1.65-5.6a8.3 8.3 0 0 1-1.4-4.9 8.38 8.38 0 0 1 9-8.35h.5a8.4 8.4 0 0 1 8.25 8.25Z"/></svg>' +
      '<svg class="pcm-chat__close-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '<span class="pcm-chat__ping"></span>';

    var panel = el("div", "pcm-chat__panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat assistant");
    panel.innerHTML =
      '<div class="pcm-chat__head">' +
        '<div class="pcm-chat__head-info"><span class="pcm-chat__avatar">🤖</span><div><b>PCM Assistant</b><small>Online — replies instantly</small></div></div>' +
        '<button class="pcm-chat__close" type="button" aria-label="Close chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '</div>' +
      '<div class="pcm-chat__tabs" role="tablist" aria-label="Assistant channels"></div>' +
      '<div class="pcm-chat__log" aria-live="polite"></div>' +
      '<div class="pcm-chat__quick" role="list"></div>' +
      '<form class="pcm-chat__input">' +
        '<input type="text" placeholder="Type your question…" autocomplete="off" aria-label="Type your question">' +
        '<button type="submit" aria-label="Send message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4Z"/></svg></button>' +
      '</form>';

    host.appendChild(launcher);
    host.appendChild(panel);
    doc.body.appendChild(host);
    return { host, launcher, panel };
  }

  function renderTabs(widget) {
    var tabWrap = widget.panel.querySelector(".pcm-chat__tabs");
    tabWrap.innerHTML = "";
    Object.keys(L.channels).forEach(function (key) {
      var ch = L.channels[key];
      var b = el("button", "pcm-chat__tab" + (state.channel === key ? " is-active" : ""), '<span>' + ch.icon + "</span>" + ch.label);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", state.channel === key ? "true" : "false");
      b.addEventListener("click", function () { switchChannel(widget, key); });
      tabWrap.appendChild(b);
    });
  }

  function renderLog(widget) {
    var log = widget.panel.querySelector(".pcm-chat__log");
    log.innerHTML = "";
    var thread = state.threads[state.channel] || [];
    thread.forEach(function (m) { log.appendChild(bubble(m.role, m.html)); });
    log.scrollTop = log.scrollHeight;
  }

  function renderQuick(widget) {
    var q = widget.panel.querySelector(".pcm-chat__quick");
    q.innerHTML = "";
    var thread = state.threads[state.channel] || [];
    if (thread.some(function (m) { return m.role === "user"; })) return;
    L.channels[state.channel].quick.forEach(function (text) {
      var b = el("button", "pcm-chat__qchip", text);
      b.type = "button";
      b.addEventListener("click", function () { send(widget, text, true); });
      q.appendChild(b);
    });
  }

  function switchChannel(widget, key) {
    state.channel = key;
    if (!state.threads[key]) state.threads[key] = [];
    if (!state.threads[key].length) state.threads[key].push({ role: "bot", html: L.channels[key].greeting });
    renderTabs(widget);
    renderQuick(widget);
    renderLog(widget);
    widget.panel.querySelector(".pcm-chat__input input").placeholder = "Ask " + L.channels[key].label + " assistant…";
    var input = widget.panel.querySelector(".pcm-chat__input input");
    if (doc.activeElement !== input) input.focus();
  }

  function send(widget, text, fromChip) {
    text = String(text || "").trim();
    if (!text) return;
    if (!state.threads[state.channel]) state.threads[state.channel] = [];
    var thread = state.threads[state.channel];
    if (!thread.length) {
      thread.push({ role: "bot", html: L.channels[state.channel].greeting });
    }
    thread.push({ role: "user", html: escText(text) });
    renderLog(widget);
    renderQuick(widget);
    widget.panel.querySelector(".pcm-chat__input input").value = "";

    var typing = el("div", "pcm-chat__row pcm-chat__row--bot pcm-chat__typing", '<span></span><span></span><span></span>');
    widget.panel.querySelector(".pcm-chat__log").appendChild(typing);
    widget.panel.querySelector(".pcm-chat__log").scrollTop = widget.panel.querySelector(".pcm-chat__log").scrollHeight;

    setTimeout(function () {
      typing.parentNode && typing.parentNode.removeChild(typing);
      thread.push({ role: "bot", html: answerFor(state.channel, text) });
      renderLog(widget);
      if (!fromChip) widget.panel.querySelector(".pcm-chat__input input").focus();
    }, 550 + Math.random() * 500);
  }

  function escText(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function init() {
    if (doc.getElementById("pcmChat")) return;
    var widget = buildWidget();
    loadAdminKB();

    var input = widget.panel.querySelector(".pcm-chat__input input");
    widget.panel.querySelector(".pcm-chat__input").addEventListener("submit", function (e) {
      e.preventDefault();
      send(widget, input.value, false);
    });

    widget.launcher.addEventListener("click", function () {
      state.open = !state.open;
      widget.host.classList.toggle("is-open", state.open);
      widget.launcher.setAttribute("aria-expanded", state.open);
      if (state.open) {
        if (!state.threads[state.channel]) state.threads[state.channel] = [];
        if (!state.threads[state.channel].length) {
          state.threads[state.channel].push({ role: "bot", html: L.channels[state.channel].greeting });
        }
        renderTabs(widget);
        renderQuick(widget);
        renderLog(widget);
        setTimeout(function () { input.focus(); }, 80);
      }
    });

    widget.panel.querySelector(".pcm-chat__close").addEventListener("click", function () {
      state.open = false;
      widget.host.classList.remove("is-open");
      widget.launcher.setAttribute("aria-expanded", "false");
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) {
        state.open = false;
        widget.host.classList.remove("is-open");
        widget.launcher.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
