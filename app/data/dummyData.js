/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  DEMO DATA — Reliance Industrial Operations Procurement Audit 2025
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  Consistent dummy data derived from:
 *    - Invoice INV-2045 (Alpha Industrial Supplies, ₹1,16,590)
 *    - Invoice INV-3312 (Beta Tech Solutions, ₹1,77,000)
 *    - A 20-row procurement ledger (Excel)
 *
 *  All pages import from this single file to ensure cross-system consistency.
 */

// ─── Audit Configuration ─────────────────────────────────────────────────────
export const AUDIT_CONFIG = {
  domain: "Industrial & Manufacturing",
  auditType: "Procurement & Vendor Payments",
  company: "Reliance Industrial Operations",
  year: 2025,
  workspace: "RIL Procurement Audit 2025",
};

export const DEMO_FILE_NAME = "RIL_Procurement_Ledger_2025.xlsx";

// ─── Ledger Data (raw tabular — same shape XLSX would produce) ────────────────
export const LEDGER_HEADERS = [
  "Invoice Number",
  "Invoice Date",
  "Vendor Name",
  "Vendor ID",
  "GST Number",
  "Department",
  "Project Code",
  "Item Description",
  "Subtotal (INR)",
  "Tax (INR)",
  "Discount (INR)",
  "Final Payment (INR)",
  "Approved By",
  "Payment Status",
];

export const LEDGER_ROWS = [
  ["INV-2045","12-Feb-2025","Alpha Industrial Supplies","VND-2041","27AAACI1234K1Z5","Refinery Maintenance","PRJ-RIL-224","Pipeline Valve Replacement + Industrial Seal Kit",100500,18090,2000,116590,"Rajesh Mehta","Paid"],
  ["INV-3312","14-Feb-2025","Beta Tech Solutions","VND-2088","27BBBCI9876M1Z2","IT Infrastructure","PRJ-RIL-881","Server Rack Unit (×2) + Network Switch 24-port (×5)",150000,27000,0,177000,"Priya Sharma","Paid"],
  ["INV-4001","18-Feb-2025","Alpha Industrial Supplies","VND-2041","27AAACI1234K1Z5","Refinery Maintenance","PRJ-RIL-224","Pipeline Gasket Set + Industrial Seal Kit",97500,17550,0,115050,"Rajesh Mehta","Paid"],
  ["INV-4102","20-Feb-2025","Gamma Engineering Works","VND-2055","27CCCGI5432J1Z8","Plant Maintenance","PRJ-RIL-310","Turbine Bearing Replacement",212000,38160,5000,245160,"Ankit Patel","Paid"],
  ["INV-4203","22-Feb-2025","Delta Logistics Pvt Ltd","VND-2063","27DDDLI8765H1Z4","Supply Chain","PRJ-RIL-415","Warehouse Material Handling Equipment",75847,13652,0,89499,"Sunita Rao","Paid"],
  ["INV-4310","25-Feb-2025","Alpha Industrial Supplies","VND-2041","27AAACI1234K1Z5","Refinery Maintenance","PRJ-RIL-224","Emergency Valve Overhaul Service",423729,76271,0,500000,"Rajesh Mehta","Paid"],
  ["INV-4415","01-Mar-2025","Epsilon Chemicals Ltd","VND-2071","27EEECL3456F1Z6","Chemical Processing","PRJ-RIL-502","Industrial Solvent Supply (Batch 12-A)",123051,22149,0,145200,"Deepak Kumar","Paid"],
  ["INV-4520","03-Mar-2025","Beta Tech Solutions","VND-2088","27BBBCI9876M1Z2","IT Infrastructure","PRJ-RIL-881","Server Rack Unit (×2) + Network Switch 24-port (×5)",150000,27000,0,177000,"Priya Sharma","Paid"],
  ["INV-4621","05-Mar-2025","Zeta Safety Solutions","VND-2090","27ZZZSI2345G1Z9","HSE Department","PRJ-RIL-605","Fire Safety Equipment + Extinguishers",57458,10342,0,67800,"Meera Joshi","Paid"],
  ["INV-4730","08-Mar-2025","Gamma Engineering Works","VND-2055","27CCCGI5432J1Z8","Plant Maintenance","PRJ-RIL-310","Compressor Overhaul + Replacement Parts",1016949,183051,0,1200000,"Ankit Patel","Paid"],
  ["INV-4835","10-Mar-2025","Theta Industrial Works","VND-2095","27TTTHI6789D1Z3","Refinery Maintenance","PRJ-RIL-224","Heat Exchanger Maintenance Service",169492,30508,0,200000,"Rajesh Mehta","Paid"],
  ["INV-4940","12-Mar-2025","Alpha Industrial Supplies","VND-2041","27AAACI1234K1Z5","Refinery Maintenance","PRJ-RIL-224","Pipeline Fitting Assembly + Seal Kit",100000,18000,0,118000,"Rajesh Mehta","Paid"],
  ["INV-5045","15-Mar-2025","Iota Power Systems","VND-2100","27IIIPS4321E1Z7","Power Plant","PRJ-RIL-710","Generator Maintenance Parts + Filters",288559,51941,0,340500,"Vikram Singh","Paid"],
  ["INV-5150","18-Mar-2025","Delta Logistics Pvt Ltd","VND-2063","27DDDLI8765H1Z4","Supply Chain","PRJ-RIL-415","Transport & Handling Services (March)",77966,14034,0,92000,"Sunita Rao","Paid"],
  ["INV-5255","20-Mar-2025","Kappa Electricals","VND-2108","27KKKEI1234C1Z1","Electrical Maintenance","PRJ-RIL-820","Switchgear Panel Replacement",66441,11959,0,78400,"Deepak Kumar","Paid"],
  ["INV-5360","22-Mar-2025","Beta Tech Solutions","VND-2088","27BBBCI9876M1Z2","IT Infrastructure","PRJ-RIL-881","Network Cabling + Patch Panel Installation",38136,6864,0,45000,"","Pending"],
  ["INV-5465","25-Mar-2025","Lambda Construction","VND-2115","27LLLCI7890B1Z5","Civil Works","PRJ-RIL-925","Warehouse Extension Structural Work",847458,152542,0,1000000,"Ankit Patel","Paid"],
  ["INV-5570","28-Mar-2025","Alpha Industrial Supplies","VND-2041","27AAACI1234K1Z5","Refinery Maintenance","PRJ-RIL-224","Valve + Fitting Supply Replenishment",84746,15254,0,100000,"","Pending"],
  ["INV-5675","30-Mar-2025","Gamma Engineering Works","VND-2055","27CCCGI5432J1Z8","Plant Maintenance","PRJ-RIL-310","Turbine Inspection + Report Service",216102,38898,0,255000,"Ankit Patel","Paid"],
  ["INV-5780","02-Apr-2025","Mu Safety Equipment","VND-2120","27MMMSI5678A1Z2","HSE Department","PRJ-RIL-605","PPE Kit + Safety Harness Supply",132458,23842,0,156300,"Meera Joshi","Paid"],
];

