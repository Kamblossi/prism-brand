/*
PrismERP web surface branding.

This is intentionally limited to visible text/branding.
It does not alter ERPNext or Frappe business logic.
*/

(function () {
	const BRAND = "PrismERP";

	function replaceTextNode(node) {
		if (!node || !node.nodeValue) return;

		let value = node.nodeValue;

		value = value.replaceAll("Login to Frappe", "Login to PrismERP");
		value = value.replaceAll("Login To Frappe", "Login To PrismERP");
		value = value.replaceAll("Frappe Framework", "PrismERP");
		value = value.replaceAll("Frappe", "PrismERP");
		value = value.replaceAll("ERPNext", "PrismERP");

		if (value !== node.nodeValue) {
			node.nodeValue = value;
		}
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

					const parent = node.parentElement;
					if (!parent) return NodeFilter.FILTER_REJECT;

					const tag = parent.tagName;
					if (["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT"].includes(tag)) {
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

	function updateHead() {
		if (document.title) {
			document.title = document.title
				.replaceAll("Frappe", BRAND)
				.replaceAll("ERPNext", BRAND);
		}

		const favicon = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");
		if (favicon) {
			favicon.href = "/assets/prism_brand/images/favicon.svg";
		}
	}

	function applyBranding() {
		updateHead();
		replaceVisibleText(document.body);
	}

	document.addEventListener("DOMContentLoaded", function () {
		applyBranding();

		const observer = new MutationObserver(function () {
			applyBranding();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
})();
