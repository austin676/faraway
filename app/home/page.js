"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar, { DatabaseIcon, PipelineIcon, SearchIcon, GraphIcon, DashboardIcon, AIIcon } from "../components/Sidebar";
import { colors, styles } from "../theme";
import { AUDIT_CONFIG, DEMO_FILE_NAME, isDemoConfigured, setDemoConfigured, clearDemoConfig } from "../data/dummyData";

// ─── Domain & Audit-Type options ──────────────────────────────────────────────
const DOMAINS = [
  { value: "Industrial & Manufacturing", label: "Industrial & Manufacturing", desc: "Oil & gas, refinery, plant operations" },
  { value: "Banking & Financial Services", label: "Banking & Financial Services", desc: "Banks, insurance, investment firms" },
  { value: "Healthcare & Pharma", label: "Healthcare & Pharma", desc: "Hospitals, pharma procurement" },
  { value: "Retail & E-commerce", label: "Retail & E-commerce", desc: "Supply chain, vendor payments" },
  { value: "Government & Public Sector", label: "Government & Public Sector", desc: "Public procurement, tenders" },
];

const AUDIT_TYPES = [
  { value: "Procurement & Vendor Payments", label: "Procurement & Vendor Payments" },
  { value: "Revenue Recognition", label: "Revenue Recognition" },
  { value: "Capital Expenditure", label: "Capital Expenditure" },
  { value: "Compliance & Regulatory", label: "Compliance & Regulatory" },
  { value: "Inventory & Asset Audit", label: "Inventory & Asset Audit" },
];

const MODULES = [
  {
    title: "Data Studio",
    description: "Upload and manage financial datasets with intelligent schema detection",
    color: colors.moduleData,
    icon: DatabaseIcon,
    href: "/datastudio",
  },
  {
    title: "Pipeline Builder",
    description: "Create and manage AI-powered audit workflows with visual pipeline design",
    color: colors.modulePipeline,
    icon: PipelineIcon,
    href: "/pipeline",
  },
  {
    title: "Investigation Studio",
    description: "Explore anomalies and flagged transactions with AI explanations",
    color: colors.moduleInvestigation,
    icon: SearchIcon,
    href: "/investigation",
  },
  {
    title: "Graph Analysis",
    description: "Visualize financial relationships and detect fraud patterns",
    color: colors.moduleGraph,
    icon: GraphIcon,
    href: "/graph",
  },
  {
    title: "Dashboards",
    description: "Visual analytics and risk metrics for comprehensive audit insights",
    color: colors.moduleDashboard,
    icon: DashboardIcon,
    href: "#",
  },
  {
    title: "AI Assistant",
    description: "Query audit data using natural language and get intelligent insights",
    color: colors.moduleAI,
    icon: AIIcon,
    href: "#",
  },
];