// ─── Investigation Transactions (pre-scored, consistent) ─────────────────────
export const DEMO_TRANSACTIONS = [
  {
    txnId: "INV-2045", vendor: "Alpha Industrial Supplies", amount: 116590, riskScore: 42,
    flagType: "None", status: "reviewed", date: "12-Feb-2025", approver: "Rajesh Mehta",
    aiAnalysis: "Transaction from Alpha Industrial Supplies for ₹1,16,590 falls within expected range for Refinery Maintenance procurement. Standard vendor, approved by designated authority. No anomalies detected.",
  },
  {
    txnId: "INV-3312", vendor: "Beta Tech Solutions", amount: 177000, riskScore: 38,
    flagType: "None", status: "reviewed", date: "14-Feb-2025", approver: "Priya Sharma",
    aiAnalysis: "IT Infrastructure procurement for ₹1,77,000 is consistent with server and networking equipment market rates. Properly approved. No concerns.",
  },
  {
    txnId: "INV-4001", vendor: "Alpha Industrial Supplies", amount: 115050, riskScore: 72,
    flagType: "Near-Duplicate Pattern", status: "pending", date: "18-Feb-2025", approver: "Rajesh Mehta",
    aiAnalysis: "MEDIUM RISK: Invoice INV-4001 from Alpha Industrial Supplies for ₹1,15,050 closely mirrors INV-2045 (₹1,16,590) — same vendor, same department, similar description ('Seal Kit'), only 6 days apart. The 1.3% amount difference may indicate a split invoice or re-submission. Cross-reference with purchase order PRJ-RIL-224 is recommended.",
  },
  {
    txnId: "INV-4102", vendor: "Gamma Engineering Works", amount: 245160, riskScore: 35,
    flagType: "None", status: "reviewed", date: "20-Feb-2025", approver: "Ankit Patel",
    aiAnalysis: "Turbine bearing replacement at ₹2,45,160 is within expected maintenance costs. Vendor has established relationship with Plant Maintenance. No anomalies found.",
  },
  {
    txnId: "INV-4203", vendor: "Delta Logistics Pvt Ltd", amount: 89499, riskScore: 28,
    flagType: "None", status: "reviewed", date: "22-Feb-2025", approver: "Sunita Rao",
    aiAnalysis: "Warehouse material handling equipment procurement at ₹89,499 is within budget norms. Properly authorized by Supply Chain department head. No flags.",
  },
  {
    txnId: "INV-4310", vendor: "Alpha Industrial Supplies", amount: 500000, riskScore: 82,
    flagType: "Round-Number + Vendor Pattern", status: "flagged", date: "25-Feb-2025", approver: "Rajesh Mehta",
    aiAnalysis: "HIGH RISK: Alpha Industrial Supplies (VND-2041) submitted 4 invoices totalling ₹8,49,640 within 6 weeks. This transaction for exactly ₹5,00,000 is a round number — a known indicator of negotiated or fabricated invoices. Combined with high transaction frequency from this vendor and the near-duplicate pattern detected in INV-4001, this warrants immediate procurement department review. Verify contract terms and compare against market rates for valve overhaul services.",
  },
  {
    txnId: "INV-4415", vendor: "Epsilon Chemicals Ltd", amount: 145200, riskScore: 22,
    flagType: "None", status: "reviewed", date: "01-Mar-2025", approver: "Deepak Kumar",
    aiAnalysis: "Industrial solvent supply at ₹1,45,200 matches procurement rate card for chemical processing inputs. First transaction from this vendor in the audit period. No anomalies.",
  },
  {
    txnId: "INV-4520", vendor: "Beta Tech Solutions", amount: 177000, riskScore: 95,
    flagType: "Duplicate Invoice", status: "flagged", date: "03-Mar-2025", approver: "Priya Sharma",
    aiAnalysis: "CRITICAL: Invoice INV-4520 from Beta Tech Solutions for ₹1,77,000 is an EXACT DUPLICATE of INV-3312 dated 14-Feb-2025. Both invoices reference identical line items (Server Rack Unit ×2, Network Switch 24-port ×5) with matching subtotals, tax amounts, and final payment. Same approver (Priya Sharma) authorized both. This is a strong indicator of double-payment fraud or vendor billing error. IMMEDIATE ACTION: Freeze payment, notify accounts payable, and initiate vendor verification.",
  },
  {
    txnId: "INV-4621", vendor: "Zeta Safety Solutions", amount: 67800, riskScore: 18,
    flagType: "None", status: "reviewed", date: "05-Mar-2025", approver: "Meera Joshi",
    aiAnalysis: "Fire safety equipment procurement at ₹67,800 is standard for HSE department requirements. Approved by department head. Compliant with safety procurement policies.",
  },
  {
    txnId: "INV-4730", vendor: "Gamma Engineering Works", amount: 1200000, riskScore: 88,
    flagType: "Abnormal Payment Spike", status: "flagged", date: "08-Mar-2025", approver: "Ankit Patel",
    aiAnalysis: "HIGH RISK: Transaction INV-4730 from Gamma Engineering Works for ₹12,00,000 represents a 489% increase over their previous transaction of ₹2,45,160 (INV-4102). This payment spike is statistically anomalous (>3σ from vendor mean). No corresponding change in project scope was found for PRJ-RIL-310. Approver Ankit Patel also authorized the ₹10,00,000 Lambda Construction payment (INV-5465). Cross-reference with purchase orders and obtain supporting documentation for compressor overhaul scope.",
  },
  {
    txnId: "INV-4835", vendor: "Theta Industrial Works", amount: 200000, riskScore: 65,
    flagType: "Round-Number Transaction", status: "pending", date: "10-Mar-2025", approver: "Rajesh Mehta",
    aiAnalysis: "MEDIUM RISK: ₹2,00,000 from Theta Industrial Works is an exact round number. While heat exchanger maintenance can vary in cost, round amounts in this range are flagged per audit policy. Additionally, approver Rajesh Mehta also approves Alpha Industrial Supplies invoices — review for potential conflict of interest.",
  },
  {
    txnId: "INV-4940", vendor: "Alpha Industrial Supplies", amount: 118000, riskScore: 58,
    flagType: "Vendor Concentration", status: "pending", date: "12-Mar-2025", approver: "Rajesh Mehta",
    aiAnalysis: "MEDIUM RISK: This is the 3rd invoice from Alpha Industrial Supplies in 4 weeks (after INV-2045, INV-4001, INV-4310). Vendor concentration ratio for this entity is 20% of total procurement spend. Description 'Pipeline Fitting Assembly + Seal Kit' is similar to prior invoices. Review vendor selection process and verify competitive bidding was conducted.",
  },
  {
    txnId: "INV-5045", vendor: "Iota Power Systems", amount: 340500, riskScore: 20,
    flagType: "None", status: "reviewed", date: "15-Mar-2025", approver: "Vikram Singh",
    aiAnalysis: "Generator maintenance parts procurement at ₹3,40,500 is within expected range for power plant operations. Vendor has clean history. Properly approved.",
  },
  {
    txnId: "INV-5150", vendor: "Delta Logistics Pvt Ltd", amount: 92000, riskScore: 25,
    flagType: "None", status: "reviewed", date: "18-Mar-2025", approver: "Sunita Rao",
    aiAnalysis: "Monthly transport and handling services at ₹92,000 is consistent with historical spend for Supply Chain operations. No anomalies detected.",
  },
  {
    txnId: "INV-5255", vendor: "Kappa Electricals", amount: 78400, riskScore: 15,
    flagType: "None", status: "reviewed", date: "20-Mar-2025", approver: "Deepak Kumar",
    aiAnalysis: "Switchgear replacement at ₹78,400 is within market rate. Single occurrence vendor with proper authorization. No concerns.",
  },
  {
    txnId: "INV-5360", vendor: "Beta Tech Solutions", amount: 45000, riskScore: 68,
    flagType: "Missing Documentation", status: "pending", date: "22-Mar-2025", approver: "",
    aiAnalysis: "MEDIUM RISK: Invoice INV-5360 from Beta Tech Solutions for ₹45,000 has NO APPROVER recorded. All transactions require authorized approval per company procurement policy. Additionally, this vendor already has a flagged duplicate invoice (INV-4520). Payment status remains 'Pending'. Obtain proper authorization before processing.",
  },
  {
    txnId: "INV-5465", vendor: "Lambda Construction", amount: 1000000, riskScore: 85,
    flagType: "Round-Number + High Value", status: "flagged", date: "25-Mar-2025", approver: "Ankit Patel",
    aiAnalysis: "HIGH RISK: Invoice INV-5465 from Lambda Construction for exactly ₹10,00,000 exhibits a suspicious round-number pattern. This is the FIRST AND ONLY transaction from this vendor, making baseline comparison impossible. The approver, Ankit Patel, also authorized the anomalous ₹12,00,000 Gamma Engineering payment — concentration of high-value approvals with one individual raises governance concerns. Verify vendor registration, contract terms, and obtain site inspection reports for warehouse extension work.",
  },
  {
    txnId: "INV-5570", vendor: "Alpha Industrial Supplies", amount: 100000, riskScore: 76,
    flagType: "Missing Approval + Round Number", status: "flagged", date: "28-Mar-2025", approver: "",
    aiAnalysis: "HIGH RISK: This is the 4th invoice from Alpha Industrial Supplies (VND-2041) — total vendor exposure now ₹9,49,640. Amount of exactly ₹1,00,000 is a round number with NO APPROVER on record. Combined risk factors: (1) vendor concentration, (2) round amount, (3) missing authorization, (4) similar descriptions across invoices. Strongly recommend vendor audit and procurement process review.",
  },
  {
    txnId: "INV-5675", vendor: "Gamma Engineering Works", amount: 255000, riskScore: 45,
    flagType: "None", status: "reviewed", date: "30-Mar-2025", approver: "Ankit Patel",
    aiAnalysis: "Turbine inspection service at ₹2,55,000 is within expected range and comparable to INV-4102. However, note that Gamma Engineering also has a high-risk payment (INV-4730, ₹12,00,000). This transaction alone is not anomalous but should be reviewed in context of overall vendor relationship.",
  },
  {
    txnId: "INV-5780", vendor: "Mu Safety Equipment", amount: 156300, riskScore: 12,
    flagType: "None", status: "reviewed", date: "02-Apr-2025", approver: "Meera Joshi",
    aiAnalysis: "PPE and safety harness supply at ₹1,56,300 is standard procurement for HSE department. Vendor and amount within normal parameters. Fully compliant.",
  },
];

