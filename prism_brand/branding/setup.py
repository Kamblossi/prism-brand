import frappe

from prism_brand.branding.constants import (
	BRAND_NAME,
	BRAND_COMPANY,
	BRAND_DESCRIPTION,
	BRAND_LOGO,
	BRAND_FAVICON,
	BRAND_SUPPORT_EMAIL,
	BRAND_FROM_EMAIL,
	BRAND_WEBSITE,
)


def _safe_set_site_config(key, value):
	try:
		frappe.db.set_default(key, value)
	except Exception:
		pass

	try:
		frappe.conf[key] = value
	except Exception:
		pass


def _safe_set_single(doctype, values):
	"""Set values on a Single DocType only if the DocType and field exist."""
	if not frappe.db.exists("DocType", doctype):
		return

	meta = frappe.get_meta(doctype)

	for fieldname, value in values.items():
		if meta.has_field(fieldname):
			frappe.db.set_single_value(doctype, fieldname, value)


def _upsert_email_template(name, subject, response):
	if not frappe.db.exists("DocType", "Email Template"):
		return

	if frappe.db.exists("Email Template", name):
		doc = frappe.get_doc("Email Template", name)
	else:
		doc = frappe.new_doc("Email Template")
		doc.name = name

	doc.subject = subject
	doc.response = response
	doc.enabled = 1
	doc.save(ignore_permissions=True)


def _set_visible_workspace_labels():
	"""Best-effort surface rename of common upstream workspace labels.

	This does not change ERPNext/Frappe code or business logic.
	It only updates visible workspace labels where those records exist.
	"""
	if not frappe.db.exists("DocType", "Workspace"):
		return

	replacements = {
		"ERPNext": "PrismERP",
		"Frappe": "PrismERP Core",
		"Framework": "PrismERP Core",
	}

	for old_label, new_label in replacements.items():
		for name in frappe.get_all("Workspace", filters={"label": old_label}, pluck="name"):
			try:
				frappe.db.set_value("Workspace", name, "label", new_label)
			except Exception:
				pass


def apply_branding():
	"""Apply PrismERP branding to the active site.

	This function is called after install and after migrate.
	"""

	# Values that affect login and app identity.
	_safe_set_single("Website Settings", {
		"app_name": BRAND_NAME,
		"brand_html": f'<img src="{BRAND_LOGO}" style="height: 28px;"> {BRAND_NAME}',
		"favicon": BRAND_FAVICON,
		"banner_image": BRAND_LOGO,
		"footer_logo": BRAND_LOGO,
		"copyright": f"© {BRAND_COMPANY}",
	})

	_safe_set_single("System Settings", {
		"app_name": BRAND_NAME,
		"login_with_email_link": 1,
		"login_with_email_link_expiry": 10,
		"rate_limit_email_link_login": 5,
	})

	_safe_set_single("Navbar Settings", {
		"app_logo": BRAND_LOGO,
		"app_name": BRAND_NAME,
		"brand_html": f'<img src="{BRAND_LOGO}" style="height: 28px;"> {BRAND_NAME}',
	})

	_safe_set_single("Portal Settings", {
		"company_name": BRAND_COMPANY,
	})

	_safe_set_site_config("app_title", BRAND_NAME)
	_safe_set_site_config("app_name", BRAND_NAME)
	_safe_set_site_config("app_logo_url", BRAND_LOGO)
	_safe_set_site_config("favicon", BRAND_FAVICON)

	_set_visible_workspace_labels()

	_upsert_email_template(
		"PrismERP Welcome",
		"Welcome to PrismERP",
		f"""
		<p>Hello,</p>
		<p>Welcome to <strong>{BRAND_NAME}</strong>.</p>
		<p>{BRAND_DESCRIPTION}</p>
		<p>You can sign in from your PrismERP tenant URL.</p>
		<p>Need help? Contact <a href="mailto:{BRAND_SUPPORT_EMAIL}">{BRAND_SUPPORT_EMAIL}</a>.</p>
		<p>— {BRAND_COMPANY}</p>
		"""
	)

	_upsert_email_template(
		"PrismERP Tenant Onboarding",
		"Your PrismERP workspace is ready",
		f"""
		<p>Hello,</p>
		<p>Your <strong>{BRAND_NAME}</strong> workspace is ready.</p>
		<p>Use the link provided by the PrismERP team to access your tenant.</p>
		<p>For support, contact <a href="mailto:{BRAND_SUPPORT_EMAIL}">{BRAND_SUPPORT_EMAIL}</a>.</p>
		<p>— {BRAND_COMPANY}</p>
		"""
	)

	frappe.clear_cache()
	frappe.db.commit()
