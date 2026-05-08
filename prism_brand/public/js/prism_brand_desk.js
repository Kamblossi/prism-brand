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
- Overrides the About dialog with custom PrismERP content (targeted, event-driven)
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
    if (typeof frappe === "undefined" || !frappe.ui || !frappe.ui.toolbar) return;

    var AboutDialog = frappe.ui.toolbar.AboutDialog;
    if (!AboutDialog) return;

    var aboutHtml = [
      "<div class='prismerp-about' style='padding:16px;line-height:1.8'>",
      "<h3 style='margin-bottom:8px'>PrismERP</h3>",
      "<p style='margin-bottom:16px;font-size:14px;color:#666'>Enterprise Resource Planner to Help you Grow your Business</p>",
      "<p><strong>Website:</strong> <a href='https://prismtechco.com' target='_blank' rel='noopener noreferrer'>https://prismtechco.com</a></p>",
      "<p><strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/newton-ochieng-18703a12b' target='_blank' rel='noopener noreferrer'>www.linkedin.com/in/newton-ochieng-18703a12b</a></p>",
      "<p><strong>X:</strong> <a href='https://x.com/PrismTechCo' target='_blank' rel='noopener noreferrer'>https://x.com/PrismTechCo</a></p>",
      "<p><strong>Email:</strong> <a href='mailto:erp@prismtechco.com'>erp@prismtechco.com</a></p>",
      "<hr>",
      "<p><strong>Apps Version</strong></p>",
      "<p>PrismERP: v0.1.0</p>",
      "<hr>",
      "<p>\u00a9 PrismTechCo</p>",
      "</div>"
    ].join("");

    AboutDialog.prototype.show = function () {
      if (!this.dialog) {
        this.dialog = new frappe.ui.Dialog({
          title: __("About"),
          fields: [
            { fieldtype: "HTML", fieldname: "about_html" }
          ]
        });
      }
      this.dialog.get_field("about_html").$wrapper.html(aboutHtml);
      this.dialog.show();
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