// ─── Pipeline Step Results (pre-computed for demo) ────────────────────────────
export const DEMO_PIPELINE_RESULTS = [
  {
    id: 1, title: "Upload Data", desc: "Financial data uploaded successfully", status: "completed",
    result: {
      summary: "20 rows and 14 columns loaded successfully from RIL_Procurement_Ledger_2025.xlsx.",
      details: {
        "Total Rows": 20,
        "Total Columns": 14,
        "File Name": "RIL_Procurement_Ledger_2025.xlsx",
        "File Size": "48.2 KB",
        "Sheet Name": "Procurement Ledger",
        "Column Names": "Invoice Number, Invoice Date, Vendor Name, Vendor ID, GST Number, Department, Project Code, Item Description, Subtotal (INR), Tax (INR), Discount (INR), Final Payment (INR), Approved By, Payment Status",
      },
    },
  },
  {
    id: 2, title: "Schema Extraction", desc: "Detected columns and data types", status: "completed",
    result: {
      summary: "Detected 3 numeric, 1 date, 10 text columns from 14 total fields.",
      details: {
        "Numeric Columns": "Subtotal (INR), Tax (INR), Discount (INR), Final Payment (INR)",
        "Date Columns": "Invoice Date",
        "Text Columns": "Invoice Number, Vendor Name, Vendor ID, GST Number, Department, Project Code, Item Description, Approved By, Payment Status",
        "Primary Key Candidate": "Invoice Number (20 unique values)",
      },
      table: [
        { Column: "Invoice Number", "Detected Type": "Text", "Unique Values": 20 },
        { Column: "Invoice Date", "Detected Type": "Date", "Unique Values": 20 },
        { Column: "Vendor Name", "Detected Type": "Text", "Unique Values": 11 },
        { Column: "Vendor ID", "Detected Type": "Text", "Unique Values": 11 },
        { Column: "GST Number", "Detected Type": "Text", "Unique Values": 11 },
        { Column: "Department", "Detected Type": "Text", "Unique Values": 8 },
        { Column: "Project Code", "Detected Type": "Text", "Unique Values": 9 },
        { Column: "Item Description", "Detected Type": "Text", "Unique Values": 19 },
        { Column: "Subtotal (INR)", "Detected Type": "Number", "Unique Values": 19 },
        { Column: "Tax (INR)", "Detected Type": "Number", "Unique Values": 19 },
        { Column: "Discount (INR)", "Detected Type": "Number", "Unique Values": 2 },
        { Column: "Final Payment (INR)", "Detected Type": "Number", "Unique Values": 19 },
        { Column: "Approved By", "Detected Type": "Text", "Unique Values": 7 },
        { Column: "Payment Status", "Detected Type": "Text", "Unique Values": 2 },
      ],
    },
  },
  {
    id: 3, title: "Schema Standardization", desc: "Mapped to standard audit schema", status: "completed",
    result: {
      summary: "14 columns mapped to snake_case audit schema. 2 aliases resolved.",
      details: {
        "Columns Mapped": 14,
        "Aliases Resolved": "Approved By → approved_by, Final Payment (INR) → final_payment_inr",
        "Schema Version": "AuditSchema v2.1",
        "Compliance": "GAAP / IndAS compatible",
      },
      table: [
        { Original: "Invoice Number", Standardized: "invoice_number" },
        { Original: "Invoice Date", Standardized: "invoice_date" },
        { Original: "Vendor Name", Standardized: "vendor_name" },
        { Original: "Vendor ID", Standardized: "vendor_id" },
        { Original: "GST Number", Standardized: "gst_number" },
        { Original: "Department", Standardized: "department" },
        { Original: "Project Code", Standardized: "project_code" },
        { Original: "Item Description", Standardized: "item_description" },
        { Original: "Subtotal (INR)", Standardized: "subtotal_inr" },
        { Original: "Tax (INR)", Standardized: "tax_inr" },
        { Original: "Discount (INR)", Standardized: "discount_inr" },
        { Original: "Final Payment (INR)", Standardized: "final_payment_inr" },
        { Original: "Approved By", Standardized: "approved_by" },
        { Original: "Payment Status", Standardized: "payment_status" },
      ],
    },
  },
  {
    id: 4, title: "Data Normalization", desc: "Cleaned and standardized values", status: "completed",
    result: {
      summary: "280 cells processed. 2 blanks found (missing approvers), 0 values trimmed.",
      details: {
        "Total Cells": 280,
        "Blank Cells": 2,
        "Values Trimmed": 0,
        "Date Format": "Standardized to ISO 8601 (YYYY-MM-DD)",
        "Currency": "INR — comma separators removed, stored as integers",
        "Missing Approvers": "INV-5360, INV-5570 (flagged for review)",
        "Fill Rate": "99.3%",
        "Quality Score": "96/100",
      },
    },
  },
  {
    id: 5, title: "Anomaly Detection", desc: "Identified suspicious patterns", status: "completed",
    result: {
      summary: "8 anomalies detected — 4 high risk, 4 medium risk. 1 exact duplicate invoice found.",
      details: {
        "Total Anomalies": 8,
        "High Risk (Score ≥ 80)": 4,
        "Medium Risk (Score 60–79)": 4,
        "Duplicate Invoices": "1 (INV-4520 = INV-3312)",
        "Round-Number Payments": "4 (₹5L, ₹2L, ₹10L, ₹1L)",
        "Missing Approvals": 2,
        "Payment Spikes": "1 (Gamma Engineering +489%)",
        "Vendor Concentration": "Alpha Industrial — 4 invoices, 20% of spend",
      },
      table: [
        { "Invoice": "INV-4520", "Flag": "Duplicate Invoice", "Risk": 95, "Amount": "₹1,77,000", "Vendor": "Beta Tech Solutions" },
        { "Invoice": "INV-4730", "Flag": "Payment Spike (+489%)", "Risk": 88, "Amount": "₹12,00,000", "Vendor": "Gamma Engineering Works" },
        { "Invoice": "INV-5465", "Flag": "Round-Number + High Value", "Risk": 85, "Amount": "₹10,00,000", "Vendor": "Lambda Construction" },
        { "Invoice": "INV-4310", "Flag": "Round-Number + Vendor Pattern", "Risk": 82, "Amount": "₹5,00,000", "Vendor": "Alpha Industrial Supplies" },
        { "Invoice": "INV-5570", "Flag": "Missing Approval + Round", "Risk": 76, "Amount": "₹1,00,000", "Vendor": "Alpha Industrial Supplies" },
        { "Invoice": "INV-4001", "Flag": "Near-Duplicate Pattern", "Risk": 72, "Amount": "₹1,15,050", "Vendor": "Alpha Industrial Supplies" },
        { "Invoice": "INV-5360", "Flag": "Missing Documentation", "Risk": 68, "Amount": "₹45,000", "Vendor": "Beta Tech Solutions" },
        { "Invoice": "INV-4835", "Flag": "Round-Number Transaction", "Risk": 65, "Amount": "₹2,00,000", "Vendor": "Theta Industrial Works" },
      ],
    },
  },
  {
    id: 6, title: "Graph Analysis", desc: "Building relationship graph", status: "completed",
    result: {
      summary: "27 nodes and 32 edges built. 2 high-risk clusters identified.",
      details: {
        "Graph Nodes": 27,
        "Vendor Nodes": 11,
        "Approver Nodes": 7,
        "Department Nodes": 9,
        "Edges": 32,
        "High-Risk Cluster 1": "Alpha Industrial ↔ Rajesh Mehta ↔ Theta Industrial (shared approver)",
        "High-Risk Cluster 2": "Gamma Engineering ↔ Ankit Patel ↔ Lambda Construction (high-value approvals)",
        "Isolated Nodes": 0,
      },
      table: [
        { "Entity": "Alpha Industrial Supplies", "Type": "Vendor", "Connections": 6, "Risk": "High (78)" },
        { "Entity": "Rajesh Mehta", "Type": "Approver", "Connections": 5, "Risk": "Medium (62)" },
        { "Entity": "Ankit Patel", "Type": "Approver", "Connections": 4, "Risk": "High (70)" },
        { "Entity": "Gamma Engineering Works", "Type": "Vendor", "Connections": 5, "Risk": "High (82)" },
        { "Entity": "Beta Tech Solutions", "Type": "Vendor", "Connections": 4, "Risk": "High (72)" },
        { "Entity": "Lambda Construction", "Type": "Vendor", "Connections": 3, "Risk": "High (75)" },
      ],
    },
  },
  {
    id: 7, title: "Risk Scoring", desc: "Calculate risk scores", status: "completed",
    result: {
      summary: "Risk scores computed. 4 high-risk, 4 medium-risk, 12 low-risk entries.",
      details: {
        "Scoring Model": "Composite (Statistical + Rule-Based + Graph Centrality)",
        "High Risk (≥ 80)": 4,
        "Medium Risk (60–79)": 4,
        "Low Risk (< 60)": 12,
        "Average Risk Score": 47.2,
        "Total Flagged Amount": "₹29,37,050",
        "Flagged as % of Total": "59.4%",
      },
      table: [
        { "Invoice": "INV-4520", "Vendor": "Beta Tech Solutions", "Amount": "₹1,77,000", "Risk Score": 95, "Level": "High" },
        { "Invoice": "INV-4730", "Vendor": "Gamma Engineering", "Amount": "₹12,00,000", "Risk Score": 88, "Level": "High" },
        { "Invoice": "INV-5465", "Vendor": "Lambda Construction", "Amount": "₹10,00,000", "Risk Score": 85, "Level": "High" },
        { "Invoice": "INV-4310", "Vendor": "Alpha Industrial", "Amount": "₹5,00,000", "Risk Score": 82, "Level": "High" },
        { "Invoice": "INV-5570", "Vendor": "Alpha Industrial", "Amount": "₹1,00,000", "Risk Score": 76, "Level": "Medium" },
        { "Invoice": "INV-4001", "Vendor": "Alpha Industrial", "Amount": "₹1,15,050", "Risk Score": 72, "Level": "Medium" },
        { "Invoice": "INV-5360", "Vendor": "Beta Tech Solutions", "Amount": "₹45,000", "Risk Score": 68, "Level": "Medium" },
        { "Invoice": "INV-4835", "Vendor": "Theta Industrial", "Amount": "₹2,00,000", "Risk Score": 65, "Level": "Medium" },
      ],
    },
  },
  {
    id: 8, title: "Report Generation", desc: "Generate audit report", status: "completed",
    result: {
      summary: "Audit report generated covering all 8 pipeline stages.",
      details: {
        "Report Date": "10-Mar-2025",
        "Company": "Reliance Industrial Operations",
        "Audit Period": "Feb 2025 – Apr 2025",
        "Total Transactions": 20,
        "Total Value Audited": "₹49,43,999",
        "Anomalies Detected": 8,
        "Pipeline Stages": "8 / 8",
        "Status": "Complete",
        "Output Format": "PDF + JSON + Executive Summary",
      },
    },
  },
];

