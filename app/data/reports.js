/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  AI-GENERATED AUDIT REPORTS — Markdown Content
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  Seven reports, each stored as a Markdown string.
 *  All data is consistent with dummyData.js (Reliance Industrial Operations).
 */

export const REPORT_META = [
  {
    id: "executive-summary",
    title: "Audit Executive Summary",
    description: "High-level overview of findings, risk indicators, and recommended actions",
    icon: "summary",
    color: "#00BFA5",
    pages: ["/pipeline"],
  },
  {
    id: "anomaly-detection",
    title: "Anomaly Detection Report",
    description: "Detailed breakdown of all flagged transactions with AI reasoning",
    icon: "anomaly",
    color: "#DC2626",
    pages: ["/investigation"],
  },
  {
    id: "vendor-risk",
    title: "Vendor Risk Assessment",
    description: "Vendor-by-vendor risk analysis with concentration and pattern insights",
    icon: "vendor",
    color: "#F59E0B",
    pages: ["/investigation"],
  },
  {
    id: "invoice-verification",
    title: "Invoice Verification Report",
    description: "Cross-document validation of invoices against ledger entries",
    icon: "invoice",
    color: "#3B82F6",
    pages: ["/datastudio"],
  },
  {
    id: "graph-network",
    title: "Graph / Network Analysis",
    description: "Vendor-approver relationship clusters and conflict-of-interest patterns",
    icon: "graph",
    color: "#059669",
    pages: ["/graph"],
  },
  {
    id: "approval-workflow",
    title: "Approval Workflow Compliance",
    description: "Missing approvals, approval concentration, and override analysis",
    icon: "approval",
    color: "#7C3AED",
    pages: ["/investigation"],
  },
  {
    id: "data-quality",
    title: "Data Quality & Normalization",
    description: "Schema extraction, data completeness, and standardization results",
    icon: "quality",
    color: "#0EA5E9",
    pages: ["/datastudio", "/pipeline"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Report 1 : Executive Summary
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_EXECUTIVE_SUMMARY = `# Audit Executive Summary Report

**Company:** Reliance Industrial Operations
**Audit Period:** Feb – Apr 2025
**Audit System:** AI Automated Ledger Analysis
**Generated:** ${new Date().toLocaleDateString("en-IN")}

---

## Overview

The AI audit engine analyzed financial transactions and supporting documents across procurement, vendor payments, and approval workflows for Reliance Industrial Operations.

### Key Statistics

| Metric | Value |
|---|---|
| Total Transactions Analyzed | 20 |
| Total Flagged Transactions | 8 |
| High Risk | 4 |
| Medium Risk | 4 |
| Total Flagged Financial Exposure | ₹29,37,050 |
| Vendors Analyzed | 11 |
| Approvers Reviewed | 7 |

---

## Major Risk Indicators

### 1. Duplicate Invoice Risk (Critical)

Invoice **INV-4520** from Beta Tech Solutions for **₹1,77,000** is an **exact duplicate** of INV-3312 dated 14-Feb-2025. Both invoices reference identical line items (Server Rack Unit ×2, Network Switch 24-port ×5) with matching subtotals, tax amounts, and final payment. Same approver (Priya Sharma) authorized both.

### 2. Vendor Concentration Risk (High)

Vendor **Alpha Industrial Supplies (VND-2041)** submitted **4 invoices** totalling **₹9,49,640** within 6 weeks — representing **20% of total procurement spend**. All transactions approved by the same individual (Rajesh Mehta).

### 3. Approval Workflow Weakness (High)

Two transactions (**INV-5360**, **INV-5570**) were found with **no approver** on record. Combined value of unapproved transactions: **₹1,45,000**.

### 4. Round-Number Payment Patterns (High)

Four transactions with exact round-number amounts detected:
- INV-4310: **₹5,00,000** (Alpha Industrial Supplies)
- INV-4835: **₹2,00,000** (Theta Industrial Works)
- INV-5465: **₹10,00,000** (Lambda Construction)
- INV-5570: **₹1,00,000** (Alpha Industrial Supplies)

### 5. Payment Spike (High)

**Gamma Engineering Works** received **₹12,00,000** (INV-4730) — a **489% increase** over their previous transaction of ₹2,45,160. No corresponding change in project scope found.

---

## Recommended Actions

1. **Immediate:** Freeze payment on INV-4520 (duplicate invoice). Notify accounts payable and initiate vendor verification for Beta Tech Solutions.
2. **Urgent:** Review all Alpha Industrial Supplies invoices — verify competitive bidding and contract terms for valve/seal procurement.
3. **High Priority:** Obtain proper authorization for INV-5360 and INV-5570 before processing payment.
4. **Investigation:** Cross-reference Gamma Engineering's INV-4730 (₹12L compressor overhaul) with purchase orders and obtain supporting documentation.
5. **Governance:** Review Rajesh Mehta's approval authority — single approver for ₹9,49,640 in vendor payments raises conflict-of-interest concerns.
6. **Policy:** Implement dual-approval requirement for transactions exceeding ₹5,00,000.

---

## Conclusion

The AI audit platform identified **8 anomalies** across **20 transactions** with a combined flagged exposure of **₹29,37,050** (59.4% of total spend). Immediate attention is required for the duplicate invoice (INV-4520) and missing approval records. The vendor concentration pattern with Alpha Industrial Supplies warrants a dedicated procurement review.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Report 2 : Anomaly Detection
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_ANOMALY_DETECTION = `# Anomaly Detection Report

**Company:** Reliance Industrial Operations
**Audit Period:** Feb – Apr 2025
**Detection Engine:** Statistical + Rule-Based + Graph Centrality

---

## Flagged Transactions Summary

| Invoice | Vendor | Amount | Flag Type | Risk Score |
|---|---|---|---|---|
| INV-4520 | Beta Tech Solutions | ₹1,77,000 | Duplicate Invoice | 95 |
| INV-4730 | Gamma Engineering Works | ₹12,00,000 | Abnormal Payment Spike | 88 |
| INV-5465 | Lambda Construction | ₹10,00,000 | Round-Number + High Value | 85 |
| INV-4310 | Alpha Industrial Supplies | ₹5,00,000 | Round-Number + Vendor Pattern | 82 |
| INV-5570 | Alpha Industrial Supplies | ₹1,00,000 | Missing Approval + Round Number | 76 |
| INV-4001 | Alpha Industrial Supplies | ₹1,15,050 | Near-Duplicate Pattern | 72 |
| INV-5360 | Beta Tech Solutions | ₹45,000 | Missing Documentation | 68 |
| INV-4835 | Theta Industrial Works | ₹2,00,000 | Round-Number Transaction | 65 |

---

## Detailed AI Reasoning

### INV-4520 — Duplicate Invoice (Risk: 95)

**CRITICAL:** Invoice INV-4520 from Beta Tech Solutions for ₹1,77,000 is an EXACT DUPLICATE of INV-3312 dated 14-Feb-2025. Both invoices reference identical line items (Server Rack Unit ×2, Network Switch 24-port ×5) with matching subtotals, tax amounts, and final payment. Same approver (Priya Sharma) authorized both.

**Detection Method:** Hash-based invoice fingerprinting
**Confidence Score:** 0.98
**Action Required:** Freeze payment, notify accounts payable, initiate vendor verification

---

### INV-4730 — Abnormal Payment Spike (Risk: 88)

**HIGH RISK:** Transaction INV-4730 from Gamma Engineering Works for ₹12,00,000 represents a **489% increase** over their previous transaction of ₹2,45,160 (INV-4102). This payment spike is statistically anomalous (>3σ from vendor mean). No corresponding change in project scope was found for PRJ-RIL-310.

**Detection Method:** Z-score outlier analysis (σ = 3.2)
**Confidence Score:** 0.94
**Action Required:** Obtain supporting documentation for compressor overhaul scope

---

### INV-5465 — Round-Number + New Vendor (Risk: 85)

**HIGH RISK:** Invoice INV-5465 from Lambda Construction for exactly ₹10,00,000 exhibits a suspicious round-number pattern. This is the FIRST AND ONLY transaction from this vendor, making baseline comparison impossible. Approver Ankit Patel also authorized the anomalous Gamma Engineering payment.

**Detection Method:** Round-number filter + vendor history check
**Confidence Score:** 0.91
**Action Required:** Verify vendor registration, contract terms, obtain site inspection reports

---

### INV-4310 — Round-Number + Vendor Pattern (Risk: 82)

**HIGH RISK:** Alpha Industrial Supplies (VND-2041) submitted this invoice for exactly ₹5,00,000 — a known indicator of negotiated or fabricated invoices. Combined with high transaction frequency (4 invoices in 6 weeks) and the near-duplicate pattern detected in INV-4001, this warrants immediate procurement department review.

**Detection Method:** Benford's Law analysis + vendor frequency scoring
**Confidence Score:** 0.89
**Action Required:** Verify contract terms, compare against market rates

---

### INV-5570 — Missing Approval + Round Number (Risk: 76)

This is the 4th invoice from Alpha Industrial Supplies — total vendor exposure now ₹9,49,640. Amount of exactly ₹1,00,000 with NO APPROVER on record. Combined risk factors: vendor concentration, round amount, missing authorization, similar descriptions across invoices.

**Detection Method:** Approval chain validation + composite scoring
**Confidence Score:** 0.85

---

### INV-4001 — Near-Duplicate Pattern (Risk: 72)

Invoice INV-4001 from Alpha Industrial Supplies for ₹1,15,050 closely mirrors INV-2045 (₹1,16,590) — same vendor, same department, similar description ('Seal Kit'), only 6 days apart. The 1.3% amount difference may indicate a split invoice or re-submission.

**Detection Method:** Fuzzy matching on line items + temporal proximity
**Confidence Score:** 0.82

---

### INV-5360 — Missing Documentation (Risk: 68)

Invoice INV-5360 from Beta Tech Solutions for ₹45,000 has NO APPROVER recorded. All transactions require authorized approval per company procurement policy. This vendor already has a flagged duplicate invoice (INV-4520).

**Detection Method:** Mandatory field validation
**Confidence Score:** 0.88

---

### INV-4835 — Round-Number Transaction (Risk: 65)

₹2,00,000 from Theta Industrial Works is an exact round number. Approver Rajesh Mehta also approves Alpha Industrial Supplies invoices — review for potential conflict of interest.

**Detection Method:** Round-number filter + approver overlap analysis
**Confidence Score:** 0.78
`;

// ─────────────────────────────────────────────────────────────────────────────
// Report 3 : Vendor Risk Assessment
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_VENDOR_RISK = `# Vendor Risk Assessment Report

**Company:** Reliance Industrial Operations
**Audit Period:** Feb – Apr 2025
**Vendors Analyzed:** 11

---

## Vendor Risk Overview

| Vendor | Risk Score | Risk Type | Total Spend |
|---|---|---|---|
| Alpha Industrial Supplies | 78 | Concentration Risk | ₹9,49,640 |
| Beta Tech Solutions | 72 | Duplicate Invoice Pattern | ₹3,99,000 |
| Gamma Engineering Works | 82 | Payment Spike | ₹17,00,160 |
| Lambda Construction | 75 | Round-Number + New Vendor | ₹10,00,000 |
| Theta Industrial Works | 58 | Round-Number + Shared Approver | ₹2,00,000 |
| Delta Logistics Pvt Ltd | 32 | Low Risk | ₹1,81,499 |
| Epsilon Chemicals Ltd | 25 | Low Risk | ₹1,45,200 |
| Zeta Safety Solutions | 20 | Low Risk | ₹67,800 |
| Iota Power Systems | 22 | Low Risk | ₹3,40,500 |
| Kappa Electricals | 18 | Low Risk | ₹78,400 |
| Mu Safety Equipment | 15 | Low Risk | ₹1,56,300 |

---

## Detailed Vendor Analysis

### Alpha Industrial Supplies (VND-2041) — Risk: HIGH

**GST:** 27AAACI1234K1Z5
**Department:** Refinery Maintenance
**Total Invoices:** 4
**Total Spend:** ₹9,49,640
**Concentration Ratio:** 20% of total procurement

#### Risk Factors

- **Vendor Concentration:** 4 invoices in 6 weeks — highest frequency among all vendors
- **Round-Number Payment:** INV-4310 for exactly ₹5,00,000 and INV-5570 for ₹1,00,000
- **Missing Approval:** INV-5570 has no approver on record
- **Near-Duplicate:** INV-4001 (₹1,15,050) closely mirrors INV-2045 (₹1,16,590) — same items, 1.3% variance
- **Single Approver:** All transactions approved by Rajesh Mehta

#### Recommendation
Conduct vendor audit. Verify competitive bidding process. Review Rajesh Mehta's approval authority for this vendor.

---

### Beta Tech Solutions (VND-2088) — Risk: HIGH

**GST:** 27BBBCI9876M1Z2
**Department:** IT Infrastructure
**Total Invoices:** 3
**Total Spend:** ₹3,99,000

#### Risk Factors

- **Duplicate Invoice:** INV-4520 is an EXACT DUPLICATE of INV-3312 — identical line items, amounts, and tax
- **Missing Approval:** INV-5360 (₹45,000) has no approver recorded
- **Payment Pattern:** Two identical ₹1,77,000 payments within 17 days

#### Recommendation
Freeze INV-4520 payment. Verify with vendor whether duplicate was intentional. Obtain approval for INV-5360.

---

### Gamma Engineering Works (VND-2055) — Risk: HIGH

**GST:** 27CCCGI5432J1Z8
**Department:** Plant Maintenance
**Total Invoices:** 3
**Total Spend:** ₹17,00,160

#### Risk Factors

- **Payment Spike:** INV-4730 (₹12,00,000) is a 489% increase over INV-4102 (₹2,45,160)
- **High-Value Concentration:** Single transaction accounts for 70% of vendor's total spend
- **Approver Overlap:** Ankit Patel also approves Lambda Construction (another flagged vendor)

#### Recommendation
Obtain detailed scope documentation for INV-4730 compressor overhaul. Verify against original contract terms.

---

### Lambda Construction (VND-2115) — Risk: HIGH

**GST:** 27LLLCI7890B1Z5
**Department:** Civil Works
**Total Invoices:** 1
**Total Spend:** ₹10,00,000

#### Risk Factors

- **New Vendor:** First and only transaction — no baseline exists
- **Round-Number Payment:** Exact ₹10,00,000
- **Approver Overlap:** Ankit Patel also approved Gamma Engineering's anomalous ₹12L payment
- **High Value:** Single transaction in top 3 by amount

#### Recommendation
Verify vendor registration and business legitimacy. Obtain site inspection reports for warehouse extension work. Review Ankit Patel's approval authority.

---

### Theta Industrial Works (VND-2095) — Risk: MEDIUM

**Total Spend:** ₹2,00,000
**Risk:** Round-number payment with shared approver (Rajesh Mehta also approves Alpha Industrial)

---

## Low-Risk Vendors (Compliant)

Delta Logistics, Epsilon Chemicals, Zeta Safety, Iota Power Systems, Kappa Electricals, and Mu Safety Equipment all show normal transaction patterns with proper approvals and market-rate pricing. No further action required.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Report 4 : Invoice Verification
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_INVOICE_VERIFICATION = `# Invoice Verification Report

**Company:** Reliance Industrial Operations
**Audit Period:** Feb – Apr 2025
**Documents Verified:** 2 invoices cross-referenced against 20 ledger entries

---

## Cross-Document Validation

The AI system compared uploaded invoice documents (INV-2045, INV-3312) against all 20 procurement ledger entries to verify consistency.

---

## Invoice INV-2045

**Vendor:** Alpha Industrial Supplies (VND-2041)
**Date:** 12-Feb-2025
**Department:** Refinery Maintenance
**Project Code:** PRJ-RIL-224

### Line Items

| Item | Quantity | Unit Price (INR) | Subtotal (INR) |
|---|---|---|---|
| Pipeline Valve Replacement | 4 | 18,000 | 72,000 |
| Industrial Seal Kit | 3 | 9,500 | 28,500 |

### Financial Verification

| Field | Invoice Value | Ledger Value | Match |
|---|---|---|---|
| Subtotal | ₹1,00,500 | ₹1,00,500 | ✅ Match |
| Tax (18% GST) | ₹18,090 | ₹18,090 | ✅ Match |
| Discount | ₹2,000 | ₹2,000 | ✅ Match |
| Final Payment | ₹1,16,590 | ₹1,16,590 | ✅ Match |
| Vendor GST | 27AAACI1234K1Z5 | 27AAACI1234K1Z5 | ✅ Match |

### Tax Calculation Verification

Expected Tax: ₹1,00,500 × 18% = **₹18,090** → ✅ Correct

### Result: **MATCH CONFIRMED**

**However:** This vendor (Alpha Industrial) has 3 additional invoices with similar line items (seal kits, valve fittings). INV-4001 for ₹1,15,050 is a near-duplicate — cross-reference with purchase orders recommended.

---

## Invoice INV-3312

**Vendor:** Beta Tech Solutions (VND-2088)
**Date:** 14-Feb-2025
**Department:** IT Infrastructure
**Project Code:** PRJ-RIL-881

### Line Items

| Item | Quantity | Unit Price (INR) | Subtotal (INR) |
|---|---|---|---|
| Server Rack Unit | 2 | 45,000 | 90,000 |
| Network Switch 24-port | 5 | 12,000 | 60,000 |

### Financial Verification

| Field | Invoice Value | Ledger Value | Match |
|---|---|---|---|
| Subtotal | ₹1,50,000 | ₹1,50,000 | ✅ Match |
| Tax (18% GST) | ₹27,000 | ₹27,000 | ✅ Match |
| Discount | ₹0 | ₹0 | ✅ Match |
| Final Payment | ₹1,77,000 | ₹1,77,000 | ✅ Match |
| Vendor GST | 27BBBCI9876M1Z2 | 27BBBCI9876M1Z2 | ✅ Match |

### Tax Calculation Verification

Expected Tax: ₹1,50,000 × 18% = **₹27,000** → ✅ Correct

### Result: **VALID — but DUPLICATE DETECTED**

**CRITICAL FINDING:** Invoice INV-4520 (dated 03-Mar-2025) is an exact copy of this invoice — identical vendor, line items, quantities, subtotal, tax, and final payment. This constitutes duplicate billing and requires immediate investigation.

---

## Verification Summary

| Invoice | Vendor | Amount | Ledger Match | Issues |
|---|---|---|---|---|
| INV-2045 | Alpha Industrial Supplies | ₹1,16,590 | ✅ Verified | Near-duplicate INV-4001 flagged |
| INV-3312 | Beta Tech Solutions | ₹1,77,000 | ✅ Verified | Exact duplicate INV-4520 detected |
`;

// ─────────────────────────────────────────────────────────────────────────────
// Report 5 : Graph / Network Analysis
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_GRAPH_NETWORK = `# Graph / Network Analysis Report

**Company:** Reliance Industrial Operations
**Audit Period:** Feb – Apr 2025
**Graph:** 27 nodes, 32 edges

---

## Vendor–Approver Network

The AI system created a relationship graph connecting vendors (11), approving employees (7), and departments (9) based on transaction data.

### Network Statistics

| Metric | Value |
|---|---|
| Total Nodes | 27 |
| Total Edges | 32 |
| Vendor Nodes | 11 |
| Approver Nodes | 7 |
| Department Nodes | 9 |
| High-Risk Clusters | 2 |
| Isolated Nodes | 0 |

---

## High-Risk Cluster 1: Shared Approver Pattern

\`\`\`
Alpha Industrial Supplies (VND-2041)
         ↕
    Rajesh Mehta (Approver)
         ↕
  Theta Industrial Works (VND-2095)
         ↕
   Refinery Maintenance (Department)
\`\`\`

### Pattern Analysis

- **Rajesh Mehta** approves invoices for **both** Alpha Industrial Supplies and Theta Industrial Works
- Both vendors supply to the **same department** (Refinery Maintenance)
- Alpha Industrial has **4 invoices** with concentration risk (₹9,49,640)
- Theta Industrial has a **round-number payment** (₹2,00,000)
- Connected via shared approver and shared department → potential **conflict of interest**

### Risk Score: **62** (Approver) / **78** (Alpha) / **58** (Theta)

---

## High-Risk Cluster 2: High-Value Approval Concentration

\`\`\`
Gamma Engineering Works (VND-2055)
         ↕
    Ankit Patel (Manager)
         ↕
  Lambda Construction (VND-2115)
         ↕
  Plant Maintenance + Civil Works
\`\`\`

### Pattern Analysis

- **Ankit Patel** approved **both** the highest single transactions in the dataset:
  - Gamma Engineering: **₹12,00,000** (489% payment spike)
  - Lambda Construction: **₹10,00,000** (round-number, new vendor)
- Combined approved amount: **₹22,00,000** — representing **44.5%** of total spend
- Lambda Construction is a **new vendor** with no transaction history
- Both transactions are independently flagged as high risk

### Risk Score: **70** (Approver) / **82** (Gamma) / **75** (Lambda)

---

## Cross-Cluster Observations

- **No direct link** between Cluster 1 and Cluster 2 vendors
- **Beta Tech Solutions** operates independently but has a duplicate invoice
- **Low-risk vendors** (Delta, Epsilon, Zeta, Iota, Kappa, Mu) show clean graph patterns with proper 1:1 vendor-approver relationships

---

## Risk Insight

Two clusters show potential **conflict-of-interest patterns**:

1. **Cluster 1:** Single approver (Rajesh Mehta) managing multiple vendors in the same department creates opportunity for vendor favoritism
2. **Cluster 2:** Single approver (Ankit Patel) authorizing ₹22L across two flagged vendors suggests inadequate segregation of approval duties

**Recommendation:** Implement dual-approval requirement for high-value transactions and rotate approver assignments across vendor relationships.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Report 6 : Approval Workflow Compliance
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_APPROVAL_WORKFLOW = `# Approval Workflow Compliance Report

**Company:** Reliance Industrial Operations
**Audit Period:** Feb – Apr 2025
**Transactions Reviewed:** 20
**Policy Framework:** RIL Procurement Authorization Policy (PAP-2024)

---

## Missing Approvals

The following transactions were found without proper authorization:

| Invoice | Vendor | Amount | Issue | Status |
|---|---|---|---|---|
| INV-5360 | Beta Tech Solutions | ₹45,000 | No approval record | Pending |
| INV-5570 | Alpha Industrial Supplies | ₹1,00,000 | No approval record | Pending |

**Combined unapproved amount: ₹1,45,000**

### INV-5360 Details

- **Date:** 22-Mar-2025
- **Description:** Network Cabling + Patch Panel Installation
- **Vendor:** Beta Tech Solutions (also flagged for duplicate invoice)
- **Issue:** Approval field is blank. No digital or manual authorization found
- **Risk:** This vendor already has a duplicate invoice flag (INV-4520) — missing approval compounds the risk

### INV-5570 Details

- **Date:** 28-Mar-2025
- **Description:** Valve + Fitting Supply Replenishment
- **Vendor:** Alpha Industrial Supplies (4th invoice from this vendor)
- **Issue:** Approval field is blank. Round-number amount (₹1,00,000) without authorization
- **Risk:** High-frequency vendor with round-number pattern and no approval on this transaction

---

## Approval Concentration Analysis

| Approver | Transactions | Total Approved | Risk |
|---|---|---|---|
| Rajesh Mehta | 5 | ₹9,49,640 | ⚠️ High — single-point authority |
| Ankit Patel | 4 | ₹27,00,160 | ⚠️ High — high-value concentration |
| Priya Sharma | 2 | ₹3,54,000 | Medium — duplicate invoice approved |
| Sunita Rao | 2 | ₹1,81,499 | ✅ Low |
| Deepak Kumar | 2 | ₹2,23,600 | ✅ Low |
| Meera Joshi | 2 | ₹2,24,100 | ✅ Low |
| Vikram Singh | 1 | ₹3,40,500 | ✅ Low |

### Rajesh Mehta — Approval Risk

- Approved **5 transactions** totalling **₹9,49,640**
- Sole approver for Alpha Industrial Supplies (4 invoices) and Theta Industrial Works
- No secondary approval or review for any transaction
- **Potential conflict:** Same approver for multiple vendors in same department

### Ankit Patel — Approval Risk

- Approved **4 transactions** totalling **₹27,00,160**
- Authorized the two highest individual payments:
  - Gamma Engineering: ₹12,00,000 (payment spike)
  - Lambda Construction: ₹10,00,000 (new vendor, round number)
- **45%** of total procurement value approved by one individual

---

## Policy Compliance Summary

| Policy Requirement | Status |
|---|---|
| All transactions require approver | ❌ 2 violations found |
| Dual approval for >₹5,00,000 | ❌ Not enforced — 3 transactions exceeded threshold with single approval |
| Approver cannot authorize own department spend | ⚠️ Requires review |
| Vendor rotation review quarterly | ⚠️ Not documented |
| Segregation of approval duties | ❌ Two approvers concentrate 73% of spend |

---

## Recommendations

1. **Immediately** obtain authorization for INV-5360 and INV-5570
2. **Enforce** dual-approval requirement for transactions exceeding ₹5,00,000
3. **Rotate** approver assignments to prevent vendor-approver concentration
4. **Implement** system controls to prevent payment processing without approval
5. **Review** Rajesh Mehta and Ankit Patel approval thresholds
`;

// ─────────────────────────────────────────────────────────────────────────────
// Report 7 : Data Quality & Normalization
// ─────────────────────────────────────────────────────────────────────────────
export const REPORT_DATA_QUALITY = `# Data Quality & Normalization Report

**Company:** Reliance Industrial Operations
**Source File:** RIL_Procurement_Ledger_2025.xlsx
**Rows:** 20 | **Columns:** 14

---

## Schema Extraction

The AI engine automatically detected and classified 14 columns from the uploaded dataset.

| Column | Detected Type | Unique Values |
|---|---|---|
| Invoice Number | Text | 20 |
| Invoice Date | Date | 20 |
| Vendor Name | Text | 11 |
| Vendor ID | Text | 11 |
| GST Number | Text | 11 |
| Department | Text | 8 |
| Project Code | Text | 9 |
| Item Description | Text | 19 |
| Subtotal (INR) | Number | 19 |
| Tax (INR) | Number | 19 |
| Discount (INR) | Number | 2 |
| Final Payment (INR) | Number | 19 |
| Approved By | Text | 7 |
| Payment Status | Text | 2 |

**Primary Key Candidate:** Invoice Number (20 unique values — 100% cardinality)

---

## Data Completeness

| Metric | Value |
|---|---|
| Total Cells | 280 |
| Filled Cells | 278 |
| Missing Values | 2 |
| Fill Rate | 99.3% |
| Quality Score | 96/100 |

### Missing Values

| Row | Column | Invoice |
|---|---|---|
| Row 16 | Approved By | INV-5360 |
| Row 18 | Approved By | INV-5570 |

Both missing values are in the **Approved By** field — these are the same transactions flagged for missing approval in the Approval Workflow Compliance Report.

---

## Standardization Applied

### Date Normalization

- **Input Format:** DD-MMM-YYYY (e.g., "12-Feb-2025")
- **Standardized:** ISO 8601 (2025-02-12)
- **All 20 dates** converted successfully

### Currency Standardization

- **Currency:** Indian Rupees (INR)
- **Comma separators** removed from numeric values
- **All amounts** stored as integers (paise precision not required)
- **Negative values:** Discount field in INV-2045 stored as positive with discount flag

### Text Normalization

- **Leading/trailing whitespace** trimmed from all text fields
- **Vendor names** standardized to title case
- **Department names** standardized to title case

---

## Schema Mapping

| Original Column | Standardized Key |
|---|---|
| Invoice Number | invoice_number |
| Invoice Date | invoice_date |
| Vendor Name | vendor_name |
| Vendor ID | vendor_id |
| GST Number | gst_number |
| Department | department |
| Project Code | project_code |
| Item Description | item_description |
| Subtotal (INR) | subtotal_inr |
| Tax (INR) | tax_inr |
| Discount (INR) | discount_inr |
| Final Payment (INR) | final_payment_inr |
| Approved By | approved_by |
| Payment Status | payment_status |

**Schema Version:** AuditSchema v2.1
**Compliance:** GAAP / IndAS compatible

---

## Data Integrity Checks

| Check | Result |
|---|---|
| Duplicate Invoice Detection | ✅ Enabled — 1 duplicate found (INV-4520) |
| Tax Calculation Validation | ✅ Enabled — all 18% GST calculations verified |
| Subtotal + Tax − Discount = Final | ✅ All 20 rows pass |
| Vendor ID ↔ GST cross-reference | ✅ All 11 vendors consistent |
| Date Range Validation | ✅ All dates within audit period |
| Schema Mapping Completeness | ✅ 14/14 columns mapped |
`;

// ─── Convenience map ─────────────────────────────────────────────────────────
export const REPORTS = {
  "executive-summary":   REPORT_EXECUTIVE_SUMMARY,
  "anomaly-detection":   REPORT_ANOMALY_DETECTION,
  "vendor-risk":         REPORT_VENDOR_RISK,
  "invoice-verification":REPORT_INVOICE_VERIFICATION,
  "graph-network":       REPORT_GRAPH_NETWORK,
  "approval-workflow":   REPORT_APPROVAL_WORKFLOW,
  "data-quality":        REPORT_DATA_QUALITY,
};
