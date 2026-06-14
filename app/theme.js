/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  AUDITOR DESIGN SYSTEM — "Professional Audit Intelligence"
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  Design Philosophy (extracted from Deloitte GenW platform screenshots):
 *
 *  1. TRUST & AUTHORITY
 *     Deep navy tones convey security, reliability, and corporate gravitas.
 *     The sidebar and headers use #0D1B2A — a near-black navy that anchors
 *     the interface with confidence.
 *
 *  2. CLARITY & READABILITY
 *     White surfaces (#FFFFFF) with generous whitespace ensure financial data
 *     is legible. Light gray backgrounds (#F8FAFB) create subtle depth without
 *     visual noise. Borders (#E2E8F0) separate content without drawing attention.
 *
 *  3. GUIDED INTERACTION
 *     Teal (#00BFA5) acts as the primary accent — guiding the eye to active
 *     navigation, interactive elements, and key data points. It's used
 *     sparingly: active states, links, progress indicators, and primary CTAs.
 *
 *  4. STATUS AT A GLANCE
 *     A strict traffic-light system for status colors ensures instant
 *     comprehension: green for success/safe, amber for warning/pending,
 *     red for error/flagged, blue for info/processing.
 *
 *  5. HIERARCHY & CONSISTENCY
 *     Three text color tiers (Primary, Secondary, Muted) create clear
 *     visual hierarchy. Consistent spacing, font weights, and component
 *     patterns across all pages reinforce familiarity and reduce cognitive load.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─── Core Palette ─────────────────────────────────────────────────────────────
export const colors = {
  // Primary Navy
  navyDark:       "#0D1B2A",
  navy:           "#1B2838",
  navyLight:      "#243447",
  navyHover:      "#2A3F56",

  // Accent — Teal
  teal:           "#00BFA5",
  tealDark:       "#00897B",
  tealLight:      "#E0F7F4",
  tealAlpha:      "rgba(0,191,165,0.12)",
  tealAlphaHover: "rgba(0,191,165,0.18)",

  // Surfaces
  bgPrimary:      "#F8FAFB",
  bgSurface:      "#FFFFFF",
  bgSubtle:       "#F1F5F9",

  // Borders
  border:         "#E2E8F0",
  borderLight:    "#F1F5F9",
  borderDark:     "rgba(255,255,255,0.08)",

  // Text
  textPrimary:    "#0D1B2A",
  textSecondary:  "#64748B",
  textMuted:      "#94A3B8",
  textOnDark:     "#FFFFFF",
  textOnDarkMuted:"rgba(255,255,255,0.50)",
  textOnDarkDim:  "rgba(255,255,255,0.35)",

  // Status
  success:        "#22C55E",
  successBg:      "rgba(34,197,94,0.08)",
  warning:        "#F59E0B",
  warningBg:      "rgba(245,158,11,0.08)",
  error:          "#DC2626",
  errorBg:        "rgba(220,38,38,0.08)",
  info:           "#3B82F6",
  infoBg:         "rgba(59,130,246,0.08)",

  // Module accent colors (card top bars & icons)
  moduleData:          "#00BFA5",
  modulePipeline:      "#7C3AED",
  moduleInvestigation: "#DC2626",
  moduleGraph:         "#059669",
  moduleDashboard:     "#2563EB",
  moduleAI:            "#9333EA",
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  sidebarWidth: "260px",
  headerHeight: "58px",
  pagePadding:  "28px",
  cardPadding:  "24px",
  gap:          "20px",
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  heading:    { fontWeight: "700", letterSpacing: "0.01em" },
  label:      { fontSize: "10px", fontWeight: "600", letterSpacing: "0.10em", textTransform: "uppercase" },
  body:       { fontSize: "13.5px", lineHeight: "1.6" },
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadows = {
  card:     "0 1px 3px rgba(0,0,0,0.04)",
  cardHover:"0 8px 24px rgba(0,0,0,0.10)",
  modal:    "0 20px 60px rgba(0,0,0,0.20)",
};

// ─── Common Inline Styles ─────────────────────────────────────────────────────
export const styles = {
  // Page wrapper
  pageWrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: typography.fontFamily,
    background: colors.bgPrimary,
    overflow: "hidden",
  },

  // Main content column
  mainColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  // Top header bar
  header: {
    background: colors.bgSurface,
    borderBottom: `1px solid ${colors.border}`,
    padding: `0 ${spacing.pagePadding}`,
    height: spacing.headerHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },

  // Scrollable content area
  contentArea: {
    flex: 1,
    overflowY: "auto",
    padding: spacing.pagePadding,
  },

  // Card
  card: {
    background: colors.bgSurface,
    border: `1px solid ${colors.border}`,
    padding: spacing.cardPadding,
  },

  // Section header
  sectionLabel: {
    margin: "0 0 4px",
    fontSize: "13px",
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  // Accent underline (below section header)
  accentBar: {
    height: "2px",
    width: "32px",
    background: colors.teal,
  },

  // Primary button
  btnPrimary: {
    background: colors.navyDark,
    color: colors.textOnDark,
    border: "none",
    padding: "11px 28px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },

  // Page title in header
  headerTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: "0.01em",
  },

  // Page subtitle in header
  headerSubtitle: {
    margin: 0,
    fontSize: "12px",
    color: colors.textSecondary,
    letterSpacing: "0.02em",
  },

  // Badge
  badge: (color, bg) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "600",
    color,
    background: bg,
  }),

  // Status badge presets
  statusBadge: {
    success: { color: "#16a34a", background: colors.successBg, border: `1px solid ${colors.success}` },
    warning: { color: "#d97706", background: colors.warningBg, border: `1px solid ${colors.warning}` },
    error:   { color: "#dc2626", background: colors.errorBg,   border: `1px solid ${colors.error}` },
    info:    { color: "#2563eb", background: colors.infoBg,    border: `1px solid ${colors.info}` },
  },
};

// ─── Global CSS to inject in pages ────────────────────────────────────────────
export const globalPageCSS = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${colors.textMuted}; }
`;