function ArrowRight() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="32" height="32" fill="none" stroke={colors.textMuted} strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default function HomePage() {
  const [configured, setConfigured] = useState(false);
  const [domain, setDomain] = useState(AUDIT_CONFIG.domain);
  const [auditType, setAuditType] = useState(AUDIT_CONFIG.auditType);
  const [company, setCompany] = useState(AUDIT_CONFIG.company);
  const [year, setYear] = useState(AUDIT_CONFIG.year);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    setConfigured(isDemoConfigured());
  }, []);

  const handleStartAudit = () => {
    const workspace = `${company.split(" ").slice(0, 2).join(" ")} ${auditType.split(" ")[0]} Audit ${year}`;
    setDemoConfigured({ domain, auditType, company, year, workspace });
    setConfigured(true);
  };

  const handleReset = () => {
    clearDemoConfig();
    setConfigured(false);
    setDomain(AUDIT_CONFIG.domain);
    setAuditType(AUDIT_CONFIG.auditType);
    setCompany(AUDIT_CONFIG.company);
    setYear(AUDIT_CONFIG.year);
    setFile(null);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };

  return (
    <div style={styles.pageWrapper}>
      <Sidebar activePage="Home" />

      <main style={styles.mainColumn}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Audit Analytics Platform</h1>
            <p style={styles.headerSubtitle}>Access powerful tools for comprehensive audit analysis and investigation</p>
          </div>
          {configured && (
            <button onClick={handleReset} style={{ background: "none", border: `1px solid ${colors.border}`, padding: "7px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: colors.textSecondary, fontFamily: "inherit" }}>
              New Audit
            </button>
          )}
        </header>

        <div style={styles.contentArea}>

          {/* ── Setup Card (shown when NOT configured) ── */}
          {!configured && (
            <div style={{ background: colors.bgSurface, border: `1px solid ${colors.border}`, marginBottom: "28px" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ fontWeight: "700", fontSize: "16px", color: colors.textPrimary, marginBottom: "3px" }}>Configure New Audit</div>
                <div style={{ fontSize: "13px", color: colors.textSecondary }}>Select the domain and audit type, then upload your financial data to begin</div>
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "22px" }}>

                {/* Row 1: Domain + Audit Type */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Industry Domain</label>
                    <select value={domain} onChange={e => setDomain(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: `1px solid ${colors.border}`, background: colors.bgSubtle, fontSize: "13.5px", fontFamily: "inherit", color: colors.textPrimary, cursor: "pointer" }}>
                      {DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Audit Type</label>
                    <select value={auditType} onChange={e => setAuditType(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: `1px solid ${colors.border}`, background: colors.bgSubtle, fontSize: "13.5px", fontFamily: "inherit", color: colors.textPrimary, cursor: "pointer" }}>
                      {AUDIT_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Company + Year */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div style={{ flex: 2, minWidth: "220px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Company / Entity Name</label>
                    <input value={company} onChange={e => setCompany(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: `1px solid ${colors.border}`, background: colors.bgSubtle, fontSize: "13.5px", fontFamily: "inherit", color: colors.textPrimary }} />
                  </div>
                  <div style={{ flex: 1, minWidth: "120px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Audit Year</label>
                    <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", border: `1px solid ${colors.border}`, background: colors.bgSubtle, fontSize: "13.5px", fontFamily: "inherit", color: colors.textPrimary }} />
                  </div>
                </div>

                {/* Row 3: Upload */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Upload Financial Data</label>
                  <div
                    className={`home-drop${dragOver ? " over" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    style={{ border: `2px dashed ${dragOver ? colors.teal : colors.border}`, background: dragOver ? colors.tealAlpha : colors.bgSubtle, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {file ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <CheckCircle />
                        <span style={{ fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>{file.name}</span>
                      </div>
                    ) : (
                      <>
                        <UploadIcon />
                        <div style={{ fontWeight: "600", fontSize: "14px", color: colors.textPrimary }}>Drop Excel / CSV ledger + invoices here</div>
                        <div style={{ fontSize: "12px", color: colors.textMuted }}>Supports .xlsx, .csv, .pdf — or click to browse</div>
                      </>
                    )}
                    <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.pdf" multiple style={{ display: "none" }} onChange={e => { if (e.target.files[0]) setFile(e.target.files[0]); }} />
                  </div>
                </div>

                {/* Begin button */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <button onClick={handleStartAudit} style={{ ...styles.btnPrimary, background: colors.teal, padding: "12px 32px" }}>
                    Begin Audit Analysis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Active Audit Summary (shown when configured) ── */}
          {configured && (
            <div style={{ background: colors.tealAlpha, borderLeft: `3px solid ${colors.teal}`, padding: "14px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <CheckCircle />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "14px", color: colors.textPrimary }}>
                  Audit Configured — {localStorage.getItem("auditWorkspace") || AUDIT_CONFIG.workspace}
                </div>
                <div style={{ fontSize: "12px", color: colors.textSecondary, marginTop: "2px" }}>
                  {localStorage.getItem("auditDomain") || AUDIT_CONFIG.domain} · {localStorage.getItem("auditType") || AUDIT_CONFIG.auditType} · {localStorage.getItem("auditCompany") || AUDIT_CONFIG.company}
                </div>
              </div>
              <span style={{ fontSize: "12px", color: colors.teal, fontWeight: "600" }}>All modules are pre-loaded with analysis</span>
            </div>
          )}

          {/* ── Modules ── */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={styles.sectionLabel}>Modules</h2>
            <div style={styles.accentBar} />
          </div>

          <div className="module-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {MODULES.map(({ title, description, color, icon: Icon, href }) => (
              <a
                key={title}
                href={href}
                className="module-card"
                style={{
                  background: colors.bgSurface,
                  border: `1px solid ${colors.border}`,
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  position: "relative",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color }} />
                <div style={{ width: "44px", height: "44px", background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#fff", borderRadius: "4px" }}>
                  <Icon />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: colors.textPrimary, letterSpacing: "0.01em" }}>{title}</h3>
                <p style={{ margin: "0 0 20px", fontSize: "13px", color: colors.textSecondary, lineHeight: "1.6", flex: 1 }}>{description}</p>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: colors.textPrimary, fontSize: "13px", fontWeight: "600", letterSpacing: "0.02em" }}>
                  Open Module <ArrowRight />
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .module-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .module-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}