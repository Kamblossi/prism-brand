from prism_brand.branding.constants import BRAND_LOGO, BRAND_FAVICON

app_name = "prism_brand"
app_title = "PrismERP"
app_publisher = "PrismTechCo"
app_description = "PrismERP branding and user-facing identity layer"
app_email = "newtonochieng@prismtechco.com"
app_license = "mit"

app_logo_url = BRAND_LOGO
app_home = "/app"

brand_html = f"""
<div class="prismerp-brand-html">
	<img src="{BRAND_LOGO}" alt="PrismERP" class="prismerp-navbar-logo">
	<span>PrismERP</span>
</div>
"""

website_context = {
	"favicon": BRAND_FAVICON,
	"splash_image": BRAND_LOGO,
	"brand_html": brand_html,
	"app_name": "PrismERP",
	"brand_name": "PrismERP",
}

app_include_css = [
	"/assets/prism_brand/css/prism_brand.css",
]

web_include_css = [
	"/assets/prism_brand/css/prism_brand.css",
]

app_include_js = [
	"/assets/prism_brand/js/prism_brand_desk.js",
]

web_include_js = [
	"/assets/prism_brand/js/prism_brand_web.js",
]

after_install = "prism_brand.branding.setup.apply_branding"
after_migrate = "prism_brand.branding.setup.apply_branding"

fixtures = [
	{
		"dt": "Email Template",
		"filters": [["name", "in", [
			"PrismERP Welcome",
			"PrismERP Tenant Onboarding"
		]]]
	}
]