// ─── Graph Data (pre-built, consistent with investigation) ────────────────────
export const DEMO_GRAPH_DATA = {
  nodes: [
    // Vendors
    { id: "v::Alpha Industrial Supplies", label: "Alpha Industrial Supplies", type: "vendor", score: 78, degree: 6 },
    { id: "v::Beta Tech Solutions", label: "Beta Tech Solutions", type: "vendor", score: 72, degree: 4 },
    { id: "v::Gamma Engineering Works", label: "Gamma Engineering Works", type: "vendor", score: 82, degree: 5 },
    { id: "v::Delta Logistics Pvt Ltd", label: "Delta Logistics Pvt Ltd", type: "vendor", score: 32, degree: 3 },
    { id: "v::Epsilon Chemicals Ltd", label: "Epsilon Chemicals Ltd", type: "vendor", score: 25, degree: 2 },
    { id: "v::Zeta Safety Solutions", label: "Zeta Safety Solutions", type: "vendor", score: 20, degree: 2 },
    { id: "v::Theta Industrial Works", label: "Theta Industrial Works", type: "vendor", score: 58, degree: 3 },
    { id: "v::Iota Power Systems", label: "Iota Power Systems", type: "vendor", score: 22, degree: 2 },
    { id: "v::Kappa Electricals", label: "Kappa Electricals", type: "vendor", score: 18, degree: 2 },
    { id: "v::Lambda Construction", label: "Lambda Construction", type: "vendor", score: 75, degree: 3 },
    { id: "v::Mu Safety Equipment", label: "Mu Safety Equipment", type: "vendor", score: 15, degree: 2 },
    // Approvers (employee type)
    { id: "e::Rajesh Mehta", label: "Rajesh Mehta", type: "employee", score: 62, degree: 5 },
    { id: "e::Priya Sharma", label: "Priya Sharma", type: "employee", score: 45, degree: 3 },
    { id: "e::Ankit Patel", label: "Ankit Patel", type: "employee", score: 70, degree: 4 },
    { id: "e::Sunita Rao", label: "Sunita Rao", type: "employee", score: 20, degree: 2 },
    { id: "e::Deepak Kumar", label: "Deepak Kumar", type: "employee", score: 30, degree: 2 },
    { id: "e::Meera Joshi", label: "Meera Joshi", type: "employee", score: 15, degree: 2 },
    { id: "e::Vikram Singh", label: "Vikram Singh", type: "employee", score: 18, degree: 1 },
    // Departments (account type)
    { id: "a::Refinery Maintenance", label: "Refinery Maintenance", type: "account", score: 55, degree: 4 },
    { id: "a::IT Infrastructure", label: "IT Infrastructure", type: "account", score: 48, degree: 2 },
    { id: "a::Plant Maintenance", label: "Plant Maintenance", type: "account", score: 60, degree: 2 },
    { id: "a::Supply Chain", label: "Supply Chain", type: "account", score: 22, degree: 2 },
    { id: "a::Chemical Processing", label: "Chemical Processing", type: "account", score: 15, degree: 1 },
    { id: "a::HSE Department", label: "HSE Department", type: "account", score: 12, degree: 2 },
    { id: "a::Power Plant", label: "Power Plant", type: "account", score: 10, degree: 1 },
    { id: "a::Electrical Maintenance", label: "Electrical Maintenance", type: "account", score: 14, degree: 1 },
    { id: "a::Civil Works", label: "Civil Works", type: "account", score: 58, degree: 1 },
  ],
  links: [
    // Vendor → Approver
    { source: "v::Alpha Industrial Supplies", target: "e::Rajesh Mehta" },
    { source: "v::Beta Tech Solutions", target: "e::Priya Sharma" },
    { source: "v::Gamma Engineering Works", target: "e::Ankit Patel" },
    { source: "v::Delta Logistics Pvt Ltd", target: "e::Sunita Rao" },
    { source: "v::Epsilon Chemicals Ltd", target: "e::Deepak Kumar" },
    { source: "v::Zeta Safety Solutions", target: "e::Meera Joshi" },
    { source: "v::Theta Industrial Works", target: "e::Rajesh Mehta" },   // shared approver → cluster!
    { source: "v::Iota Power Systems", target: "e::Vikram Singh" },
    { source: "v::Kappa Electricals", target: "e::Deepak Kumar" },
    { source: "v::Lambda Construction", target: "e::Ankit Patel" },       // shared approver → cluster!
    { source: "v::Mu Safety Equipment", target: "e::Meera Joshi" },
    // Vendor → Department
    { source: "v::Alpha Industrial Supplies", target: "a::Refinery Maintenance" },
    { source: "v::Beta Tech Solutions", target: "a::IT Infrastructure" },
    { source: "v::Gamma Engineering Works", target: "a::Plant Maintenance" },
    { source: "v::Delta Logistics Pvt Ltd", target: "a::Supply Chain" },
    { source: "v::Epsilon Chemicals Ltd", target: "a::Chemical Processing" },
    { source: "v::Zeta Safety Solutions", target: "a::HSE Department" },
    { source: "v::Theta Industrial Works", target: "a::Refinery Maintenance" },
    { source: "v::Iota Power Systems", target: "a::Power Plant" },
    { source: "v::Kappa Electricals", target: "a::Electrical Maintenance" },
    { source: "v::Lambda Construction", target: "a::Civil Works" },
    { source: "v::Mu Safety Equipment", target: "a::HSE Department" },
    // Approver → Department (shows authority chain)
    { source: "e::Rajesh Mehta", target: "a::Refinery Maintenance" },
    { source: "e::Priya Sharma", target: "a::IT Infrastructure" },
    { source: "e::Ankit Patel", target: "a::Plant Maintenance" },
    { source: "e::Ankit Patel", target: "a::Civil Works" },
    { source: "e::Sunita Rao", target: "a::Supply Chain" },
    { source: "e::Deepak Kumar", target: "a::Chemical Processing" },
    { source: "e::Deepak Kumar", target: "a::Electrical Maintenance" },
    { source: "e::Meera Joshi", target: "a::HSE Department" },
    { source: "e::Vikram Singh", target: "a::Power Plant" },
    // Suspicious cross-link (Alpha and Theta share bank details pattern)
    { source: "v::Alpha Industrial Supplies", target: "v::Theta Industrial Works" },
  ],
};

