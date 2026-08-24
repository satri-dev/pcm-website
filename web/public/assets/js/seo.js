/* ============================================================
   PCM website — assets/js/seo.js
   Reads the SEO data saved by the admin panel (pcm-admin-data-v1)
   and applies the global + per-page meta tags live.
   If the admin has no saved data, the hardcoded <head> stays as is.
   ============================================================ */
(function () {
  "use strict";

  function slugFromUrl() {
    var path = (location.pathname || "").split("/").pop() || "index.html";
    var name = path.replace(/\.html$/i, "") || "index";
    return name.toLowerCase();
  }

  function setMeta(attr, key, content) {
    if (!content) return;
    var sel = attr === "name" ? 'meta[name="' + key + '"]' : 'meta[property="' + key + '"]';
    var m = document.head.querySelector(sel);
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute(attr, key);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }

  function absUrl(u) {
    if (!u) return u;
    if (/^(https?:)?\/\//i.test(u)) return u;
    if (/^data:/i.test(u)) return u;
    var base = location.href.split("#")[0].split("?")[0];
    var dir = base.substring(0, base.lastIndexOf("/") + 1);
    return dir + u;
  }

  function apply() {
    var raw = null;
    try { raw = localStorage.getItem("pcm-admin-data-v1"); } catch (e) {}
    if (!raw) return;

    var parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) { return; }
    var seo = parsed && parsed.data && parsed.data.seo;
    if (!seo || !seo.global) return;

    var g = seo.global;
    var slug = slugFromUrl();
    var p = (seo.pages || {})[slug] || {};

    var title = p.title || (slug === "index" ? g.siteTitle : "");
    var desc = p.description || g.siteDescription;
    var kw = p.keywords || g.siteKeywords;
    var robots = p.robots || g.robots;
    var ogTitle = p.ogTitle || p.title || (slug === "index" ? g.siteTitle : "");
    var ogDesc = p.ogDescription || p.description || g.siteDescription;
    var ogImg = absUrl(p.ogImage || g.ogImage);

    if (title) document.title = title;
    setMeta("name", "description", desc);
    setMeta("name", "keywords", kw);
    setMeta("name", "robots", robots);

    if (ogTitle) setMeta("property", "og:title", ogTitle);
    if (ogDesc) setMeta("property", "og:description", ogDesc);
    if (g.ogType) setMeta("property", "og:type", g.ogType);
    if (ogImg) setMeta("property", "og:image", ogImg);
    if (g.canonical) setMeta("property", "og:url", g.canonical + (slug === "index" ? "" : slug + ".html"));
    if (g.twitterCard) setMeta("name", "twitter:card", g.twitterCard);
    if (ogTitle) setMeta("name", "twitter:title", ogTitle);
    if (ogDesc) setMeta("name", "twitter:description", ogDesc);
    if (ogImg) setMeta("name", "twitter:image", ogImg);

    if (g.canonical) {
      var can = document.head.querySelector('link[rel="canonical"]');
      if (can) can.setAttribute("href", g.canonical + (slug === "index" ? "" : slug + ".html"));
      else {
        can = document.createElement("link");
        can.setAttribute("rel", "canonical");
        can.setAttribute("href", g.canonical + (slug === "index" ? "" : slug + ".html"));
        document.head.appendChild(can);
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
