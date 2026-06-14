"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { colors, styles as themeStyles, globalPageCSS } from "../theme";
import { REPORT_META, REPORTS } from "../data/reports";

// ─── Icons ────────────────────────────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

// Report type icons (small colored dots)
const ICON_MAP = {
  summary:  "📊",
  anomaly:  "🔴",
  vendor:   "🏢",
  invoice:  "📄",
  graph:    "🔗",
  approval: "✅",
  quality:  "📐",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function downloadMarkdown(reportId) {
  const content = REPORTS[reportId];
  if (!content) return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${reportId}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Reports Page
// ═══════════════════════════════════════════════════════════════════════════════
export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);

  // ─── Full report view ─────────────────────────────────────────────────────
  if (selectedReport) {
    const meta = REPORT_META.find(r => r.id === selectedReport);
    const content = REPORTS[selectedReport];
    return (
      <div style={themeStyles.pageWrapper}>
        <style>{globalPageCSS}</style>
        <Sidebar activePage="Reports" />
        <div style={themeStyles.mainColumn}>
          {/* Header */}
          <div style={themeStyles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button
                onClick={() => setSelectedReport(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: colors.textSecondary, display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontFamily: "inherit", padding: "6px 10px", borderRadius: "4px", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = colors.bgSubtle; e.currentTarget.style.color = colors.textPrimary; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = colors.textSecondary; }}
              >
                <BackIcon /> Back to Reports
              </button>
              <div style={{ width: "1px", height: "24px", background: colors.border }} />
              <div>
                <h1 style={{ ...themeStyles.headerTitle, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>{ICON_MAP[meta?.icon]}</span>
                  {meta?.title}
                </h1>
              </div>
            </div>
            <button
              onClick={() => downloadMarkdown(selectedReport)}
              style={{ ...themeStyles.btnPrimary, display: "flex", alignItems: "center", gap: "8px", padding: "9px 20px", fontSize: "12px" }}
            >
              <DownloadIcon /> Download .md
            </button>
          </div>
          {/* Content */}
          <div style={{ ...themeStyles.contentArea, maxWidth: "900px" }}>
            <div style={{ ...themeStyles.card, borderRadius: "6px", padding: "32px 36px" }}>
              <MarkdownRenderer content={content} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Reports grid ─────────────────────────────────────────────────────────
  return (
    <div style={themeStyles.pageWrapper}>
      <style>{globalPageCSS}{`
        .report-card { transition: all 0.2s ease; cursor: pointer; }
        .report-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
        @media (max-width: 768px) {
          .app-sidebar { position: fixed; left: 0; top: 0; height: 100vh; transform: translateX(-100%); }
          .sidebar-mobile-btn { display: flex !important; }
          .reports-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Sidebar activePage="Reports" />
      <div style={themeStyles.mainColumn}>
        {/* Header */}
        <div style={themeStyles.header}>
          <div>
            <h1 style={themeStyles.headerTitle}>AI-Generated Reports</h1>
            <p style={themeStyles.headerSubtitle}>7 audit reports generated from transaction analysis</p>
          </div>
          <button
            onClick={() => {
              REPORT_META.forEach(r => downloadMarkdown(r.id));
            }}
            style={{ ...themeStyles.btnPrimary, display: "flex", alignItems: "center", gap: "8px", padding: "9px 20px", fontSize: "12px" }}
          >
            <DownloadIcon /> Download All
          </button>
        </div>

        {/* Content */}
        <div style={themeStyles.contentArea}>
          {/* Summary strip */}
          <div style={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}>
            {[
              { label: "Total Reports", value: "7", color: colors.teal },
              { label: "Flagged Transactions", value: "8", color: colors.error },
              { label: "Financial Exposure", value: "₹29,37,050", color: colors.warning },
              { label: "Vendors Analyzed", value: "11", color: colors.info },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                ...themeStyles.card,
                borderRadius: "6px",
                flex: "1 1 180px",
                padding: "16px 20px",
                borderTop: `3px solid ${color}`,
              }}>
                <div style={{ fontSize: "10px", color: colors.textSecondary, fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: colors.textPrimary }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Report cards grid */}
          <div className="reports-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "18px",
          }}>
            {REPORT_META.map((report) => (
              <div
                key={report.id}
                className="report-card"
                style={{
                  ...themeStyles.card,
                  borderRadius: "6px",
                  padding: "0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Color top bar */}
                <div style={{ height: "4px", background: report.color }} />

                {/* Card body */}
                <div style={{ padding: "22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "20px" }}>{ICON_MAP[report.icon]}</span>
                    <h3 style={{ margin: 0, fontSize: "14.5px", fontWeight: "700", color: colors.textPrimary }}>{report.title}</h3>
                  </div>
                  <p style={{ margin: "0 0 16px", fontSize: "12.5px", color: colors.textSecondary, lineHeight: "1.5", flex: 1 }}>
                    {report.description}
                  </p>

                  {/* Preview snippet — first 3 meaningful lines */}
                  <div style={{
                    background: colors.bgSubtle,
                    border: `1px solid ${colors.borderLight}`,
                    borderRadius: "4px",
                    padding: "10px 12px",
                    marginBottom: "16px",
                    maxHeight: "70px",
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    <div style={{ fontSize: "11px", color: colors.textMuted, fontFamily: "'Fira Code', monospace", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                      {REPORTS[report.id]?.split("\n").filter(l => l.trim() && !l.startsWith("#")).slice(0, 3).join("\n")}
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "24px", background: `linear-gradient(transparent, ${colors.bgSubtle})` }} />
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => setSelectedReport(report.id)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "9px 14px",
                        fontSize: "12px",
                        fontWeight: "600",
                        fontFamily: "inherit",
                        background: colors.navyDark,
                        color: colors.textOnDark,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        letterSpacing: "0.03em",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = colors.navyLight}
                      onMouseLeave={e => e.currentTarget.style.background = colors.navyDark}
                    >
                      <EyeIcon /> View Report
                    </button>
                    <button
                      onClick={() => downloadMarkdown(report.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "9px 14px",
                        fontSize: "12px",
                        fontWeight: "600",
                        fontFamily: "inherit",
                        background: "transparent",
                        color: colors.teal,
                        border: `1px solid ${colors.teal}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        letterSpacing: "0.03em",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = colors.tealAlpha; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <DownloadIcon /> .md
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
