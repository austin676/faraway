"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import Sidebar, { DatabaseIcon, DashboardIcon, ReportIcon } from "../components/Sidebar";
import { colors, styles as themeStyles } from "../theme";
import { isDemoConfigured, DEMO_FILE_NAME, LEDGER_HEADERS, LEDGER_ROWS, getDemoDataStudioStats } from "../data/dummyData";
import { REPORT_META } from "../data/reports";

// ─── Icons (page-specific) ────────────────────────────────────────────────────
function UploadIcon() {
  return (
    <svg width="38" height="38" fill="none" stroke="#94a3a0" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function CheckIcon({ size = 14, color = "#22c55e" }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function FileIcon({ color = "#4a9b8f" }) {
  return (
    <svg width="20" height="20" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  );
}
function WarnIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// ─── Data Helpers ─────────────────────────────────────────────────────────────
function detectType(values) {
  const clean = values.filter(v => v !== null && v !== undefined && v !== "");
  if (clean.length === 0) return "Unknown";
  const numCount = clean.filter(v => !isNaN(Number(v)) && String(v).trim() !== "").length;
  const dateCount = clean.filter(v => !isNaN(Date.parse(v)) && isNaN(Number(v))).length;
  if (numCount / clean.length > 0.8) return "Number";
  if (dateCount / clean.length > 0.6) return "Date";
  return "Text";
}

function analyzeData(rows, headers) {
  const totalRows = rows.length;
  let missingValues = 0;
  const columnStats = headers.map((col, colIdx) => {
    const values = rows.map(r => r[colIdx]);
    const missing = values.filter(v => v === null || v === undefined || v === "").length;
    missingValues += missing;
    const type = detectType(values);
    const unique = new Set(values.filter(v => v !== null && v !== undefined && v !== "")).size;
    return { col, type, missing, unique, total: totalRows };
  });
  return { totalRows, missingValues, columns: headers.length, columnStats };
}

// ─── Processing Loader ────────────────────────────────────────────────────────
function ProcessingLoader({ fileName }) {
  const steps = [
    "Reading file structure...",
    "Detecting schema & column types...",
    "Analyzing data quality...",
    "Finalizing results...",
  ];
  const [step, setStep] = useState(0);

  // Step through loading messages
  useState(() => {
    const interval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 380);
    return () => clearInterval(interval);
  });

  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div style={{
      background: colors.bgSurface,
      border: `1px solid ${colors.border}`,
      padding: "52px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "22px",
      marginBottom: "20px",
    }}>
      {/* Spinning ring */}
      <div style={{ position: "relative", width: "58px", height: "58px" }}>
        <div style={{
          position: "absolute", inset: 0,
          border: `3px solid ${colors.border}`,
          borderTop: `3px solid ${colors.teal}`,
          borderRadius: "50%",
          animation: "ds-spin 0.75s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: colors.teal,
        }}>
          <DatabaseIcon />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: "700", fontSize: "15px", color: colors.textPrimary, marginBottom: "7px" }}>
          Processing {fileName}
        </div>
        <div style={{ fontSize: "13px", color: colors.teal, fontWeight: "500", minHeight: "20px" }}>
          {steps[step]}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: "300px", height: "4px", background: colors.border }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: colors.teal,
          transition: "width 0.38s ease",
        }} />
      </div>

      <div style={{ fontSize: "12px", color: colors.textMuted }}>{progress}% complete</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DataStudio() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");
  const fileInputRef = useRef();

  // ── Auto-load demo data if configured ──
  useEffect(() => {
    if (isDemoConfigured() && !file && !data && !loading) {
      setFile({ name: DEMO_FILE_NAME });
      setData({ headers: LEDGER_HEADERS, rows: LEDGER_ROWS, stats: getDemoDataStudioStats() });
    }
  }, []);

  const processFile = useCallback(async (f) => {
    setLoading(true);
    setError(null);
    setData(null);
    setFile(f);

    // Guarantee at least 1.5s of loader so it feels considered
    const minDelay = new Promise(res => setTimeout(res, 1500));

    try {
      const arrayBuffer = await f.arrayBuffer();
      let workbook;
      if (f.name.endsWith(".csv")) {
        const text = new TextDecoder().decode(arrayBuffer);
        workbook = XLSX.read(text, { type: "string" });
      } else {
        workbook = XLSX.read(arrayBuffer, { type: "array" });
      }
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      if (!jsonData || jsonData.length < 2) throw new Error("File appears empty or has no data rows.");
      const headers = jsonData[0].map(String);
      const rows = jsonData.slice(1).filter(r => r.some(c => c !== ""));
      const stats = analyzeData(rows, headers);
      await minDelay;
      setData({ headers, rows, stats });
    } catch (e) {
      await minDelay;
      setError(e.message || "Failed to parse file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (f) processFile(f);
  };

  const typeColor = (t) =>
    t === "Number" ? colors.teal : t === "Date" ? "#8b6fcb" : colors.textSecondary;
  const typeBg = (t) =>
    t === "Number" ? colors.tealAlpha : t === "Date" ? "rgba(139,111,203,0.1)" : "rgba(100,116,139,0.08)";

  return (
    <div style={themeStyles.pageWrapper}>
      <style>{`
        @keyframes ds-spin { to { transform: rotate(360deg); } }
        @keyframes ds-fadeup { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .results-wrap { animation: ds-fadeup 0.35s ease forwards; }

        .ds-tab { background: none; border: 1px solid ${colors.border}; padding: 7px 18px; font-size: 13px; font-weight: 600; cursor: pointer; color: ${colors.textSecondary}; font-family: inherit; transition: all 0.15s; }
        .ds-tab.active { background: ${colors.navyDark}; color: ${colors.textOnDark}; border-color: ${colors.navyDark}; }
        .ds-tab:first-child { border-right: none; }

        .ds-card { background: ${colors.bgSurface}; border: 1px solid ${colors.border}; margin-bottom: 20px; }
        .ds-card-header { padding: 20px 24px; border-bottom: 1px solid ${colors.border}; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 10px; }

        .ds-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .ds-table th { background: ${colors.bgSubtle}; border-bottom: 2px solid ${colors.border}; padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 700; color: ${colors.textPrimary}; letter-spacing: 0.05em; text-transform: uppercase; }
        .ds-table td { padding: 11px 16px; border-bottom: 1px solid ${colors.borderLight}; color: #334155; font-size: 13px; }
        .ds-table tr:last-child td { border-bottom: none; }
        .ds-table tr:hover td { background: ${colors.bgSubtle}; }

        .ds-drop { border: 2px dashed ${colors.border}; background: ${colors.bgSurface}; padding: 48px 32px; display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .ds-drop:hover, .ds-drop.over { border-color: ${colors.teal}; background: ${colors.tealLight}; }

        .ds-select-btn { background: ${colors.navyDark}; color: ${colors.textOnDark}; border: none; padding: 11px 28px; font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: 0.04em; text-transform: uppercase; font-family: inherit; margin-top: 4px; }
        .ds-select-btn:hover { background: ${colors.navyLight}; }

        .ds-stat { background: ${colors.bgSurface}; border: 1px solid ${colors.border}; padding: 20px 24px; display: flex; align-items: center; gap: 14px; flex: 1; min-width: 170px; }
        .ds-fmt { border: 1px solid ${colors.border}; padding: 14px 18px; display: flex; align-items: center; gap: 12px; flex: 1; min-width: 150px; }
        .ds-badge { display: flex; align-items: center; gap: 6px; border: 1px solid ${colors.success}; padding: 4px 12px; color: #16a34a; font-size: 12px; font-weight: 600; background: ${colors.successBg}; }
        .ds-col-tag { display: inline-block; padding: 2px 9px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }

        @media (max-width: 560px) {
          .ds-stat-row { flex-direction: column !important; }
          .ds-fmt-row { flex-direction: column !important; }
        }
      `}</style>

      <Sidebar activePage="Data Studio" />

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div style={themeStyles.mainColumn}>

        {/* Header */}
        <header style={themeStyles.header}>
          <div>
            <h1 style={themeStyles.headerTitle}>Data Studio</h1>
            <p style={themeStyles.headerSubtitle}>Upload and manage financial datasets with intelligent processing</p>
          </div>

          {file && !loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: colors.textSecondary }}>
              <FileIcon color={colors.teal} />
              <span style={{ fontWeight: "600", color: colors.textPrimary }}>{file.name}</span>
              <button
                onClick={() => { setFile(null); setData(null); setError(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted, display: "flex", padding: "2px" }}
              >
                <XIcon />
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        <main style={themeStyles.contentArea}>

          {/* Upload card */}
          <div className="ds-card">
            <div className="ds-card-header">
              <div>
                <div style={{ fontWeight: "700", fontSize: "15px", color: colors.textPrimary, marginBottom: "2px" }}>Upload Dataset</div>
                <div style={{ fontSize: "13px", color: colors.textSecondary }}>Upload financial data files for audit analysis</div>
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div
                className={`ds-drop${dragOver ? " over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon />
                <div style={{ fontWeight: "700", fontSize: "15px", color: colors.textPrimary }}>Drop files here or click to browse</div>
                <div style={{ fontSize: "13px", color: colors.textMuted }}>Maximum file size: 50MB</div>
                <button
                  className="ds-select-btn"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Select Files
                </button>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.pdf" style={{ display: "none" }} onChange={handleFileInput} />
              </div>

              <div style={{ marginTop: "22px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>Supported Formats</div>
                <div className="ds-fmt-row" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[
                    { label: "Excel Files", sub: ".xlsx, .xls", color: colors.teal },
                    { label: "CSV Files", sub: ".csv", color: colors.info },
                    { label: "PDF Invoices", sub: ".pdf", color: colors.modulePipeline },
                  ].map(({ label, sub, color }) => (
                    <div key={label} className="ds-fmt">
                      <FileIcon color={color} />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "13px", color: colors.textPrimary }}>{label}</div>
                        <div style={{ fontSize: "11px", color: colors.textSecondary }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loader */}
          {loading && <ProcessingLoader fileName={file?.name ?? ""} />}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: colors.bgSurface, border: `1px solid ${colors.error}`, padding: "18px 24px", color: colors.error, fontWeight: "600", fontSize: "13.5px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {/* Results */}
          {data && !loading && (
            <div className="results-wrap">

              {/* Schema detection card */}
              <div className="ds-card">
                <div className="ds-card-header">
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px", color: colors.textPrimary, marginBottom: "2px" }}>Schema Detection</div>
                    <div style={{ fontSize: "13px", color: colors.textSecondary }}>AI-detected columns and data types</div>
                  </div>
                  <div className="ds-badge">
                    <CheckIcon size={13} color="#16a34a" /> Validated
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ padding: "16px 24px 0" }}>
                  <div style={{ display: "flex" }}>
                    <button className={`ds-tab${activeTab === "preview" ? " active" : ""}`} onClick={() => setActiveTab("preview")}>Data Preview</button>
                    <button className={`ds-tab${activeTab === "analysis" ? " active" : ""}`} onClick={() => setActiveTab("analysis")}>Column Analysis</button>
                  </div>
                </div>

                {/* Data Preview */}
                {activeTab === "preview" && (
                  <div style={{ overflowX: "auto" }}>
                    <table className="ds-table">
                      <thead>
                        <tr>{data.headers.map(h => <th key={h}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {data.rows.slice(0, 5).map((row, i) => (
                          <tr key={i}>
                            {data.headers.map((_, ci) => (
                              <td key={ci}>{String(row[ci] ?? "")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f0f2ee" }}>
                      <span style={{ fontSize: "13px", color: colors.textSecondary }}>Showing 5 of {data.stats.totalRows.toLocaleString()} rows</span>
                      <button style={{ background: "none", border: `1px solid ${colors.textPrimary}`, padding: "7px 18px", fontSize: "12px", fontWeight: "700", cursor: "pointer", color: colors.textPrimary, fontFamily: "inherit" }}>View All</button>
                    </div>
                  </div>
                )}

                {/* Column Analysis */}
                {activeTab === "analysis" && (
                  <div style={{ overflowX: "auto" }}>
                    <table className="ds-table">
                      <thead>
                        <tr>
                          <th>Column</th>
                          <th>Type</th>
                          <th>Unique Values</th>
                          <th>Missing</th>
                          <th>Fill Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.stats.columnStats.map(({ col, type, unique, missing, total }) => {
                          const fillRate = (((total - missing) / total) * 100).toFixed(1);
                          return (
                            <tr key={col}>
                              <td style={{ fontWeight: "600", color: colors.textPrimary }}>{col}</td>
                              <td>
                                <span className="ds-col-tag" style={{ color: typeColor(type), background: typeBg(type) }}>{type}</span>
                              </td>
                              <td>{unique.toLocaleString()}</td>
                              <td style={{ color: missing > 0 ? "#f59e0b" : "#22c55e", fontWeight: "600" }}>{missing}</td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <div style={{ width: "80px", height: "4px", background: "#e4e7e2" }}>
                                    <div style={{
                                      height: "100%",
                                      width: `${fillRate}%`,
                                      background: Number(fillRate) >= 90 ? "#22c55e" : Number(fillRate) >= 70 ? "#f59e0b" : "#ef4444",
                                    }} />
                                  </div>
                                  <span style={{ fontSize: "12px", color: "#64748b", minWidth: "36px" }}>{fillRate}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Stat cards */}
              <div className="ds-stat-row" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div className="ds-stat">
                  <div style={{ width: "36px", height: "36px", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CheckIcon size={16} color="#22c55e" />
                  </div>
                  <div>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: colors.textPrimary, lineHeight: 1 }}>{data.stats.totalRows.toLocaleString()}</div>
                    <div style={{ fontSize: "13px", color: colors.textSecondary, marginTop: "3px" }}>Valid Records</div>
                  </div>
                </div>
                <div className="ds-stat">
                  <div style={{ width: "36px", height: "36px", border: "2px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <WarnIcon />
                  </div>
                  <div>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: colors.textPrimary, lineHeight: 1 }}>{data.stats.missingValues.toLocaleString()}</div>
                    <div style={{ fontSize: "13px", color: colors.textSecondary, marginTop: "3px" }}>Missing Values</div>
                  </div>
                </div>
                <div className="ds-stat">
                  <div style={{ width: "36px", height: "36px", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GridIcon />
                  </div>
                  <div>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: colors.textPrimary, lineHeight: 1 }}>{data.stats.columns}</div>
                    <div style={{ fontSize: "13px", color: colors.textSecondary, marginTop: "3px" }}>Columns Detected</div>
                  </div>
                </div>
              </div>

              {/* Related Reports */}
              <div className="ds-card" style={{ marginTop:"20px" }}>
                <div className="ds-card-header">
                  <div>
                    <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Related AI Reports</div>
                    <div style={{ fontSize:"13px", color:colors.textSecondary }}>Data quality and verification reports for this dataset</div>
                  </div>
                </div>
                <div style={{ padding:"16px 24px", display:"flex", gap:"14px", flexWrap:"wrap" }}>
                  {REPORT_META.filter(r => r.pages.includes("/datastudio")).map(r => (
                    <a key={r.id} href="/reports" style={{ textDecoration:"none", flex:"1 1 260px", display:"flex", alignItems:"center", gap:"14px", padding:"14px 18px", background:colors.bgSubtle, border:`1px solid ${colors.border}`, borderLeft:`3px solid ${r.color}`, cursor:"pointer", transition:"all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = colors.bgSurface}
                      onMouseLeave={e => e.currentTarget.style.background = colors.bgSubtle}
                    >
                      <div style={{ width:"40px", height:"40px", background:`${r.color}15`, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"4px", flexShrink:0 }}>
                        <svg width="18" height="18" fill="none" stroke={r.color} strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                      </div>
                      <div>
                        <div style={{ fontWeight:"600", fontSize:"13.5px", color:colors.textPrimary }}>{r.title}</div>
                        <div style={{ fontSize:"12px", color:colors.textSecondary, marginTop:"2px" }}>{r.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}