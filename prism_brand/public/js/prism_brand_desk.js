/*
PrismERP Desk branding.

Purpose:
- Replace visible upstream product names in the Desk chrome.
- Insert PrismERP logo where Frappe/ERPNext logo placeholders appear.
- Keep changes presentation-only.
*/

(function () {
	const BRAND = "PrismERP";
	const LOGO = "/assets/prism_brand/images/prismerp-logo.svg";
	const FAVICON = "/assets/prism_brand/images/favicon.svg";

	const TEXT_REPLACEMENTS = [
		["ERPNext", "PrismERP"],
		["Frappe Framework", "PrismERP Core"],
		["Frappe", "PrismERP"],
		["Framework", "PrismERP Core"],
	];

	function replaceTextNode(node) {
		if (!node || !node.nodeValue) return;

		let value = node.nodeValue;

		for (const [from, to] of TEXT_REPLACEMENTS) {
			value = value.replaceAll(from, to);
		}

		if (value !== node.nodeValue) {
			node.nodeValue = value;
		}
	}

	function shouldSkip(parent) {
		if (!parent) return true;

		const tag = parent.tagName;
		return ["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT"].includes(tag);
	}

	function replaceVisibleText(root) {
		const walker = document.createTreeWalker(
			root || document.body,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: function (node) {
					if (!node.nodeValue || !node.nodeValue.trim()) {
						return NodeFilter.FILTER_REJECT;
					}

					if (shouldSkip(node.parentElement)) {
						return NodeFilter.FILTER_REJECT;
					}

					return NodeFilter.FILTER_ACCEPT;
				},
			}
		);

		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);
		nodes.forEach(replaceTextNode);
	}

	function updateLogoImages() {
		const selectors = [
			".app-logo",
			".navbar-brand img",
			".standard-logo",
			".layout-side-section img",
			".sidebar-item-icon img",
		];

		document.querySelectorAll(selectors.join(",")).forEach((img) => {
			if (img && img.tagName === "IMG") {
				img.src = LOGO;
				img.alt = BRAND;
			}
		});
	}

	function updateFavicon() {
		let favicon = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");

		if (!favicon) {
			favicon = document.createElement("link");
			favicon.rel = "icon";
			document.head.appendChild(favicon);
		}

		favicon.href = FAVICON;
	}

	function updateTitle() {
		if (document.title) {
			let title = document.title;
			for (const [from, to] of TEXT_REPLACEMENTS) {
				title = title.replaceAll(from, to);
			}
			document.title = title;
		}
	}

	function addPrismBodyClass() {
		document.body.classList.add("prismerp-desk");
	}

	function applyDeskBranding() {
		addPrismBodyClass();
		updateTitle();
		updateFavicon();
		updateLogoImages();
		replaceVisibleText(document.body);
	}

	document.addEventListener("DOMContentLoaded", function () {
		applyDeskBranding();

		const observer = new MutationObserver(function () {
			applyDeskBranding();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["src", "title", "aria-label"],
		});
	});
})();
