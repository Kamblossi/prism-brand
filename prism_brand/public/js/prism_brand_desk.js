/*
PrismERP Desk branding — v2 (fixed sidebar subtitle flickering).

Fixes:
- Sidebar subtitle flickering: instead of DOM text replacement (which gets
  overwritten when Frappe re-renders the sidebar on workspace navigation),
  we override frappe.ui.Sidebar.prototype.choose_app_name() to always set
  header_subtitle = "PrismERP". This fixes the root cause.
- Workspace card title rename: "ERPNext Settings" → "PrismERP Settings" is
  handled by a database patch (patches/v0_1_0/rename_erpnext_settings_workspace.py).

This file intentionally avoids:
- MutationObserver watching the whole document
- whole-document text scanning
- repeated DOM rewrites
- recursive image updates
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

  /* --- About dialog override --- */
  function overrideAboutDialog() {
    if (typeof frappe === "undefined") return;
    frappe.provide("frappe.ui.misc");

    // Clear any cached dialog from previous sessions
    frappe.ui.misc.about_dialog = null;

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
        frappe.ui.misc.about_dialog.hide();
        frappe.ui.misc.about_dialog = null;
      }

      var dialog = new frappe.ui.Dialog({ title: __(BRAND) });
      $(dialog.body).html(aboutHtml);
      frappe.ui.misc.about_dialog = dialog;
      dialog.show();
    };
  }

  /* --- FIX: Override sidebar subtitle at source ---
   *
   * Root cause of flickering: frappe.ui.Sidebar.prototype.choose_app_name()
   * resolves the subtitle from frappe.boot.app_data → "ERPNext" for any
   * workspace belonging to the erpnext app. Every workspace navigation
   * triggers setup() → prepare() → choose_app_name() → make(), which
   * re-renders the sidebar header and overwrites our DOM text replacement.
   *
   * Fix: Wrap choose_app_name() to force header_subtitle = "PrismERP"
   * after the original method runs. This happens at the data level, before
   * the template is rendered, so there is no flicker.
   */
  function overrideSidebarSubtitle() {
    if (typeof frappe === "undefined") return;
    if (!frappe.ui || !frappe.ui.Sidebar) return;

    var originalChooseAppName = frappe.ui.Sidebar.prototype.choose_app_name;
    frappe.ui.Sidebar.prototype.choose_app_name = function () {
      // Run original to set up frappe.current_app and other state
      originalChooseAppName.call(this);
      // Override the subtitle that will be rendered in the sidebar header
      this.header_subtitle = BRAND;
    };
  }

  /* --- Apply once on load --- */
  function applySafeBranding() {
    updateFaviconOnce();
    updateTitleOnce();
    addBodyClassOnce();
  }

  /* --- Bootstrap --- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applySafeBranding();
      overrideAboutDialog();
      overrideSidebarSubtitle();
    }, { once: true });
  } else {
    applySafeBranding();
    overrideAboutDialog();
    overrideSidebarSubtitle();
  }
})();
