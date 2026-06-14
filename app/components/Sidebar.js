"use client";

import { useState, useEffect } from "react";
import { colors } from "../theme";
import { getAuditConfig, isDemoConfigured } from "../data/dummyData";

// ─── Icons ────────────────────────────────────────────────────────────────────
function HomeIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}
function DatabaseIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
function PipelineIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="6" height="10" />
      <rect x="9" y="3" width="6" height="18" />
      <rect x="16" y="7" width="6" height="10" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function GraphIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
function DashboardIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function AIIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}
function LogIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
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

const NAV_ITEMS = [
  { label: "Home",             icon: HomeIcon,      href: "/home" },
  { label: "Data Studio",      icon: DatabaseIcon,  href: "/datastudio" },
  { label: "Pipeline Builder", icon: PipelineIcon,  href: "/pipeline" },
  { label: "Investigation",    icon: SearchIcon,    href: "/investigation" },
  { label: "Graph Analysis",   icon: GraphIcon,     href: "/graph" },
  { label: "Dashboards",       icon: DashboardIcon, href: "#" },
  { label: "AI Assistant",     icon: AIIcon,        href: "#" },
  { label: "Reports",          icon: ReportIcon,    href: "/reports" },
  { label: "Audit Logs",       icon: LogIcon,       href: "#" },
];

/**
 * Shared Sidebar component.
 * @param {{ activePage: string }} props — label of the active nav item
 */
export default function Sidebar({ activePage = "Home" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auditConfig, setAuditConfig] = useState(null);

  useEffect(() => {
    if (isDemoConfigured()) {
      setAuditConfig(getAuditConfig());
    }
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 }}
        />
      )}

      {/* Mobile hamburger (shown only on mobile via CSS) */}
      <button
        className="sidebar-mobile-btn"
        onClick={() => setSidebarOpen(v => !v)}
        style={{
          display: "none",
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 60,
          background: colors.navyDark,
          color: colors.textOnDark,
          border: "none",
          borderRadius: "6px",
          padding: "8px",
          cursor: "pointer",
        }}
      >
        <MenuIcon />
      </button>

      <aside
        className="app-sidebar"
        style={{
          width: "260px",
          minWidth: "260px",
          background: colors.navyDark,
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "transform 0.28s ease",
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${colors.borderDark}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px",
              height: "34px",
              background: colors.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textOnDark,
              borderRadius: "4px",
            }}>
              <DashboardIcon />
            </div>
            <div>
              <div style={{ color: colors.textOnDark, fontWeight: "700", fontSize: "15px", letterSpacing: "0.02em" }}>Auditor</div>
              <div style={{ color: colors.textOnDarkDim, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Analytics Platform</div>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${colors.borderDark}` }}>
          <div style={{
            color: colors.textOnDarkDim,
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: "600",
            marginBottom: "9px",
          }}>
            Active Workspace
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.06)",
            padding: "9px 12px",
            borderRadius: "4px",
          }}>
            <div style={{
              width: "26px",
              height: "26px",
              background: colors.tealAlpha,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.teal,
              borderRadius: "3px",
            }}>
              <ReportIcon />
            </div>
            <div>
              <div style={{ color: colors.textOnDark, fontSize: "12.5px", fontWeight: "600" }}>{auditConfig?.workspace || "Banking Audit 2026"}</div>
              <div style={{ color: colors.textOnDarkMuted, fontSize: "11px" }}>{auditConfig?.auditType || "Financial Audit"}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive = label === activePage;
            return (
              <a
                key={label}
                href={href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 20px",
                  background: isActive ? colors.tealAlphaHover : "transparent",
                  borderLeft: isActive ? `3px solid ${colors.teal}` : "3px solid transparent",
                  color: isActive ? colors.teal : colors.textOnDarkMuted,
                  cursor: "pointer",
                  fontSize: "13.5px",
                  fontWeight: isActive ? "600" : "400",
                  textAlign: "left",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = colors.textOnDarkMuted;
                  }
                }}
              >
                <Icon />
                {label}
              </a>
            );
          })}
        </nav>

        {/* Pro tip */}
        <div style={{
          margin: "14px 16px 16px",
          padding: "13px 14px",
          background: colors.tealAlpha,
          borderLeft: `3px solid ${colors.teal}`,
          borderRadius: "0 4px 4px 0",
        }}>
          <div style={{
            color: colors.teal,
            fontSize: "10px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}>Pro Tip</div>
          <div style={{
            color: colors.textOnDarkMuted,
            fontSize: "11.5px",
            lineHeight: "1.5",
          }}>Use AI Assistant to query your audit data with natural language</div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .app-sidebar {
            position: fixed !important;
            height: 100vh;
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"} !important;
          }
          .sidebar-mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

// Export icons for reuse
export { HomeIcon, DatabaseIcon, PipelineIcon, SearchIcon, GraphIcon, DashboardIcon, AIIcon, ReportIcon, LogIcon, MenuIcon };