// ─── Data Studio pre-computed stats ───────────────────────────────────────────
export function getDemoDataStudioStats() {
  const totalRows = LEDGER_ROWS.length;
  let missingValues = 0;
  const columnStats = LEDGER_HEADERS.map((col, colIdx) => {
    const values = LEDGER_ROWS.map(r => r[colIdx]);
    const missing = values.filter(v => v === null || v === undefined || v === "").length;
    missingValues += missing;
    const unique = new Set(values.filter(v => v !== null && v !== undefined && v !== "")).size;
    const clean = values.filter(v => v !== null && v !== undefined && v !== "");
    const numCount = clean.filter(v => !isNaN(Number(v)) && String(v).trim() !== "").length;
    const dateCount = clean.filter(v => !isNaN(Date.parse(v)) && isNaN(Number(v))).length;
    const type = numCount / clean.length > 0.8 ? "Number" : dateCount / clean.length > 0.6 ? "Date" : "Text";
    return { col, type, missing, unique, total: totalRows };
  });
  return { totalRows, missingValues, columns: LEDGER_HEADERS.length, columnStats };
}

// ─── Helper: check if demo is configured ──────────────────────────────────────
export function isDemoConfigured() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("auditConfigured") === "true";
}

export function setDemoConfigured(config) {
  if (typeof window === "undefined") return;
  localStorage.setItem("auditConfigured", "true");
  localStorage.setItem("auditDomain", config.domain);
  localStorage.setItem("auditType", config.auditType);
  localStorage.setItem("auditCompany", config.company);
  localStorage.setItem("auditYear", String(config.year));
  localStorage.setItem("auditWorkspace", config.workspace);
}

export function getAuditConfig() {
  if (typeof window === "undefined") return AUDIT_CONFIG;
  if (!isDemoConfigured()) return AUDIT_CONFIG;
  return {
    domain: localStorage.getItem("auditDomain") || AUDIT_CONFIG.domain,
    auditType: localStorage.getItem("auditType") || AUDIT_CONFIG.auditType,
    company: localStorage.getItem("auditCompany") || AUDIT_CONFIG.company,
    year: parseInt(localStorage.getItem("auditYear") || AUDIT_CONFIG.year, 10),
    workspace: localStorage.getItem("auditWorkspace") || AUDIT_CONFIG.workspace,
  };
}

export function clearDemoConfig() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auditConfigured");
  localStorage.removeItem("auditDomain");
  localStorage.removeItem("auditType");
  localStorage.removeItem("auditCompany");
  localStorage.removeItem("auditYear");
  localStorage.removeItem("auditWorkspace");
}
