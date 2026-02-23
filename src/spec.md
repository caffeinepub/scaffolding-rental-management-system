# Specification

## Summary
**Goal:** Build a comprehensive scaffolding rental management system with Indonesian tax compliance, customer/vendor management, inventory tracking, rental order processing, invoicing, double-entry accounting, financial reporting, and role-based access control.

**Planned changes:**
- Create customer management module with NPWP validation and credit limit tracking
- Create vendor management module with payment terms and bank details
- Create scaffolding inventory system tracking item types, quantities, condition status, and location
- Create rental order management with booking, quotation, delivery scheduling, and return processing with condition inspection
- Create pricing system with rate cards for daily/weekly/monthly rates and volume discounts
- Create invoicing system with automatic invoice generation, payment tracking, and late payment alerts
- Create Indonesian tax compliance module with PPN (11%), PPh 23 (2%), faktur pajak generation, and monthly tax reports
- Create double-entry accounting system with chart of accounts, journal entries, general ledger, AR/AP, and bank management
- Create financial reporting module generating Income Statement, Balance Sheet, Cash Flow Statement, Trial Balance, and Indonesian tax reports
- Create asset depreciation tracking using straight-line method with monthly calculations
- Create comprehensive audit trail logging all data modifications with user, timestamp, and IP address
- Create role-based access control with predefined roles (Super Admin, Admin, Accountant, Operations Staff, Sales) and approval workflows
- Create maintenance and repair tracking module for equipment with schedules and cost tracking
- Create financial dashboard with KPIs including revenue, receivables, active rentals, equipment utilization, and overdue payments
- Create data validation controls including duplicate checking, negative amount prevention, and inventory reconciliation
- Implement desktop-optimized UI with keyboard navigation, sortable data tables, and print-friendly layouts
- Create user authentication using Internet Identity with session management and auto-logout
- Create customer credit limit enforcement blocking orders when limit exceeded
- All UI text and labels in Indonesian (Bahasa Indonesia)

**User-visible outcome:** Users can manage a complete scaffolding rental business with customer/vendor records, inventory tracking, rental orders from quotation to return, automatic invoicing with Indonesian tax compliance (PPN/PPh 23), double-entry accounting, financial reports, equipment depreciation, maintenance tracking, role-based access, audit trails, and a financial dashboard showing key metrics - all in Indonesian language on a desktop-optimized interface.
