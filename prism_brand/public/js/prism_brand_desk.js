/*
PrismERP Desk branding — safe, targeted version.

This file intentionally avoids:
- MutationObserver watching the whole document
- whole-document text scanning
- repeated DOM rewrites
- recursive image updates

What it does:
- Sets favicon once
- Sets document title once
- Adds prismerp-desk body class once
- Replaces workspace sidebar subtitle "ERPNext" with "PrismERP" (targeted, on route change)
- Overrides the About dialog with custom PrismERP content (replaces frappe.ui.misc.about)
*/

(function () {
  var BRAND = "PrismERP";
  var FAVICON = "/assets/prism_brand/images/favicon.svg";

  /* --- Safe one-time branding --- */
  function updateFaviconOnce() {
    var favicon = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");
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

  /* --- Workspace subtitle replacement --- */
  function replaceWorkspaceSubtitle() {
    var subtitles = document.querySelectorAll(
      ".sidebar-item-label.header-subtitle, " +
      ".sidebar-label.header-subtitle, " +
      ".workspace-sidebar .sidebar-subtitle, " +
      ".desk-sidebar .header-subtitle"
    );
    subtitles.forEach(function (el) {
      if (el.textContent.trim() === "ERPNext") {
        el.textContent = BRAND;
      }
    });
  }

  /* --- About dialog override --- */
  function overrideAboutDialog() {
    if (typeof frappe === "undefined") return;
    frappe.provide("frappe.ui.misc");

    var aboutHtml = [
      "<div>",
      "  <p><strong>PrismERP</strong></p>",
      "  <p style='margin-bottom:16px;font-size:14px;color:#666'>Enterprise Resource Planner to Help you Grow your Business</p>",
      "",
      "  <p><i class='fa fa-globe fa-fw'></i> <strong>Website:</strong> <a href='https://prismtechco.com' target='_blank'>https://prismtechco.com</a></p>",
      "  <p><i class='fa fa-linkedin fa-fw'></i> <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/newton-ochieng-18703a12b' target='_blank'>www.linkedin.com/in/newton-ochieng-18703a12b</a></p>",
      "  <p><svg xmlns='http://www.w3.org/2000/svg' width='18' height='14' fill='currentColor' class='bi bi-twitter-x' viewBox='0 0 18 16'><path d='M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z'/></svg> <strong>X:</strong> <a href='https://x.com/PrismTechCo' target='_blank'>https://x.com/PrismTechCo</a></p>",
      "  <p><i class='fa fa-envelope fa-fw'></i> <strong>Email:</strong> <a href='mailto:erp@prismtechco.com'>erp@prismtechco.com</a></p>",
      "",
      "  <hr>",
      "",
      "  <div class='d-flex align-items-center justify-content-between'>",
      "    <h4>Apps Version</h4>",
      "  </div>",
      "  <div id='about-app-versions'>PrismERP: v0.1.0</div>",
      "",
      "  <hr>",
      "",
      "  <p class='text-muted'>&copy; PrismTechCo</p>",
      "</div>"
    ].join("");

    frappe.ui.misc.about = function () {
      if (frappe.ui.misc.about_dialog) {
        frappe.ui.misc.about_dialog.show();
        return;
      }

      var dialog = new frappe.ui.Dialog({ title: __("PrismERP") });
      $(dialog.body).html(aboutHtml);
      frappe.ui.misc.about_dialog = dialog;
      dialog.show();
    };
  }

  /* --- Apply once on load --- */
  function applySafeBranding() {
    updateFaviconOnce();
    updateTitleOnce();
    addBodyClassOnce();
  }

  /* --- Route change handler --- */
  function onRouteChange() {
    setTimeout(replaceWorkspaceSubtitle, 200);
    setTimeout(replaceWorkspaceSubtitle, 800);
  }

  /* --- Bootstrap --- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applySafeBranding();
      overrideAboutDialog();
      replaceWorkspaceSubtitle();
    }, { once: true });
  } else {
    applySafeBranding();
    overrideAboutDialog();
    replaceWorkspaceSubtitle();
  }

  /* --- Hook into Frappe route change --- */
  if (typeof frappe !== "undefined") {
    if (frappe.router) {
      var originalOnChange = frappe.router.on_change;
      frappe.router.on_change = function () {
        if (originalOnChange) originalOnChange.apply(this, arguments);
        onRouteChange();
      };
    }
  }
})();
