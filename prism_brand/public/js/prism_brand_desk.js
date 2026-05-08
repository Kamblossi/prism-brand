/*
PrismERP Desk branding — safe minimal version.

This file intentionally avoids:
- MutationObserver
- whole-document text scanning
- repeated DOM rewrites
- workspace label rewriting
- recursive image updates

Branding that must persist should be handled by:
- prism_brand/branding/setup.py
- site_config.json
- Website/System/Navbar settings
- Workspace records/fixtures where appropriate
*/

(function () {
  const BRAND = "PrismERP";
  const FAVICON = "/assets/prism_brand/images/favicon.svg";

  function updateFaviconOnce() {
    let favicon = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    if (favicon.href.indexOf(FAVICON) === -1) {
      favicon.href = FAVICON;
    }
  }

  function updateTitleOnce() {
    if (!document.title) return;

    document.title = document.title
      .replaceAll("ERPNext", BRAND)
      .replaceAll("Frappe", BRAND);
  }

  function addBodyClassOnce() {
    if (document.body) {
      document.body.classList.add("prismerp-desk");
    }
  }

  function applySafeBranding() {
    updateFaviconOnce();
    updateTitleOnce();
    addBodyClassOnce();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySafeBranding, { once: true });
  } else {
    applySafeBranding();
  }
})();
