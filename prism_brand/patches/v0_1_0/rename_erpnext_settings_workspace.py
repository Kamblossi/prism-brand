"""
Rename ERPNext Settings workspace to PrismERP Settings.

This is a branding-level change: the workspace belongs to ERPNext app but
we want it branded as PrismERP for consistency.
"""
import frappe


def execute():
    """Rename the workspace title and label."""
    workspace_name = "ERPNext Settings"

    # Check if workspace exists
    if not frappe.db.exists("Workspace", workspace_name):
        print(f"Workspace '{workspace_name}' not found, skipping rename")
        return

    # Update title
    frappe.db.set_value("Workspace", workspace_name, "title", "PrismERP Settings")

    # Update label
    frappe.db.set_value("Workspace", workspace_name, "label", "PrismERP Settings")

    frappe.db.commit()
    print(f"Renamed workspace: '{workspace_name}' → 'PrismERP Settings'")
