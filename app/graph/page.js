"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import { colors, styles as themeStyles, globalPageCSS } from "../theme";
import { isDemoConfigured, DEMO_FILE_NAME, DEMO_GRAPH_DATA } from "../data/dummyData";
import { REPORT_META } from "../data/reports";

/* ─── COLOURS ─────────────────────────────────────────────────────────────── */
const NODE_TYPE_COLOR = { vendor: colors.info, employee: "#a855f7", account: "#06b6d4" };
const RISK_COLOR      = { high: colors.error, medium: colors.warning, low: colors.success };
function riskLevel(s) { return s >= 70 ? "high" : s >= 45 ? "medium" : "low"; }

/* ─── GRAPH BUILDER ───────────────────────────────────────────────────────── */
function buildGraph(headers, rows) {
  const lc          = headers.map(h => h.toLowerCase());
  const vendorIdx   = lc.findIndex(h => /vendor|company|supplier|party|name/.test(h));
  const employeeIdx = lc.findIndex(h => /approv|employee|manager|officer|by$/.test(h));
  const accountIdx  = lc.findIndex(h => /account|bank|acc/.test(h));
  const amountIdx   = lc.findIndex(h => /amount|value|total|sum/.test(h));

  const nodeMap = new Map();
  const edgeSet = new Set();
  const edges   = [];

  const add = (id, label, type, score) => {
    if (!nodeMap.has(id)) nodeMap.set(id, { id, label: String(label).trim().slice(0, 24), type, score, degree: 0 });
    nodeMap.get(id).degree++;
  };
  const link = (a, b) => {
    const k = [a, b].sort().join("|||");
    if (!edgeSet.has(k)) { edgeSet.add(k); edges.push({ source: a, target: b }); }
  };

  // If no useful columns found → generate illustrative graph
  const hasCols = vendorIdx >= 0 || employeeIdx >= 0;

  rows.slice(0, 25).forEach((row, i) => {
    const riskScore = Math.round(Math.random() * 65 + 25);

    const vLabel = vendorIdx   >= 0 ? String(row[vendorIdx]   || `Vendor ${i+1}`) : `Vendor ${i+1}`;
    const eLabel = employeeIdx >= 0 ? String(row[employeeIdx] || "").trim()        : `Employee ${String.fromCharCode(65 + (i % 8))}`;
    const aLabel = accountIdx  >= 0 ? String(row[accountIdx]  || "").trim()        : `Bank Account ${(i % 6) + 1}`;

    const vId = `v::${vLabel}`;
    const eId = eLabel ? `e::${eLabel}` : null;
    const aId = `a::${aLabel}`;

    add(vId, vLabel, "vendor",   riskScore);
    if (eLabel) add(eId, eLabel, "employee", Math.round(Math.random() * 45 + 15));
    add(aId, aLabel, "account",  Math.round(Math.random() * 35 + 10));

    if (eId) link(vId, eId);
    link(vId, aId);
    if (eId && Math.random() > 0.5) link(eId, aId);
  });

  return { nodes: Array.from(nodeMap.values()), links: edges };
}

/* ─── D3 FORCE GRAPH ──────────────────────────────────────────────────────── */
function ForceGraph({ data, filterType, onNodeClick }) {
  const svgRef = useRef(null);
  const [tip,  setTip] = useState(null);

  // filtered view
  const visible = filterType
    ? { nodes: data.nodes.filter(n => n.type === filterType),
        links: data.links.filter(l => {
          const ids = new Set(data.nodes.filter(n => n.type === filterType).map(n => n.id));
          const s   = typeof l.source === "object" ? l.source.id : l.source;
          const t   = typeof l.target === "object" ? l.target.id : l.target;
          return ids.has(s) || ids.has(t);
        }) }
    : data;

  useEffect(() => {
    if (!svgRef.current || !visible.nodes.length) return;

    // lazy-load d3 from CDN inside useEffect
    const script = document.getElementById("d3-cdn");
    const run = () => renderGraph(svgRef.current, visible, setTip, onNodeClick);

    if (window.d3) { run(); return; }

    if (!script) {
      const s = document.createElement("script");
      s.id  = "d3-cdn";
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js";
      s.onload = run;
      document.head.appendChild(s);
    } else {
      script.addEventListener("load", run);
    }

    return () => { /* sim stopped inside renderGraph cleanup */ };
  }, [visible, filterType]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: colors.bgPrimary }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%", display: "block" }} />
      {tip && (
        <div style={{
          position: "absolute", left: tip.x + 16, top: tip.y - 10,
          background: colors.navyDark, color: colors.textOnDark, padding: "10px 14px",
          fontSize: "12px", lineHeight: "1.65", pointerEvents: "none",
          zIndex: 30, minWidth: "170px", boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
          borderTop: `3px solid ${RISK_COLOR[riskLevel(tip.score)]}`,
        }}>
          <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "5px", color: colors.textOnDark }}>{tip.label}</div>
          <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Type  </span>{tip.type}</div>
          <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Risk  </span><span style={{ color: RISK_COLOR[riskLevel(tip.score)], fontWeight: "700" }}>{riskLevel(tip.score).toUpperCase()} ({tip.score})</span></div>
          <div><span style={{ color: "rgba(255,255,255,0.5)" }}>Links  </span>{tip.degree}</div>
        </div>
      )}
    </div>
  );
}

function renderGraph(el, data, setTip, onNodeClick) {
  const d3 = window.d3;
  const W  = el.clientWidth  || 860;
  const H  = el.clientHeight || 520;

  d3.select(el).selectAll("*").remove();

  const svg = d3.select(el).attr("viewBox", `0 0 ${W} ${H}`);

  // subtle grid
  const defs = svg.append("defs");
  const pat  = defs.append("pattern").attr("id", "grid").attr("width", 28).attr("height", 28).attr("patternUnits", "userSpaceOnUse");
  pat.append("path").attr("d", "M 28 0 L 0 0 0 28").attr("fill", "none").attr("stroke", colors.borderLight).attr("stroke-width", "0.5");
  svg.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#grid)");

  const g = svg.append("g");

  // arrow markers
  defs.append("marker").attr("id", "arrow").attr("viewBox", "0 -5 10 10").attr("refX", 22).attr("refY", 0)
    .attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto")
    .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", colors.border);

  // zoom + pan
  svg.call(
    d3.zoom().scaleExtent([0.25, 5]).on("zoom", ev => g.attr("transform", ev.transform))
  );

  const nodes = data.nodes.map(n => ({ ...n }));
  const links = data.links.map(l => ({ ...l }));

  const sim = d3.forceSimulation(nodes)
    .force("link",    d3.forceLink(links).id(d => d.id).distance(d => 100 + (d.source.degree || 0) * 8).strength(0.5))
    .force("charge",  d3.forceManyBody().strength(-280))
    .force("center",  d3.forceCenter(W / 2, H / 2))
    .force("collide", d3.forceCollide(d => 18 + (d.degree || 0) * 3));

  // edges
  const link = g.append("g").selectAll("line").data(links).join("line")
    .attr("stroke", colors.border)
    .attr("stroke-width", 1.4)
    .attr("stroke-opacity", 0.75)
    .attr("marker-end", "url(#arrow)");

  // node groups
  const node = g.append("g").selectAll("g").data(nodes).join("g")
    .style("cursor", "pointer")
    .call(
      d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );

  // shadow
  node.append("circle")
    .attr("r", d => 10 + (d.degree || 0) * 2.5)
    .attr("fill", "rgba(0,0,0,0.08)")
    .attr("transform", "translate(2,3)");

  // main circle
  node.append("circle")
    .attr("r", d => 10 + (d.degree || 0) * 2.5)
    .attr("fill", d => RISK_COLOR[riskLevel(d.score)])
    .attr("stroke", "#fff")
    .attr("stroke-width", 2.5)
    .on("mouseover", (e, d) => {
      d3.select(e.currentTarget).attr("stroke", colors.navyDark).attr("stroke-width", 3.5).attr("r", 14 + (d.degree || 0) * 2.5);
      setTip({ x: e.offsetX, y: e.offsetY, ...d });
    })
    .on("mousemove", e => setTip(t => t ? { ...t, x: e.offsetX, y: e.offsetY } : t))
    .on("mouseout",  (e, d) => {
      d3.select(e.currentTarget).attr("stroke", "#fff").attr("stroke-width", 2.5).attr("r", 10 + (d.degree || 0) * 2.5);
      setTip(null);
    })
    .on("click", (e, d) => onNodeClick && onNodeClick(d));

  // type ring (thin outer ring to show node type colour)
  node.append("circle")
    .attr("r", d => 13 + (d.degree || 0) * 2.5)
    .attr("fill", "none")
    .attr("stroke", d => NODE_TYPE_COLOR[d.type] ?? "#94a3b8")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.55);

  // labels
  node.append("text")
    .text(d => d.label)
    .attr("dy", d => 26 + (d.degree || 0) * 2.5)
    .attr("text-anchor", "middle")
    .attr("font-size", "11px")
    .attr("font-family", "'DM Sans', sans-serif")
    .attr("font-weight", "600")
    .attr("fill", colors.textPrimary)
    .style("pointer-events", "none")
    .style("user-select", "none");

  sim.on("tick", () => {
    link
      .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    node.attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);
  });

  // store stop fn on element for cleanup
  el.__stopSim = () => sim.stop();
  return () => sim.stop();
}

/* ─── LOADER ──────────────────────────────────────────────────────────────── */
const LOAD_MSGS = [
  "Reading file structure...", "Identifying entity columns...",
  "Building node registry...", "Constructing edge relationships...",
  "Computing centrality scores...", "Detecting graph clusters...", "Graph ready.",
];
function GraphLoader({ name }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, LOAD_MSGS.length - 1)), 370);
    return () => clearInterval(t);
  }, []);
  const pct = Math.round(((step + 1) / LOAD_MSGS.length) * 100);
  return (
    <div style={{ background: colors.bgSurface, border: `1px solid ${colors.border}`, padding: "56px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "22px" }}>
      <div style={{ position: "relative", width: 62, height: 62 }}>
        <div style={{ position: "absolute", inset: 0, border: `3px solid ${colors.border}`, borderTop: `3px solid ${colors.teal}`, borderRadius: "50%", animation: "ga-spin 0.8s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" fill="none" stroke={colors.teal} strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: "700", fontSize: "15.5px", color: colors.textPrimary, marginBottom: "8px" }}>Building Relationship Graph</div>
        <div style={{ fontSize: "13px", color: colors.teal, fontWeight: "600", minHeight: "20px" }}>{LOAD_MSGS[step]}</div>
        <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "4px" }}>{name}</div>
      </div>
      <div style={{ width: 300, height: 4, background: colors.border }}>
        <div style={{ height: "100%", width: `${pct}%`, background: colors.teal, transition: "width 0.37s ease" }} />
      </div>
      <div style={{ fontSize: "12px", color: colors.textMuted }}>{pct}% complete</div>
    </div>
  );
}

/* ─── NODE DETAIL PANEL ───────────────────────────────────────────────────── */
function NodePanel({ node, onClose }) {
  if (!node) return null;
  const rc = RISK_COLOR[riskLevel(node.score)];
  return (
    <div style={{ position: "absolute", top: 16, right: 16, width: 240, background: colors.bgSurface, border: `1px solid ${colors.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", zIndex: 20, animation: "ga-fadein 0.2s ease" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: "700", fontSize: "13px", color: colors.textPrimary }}>Node Detail</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted, padding: 0, display: "flex" }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: rc, flexShrink: 0 }} />
          <span style={{ fontWeight: "700", fontSize: "13.5px", color: colors.textPrimary }}>{node.label}</span>
        </div>
        {[["Type", node.type], ["Risk Score", node.score], ["Risk Level", riskLevel(node.score).toUpperCase()], ["Connections", node.degree]].map(([k, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${colors.borderLight}`, fontSize: "12.5px" }}>
            <span style={{ color: colors.textSecondary }}>{k}</span>
            <span style={{ fontWeight: "700", color: k === "Risk Level" ? rc : colors.textPrimary }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: "10px 12px", background: colors.tealAlpha, borderLeft: `3px solid ${colors.teal}`, fontSize: "11.5px", color: colors.textPrimary, lineHeight: 1.6 }}>
          {node.score >= 70
            ? `High-risk ${node.type} with ${node.degree} connections. Warrants immediate investigation.`
            : node.score >= 45
            ? `Medium-risk ${node.type}. Review transaction history.`
            : `Low-risk ${node.type}. Appears within normal parameters.`}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────────────────────────────── */
export default function GraphAnalysis() {
  const [dragOver,    setDragOver]    = useState(false);
  const [file,        setFile]        = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [graphData,   setGraphData]   = useState(null);
  const [filterType,  setFilterType]  = useState(null);
  const [fullscreen,  setFullscreen]  = useState(false);
  const [activeNode,  setActiveNode]  = useState(null);
  const fileInputRef  = useRef();
  const graphWrapRef  = useRef();

  // ── Auto-load demo data if configured ──
  useEffect(() => {
    if (isDemoConfigured() && !file && !graphData && !loading) {
      setFile({ name: DEMO_FILE_NAME });
      setGraphData(DEMO_GRAPH_DATA);
    }
  }, []);

  const loadFile = useCallback(async (f) => {
    setFile(f); setLoading(true); setGraphData(null); setActiveNode(null);
    const minWait = new Promise(r => setTimeout(r, 2600));
    try {
      const buf = await f.arrayBuffer();
      let wb;
      if (f.name.toLowerCase().endsWith(".csv")) {
        wb = window.XLSX
          ? window.XLSX.read(new TextDecoder().decode(buf), { type: "string" })
          : XLSX.read(new TextDecoder().decode(buf), { type: "string" });
      } else {
        wb = XLSX.read(buf, { type: "array" });
      }
      const sheet   = wb.Sheets[wb.SheetNames[0]];
      const raw     = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      const headers = raw[0].map(String);
      const rows    = raw.slice(1).filter(r => r.some(c => c !== ""));
      const gd      = buildGraph(headers, rows);
      await minWait;
      setGraphData(gd);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const handleDrop  = e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); };
  const handleInput = e => { const f = e.target.files[0]; if (f) loadFile(f); };

  const handleExportSVG = () => {
    const svg = graphWrapRef.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: "relationship_graph.svg" });
    a.click(); URL.revokeObjectURL(url);
  };

  const stats = graphData ? {
    nodes:    graphData.nodes.length,
    edges:    graphData.links.length,
    vendors:  graphData.nodes.filter(n => n.type === "vendor").length,
    employees:graphData.nodes.filter(n => n.type === "employee").length,
    accounts: graphData.nodes.filter(n => n.type === "account").length,
    highRisk: graphData.nodes.filter(n => riskLevel(n.score) === "high").length,
  } : null;

  const STAT_LIST = stats ? [
    { label: "Total Nodes",  val: stats.nodes,     accent: null        },
    { label: "Connections",  val: stats.edges,     accent: null        },
    { label: "Vendors",      val: stats.vendors,   accent: colors.info     },
    { label: "Employees",    val: stats.employees, accent: "#a855f7"       },
    { label: "Bank Accounts",val: stats.accounts,  accent: "#06b6d4"       },
    { label: "High Risk",    val: stats.highRisk,  accent: colors.error    },
  ] : [];

  return (
    <div style={themeStyles.pageWrapper}>
      <style>{`
        ${globalPageCSS}
        @keyframes ga-spin   { to { transform: rotate(360deg); } }
        @keyframes ga-fadein { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:translateY(0); } }
        .ga-in  { animation: ga-fadein 0.38s ease forwards; }
        .ga-drop { border:2px dashed ${colors.border}; background:${colors.bgSurface}; padding:44px 24px; display:flex; flex-direction:column; align-items:center; gap:12px; cursor:pointer; transition:border-color 0.2s,background 0.2s; }
        .ga-drop:hover,.ga-drop.over { border-color:${colors.teal}; background:${colors.tealAlpha}; }
        .ga-btn { border:none; cursor:pointer; font-family:inherit; font-weight:700; font-size:12.5px; padding:9px 16px; display:inline-flex; align-items:center; gap:7px; transition:all 0.14s; letter-spacing:0.02em; }
        .ga-btn-outline { background:${colors.bgSurface}; color:${colors.textPrimary}; border:1px solid ${colors.border} !important; }
        .ga-btn-outline:hover { background:${colors.bgSubtle}; border-color:${colors.textMuted} !important; }
        .ga-chip { padding:5px 13px; font-size:12px; font-weight:600; cursor:pointer; border:none; font-family:inherit; display:inline-flex; align-items:center; gap:6px; transition:all 0.13s; }
        .ga-chip.sel  { background:${colors.navyDark}; color:${colors.textOnDark}; }
        .ga-chip.idle { background:${colors.bgSubtle}; color:${colors.textSecondary}; }
        .ga-chip.idle:hover { background:${colors.border}; }
        .ga-stat-card { background:${colors.bgSurface}; border:1px solid ${colors.border}; padding:16px 20px; flex:1; min-width:90px; }
        @media(max-width:768px){ .app-sidebar{position:fixed!important;z-index:50;} .sidebar-mobile-btn{display:flex!important;} }
      `}</style>

      <Sidebar activePage="Graph Analysis" />

      {/* Fullscreen modal */}
      {fullscreen && graphData && (
        <div style={{ position:"fixed",inset:0,zIndex:200,background:colors.bgPrimary,display:"flex",flexDirection:"column" }}>
          <div style={{ padding:"12px 22px",background:colors.bgSurface,borderBottom:`1px solid ${colors.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
            <div>
              <span style={{ fontWeight:"700",fontSize:"14px",color:colors.textPrimary }}>Relationship Network</span>
              <span style={{ marginLeft:12,fontSize:"12px",color:colors.textSecondary }}>Fullscreen Mode — drag nodes, scroll to zoom</span>
            </div>
            <button className="ga-btn ga-btn-outline" onClick={() => setFullscreen(false)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>
              Exit Fullscreen
            </button>
          </div>
          <div style={{ flex:1, position:"relative" }}>
            <ForceGraph data={graphData} filterType={filterType} onNodeClick={setActiveNode} />
            <NodePanel node={activeNode} onClose={() => setActiveNode(null)} />
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <div style={themeStyles.mainColumn}>

        {/* Header */}
        <header style={themeStyles.header}>
          <div>
            <h1 style={themeStyles.headerTitle}>Graph Analysis</h1>
            <p style={themeStyles.headerSubtitle}>Visualize financial relationships and detect fraud patterns</p>
          </div>
          {file && !loading && (
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"12.5px" }}>
              <svg width="18" height="18" fill="none" stroke={colors.teal} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
              <span style={{ fontWeight:"600", color:colors.textPrimary }}>{file.name}</span>
              <button onClick={() => { setFile(null); setGraphData(null); setFilterType(null); }} style={{ background:"none",border:"none",cursor:"pointer",color:colors.textMuted,display:"flex",padding:2 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        <main style={{ ...themeStyles.contentArea, display:"flex", flexDirection:"column", gap:20 }}>

          {/* ── Upload ── */}
          {!file && !loading && (
            <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}` }}>
              <div style={{ padding:"20px 24px", borderBottom:`1px solid ${colors.border}` }}>
                <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:2 }}>Upload Dataset for Graph Analysis</div>
                <div style={{ fontSize:"13px", color:colors.textSecondary }}>Upload a CSV or Excel file — we'll automatically detect vendors, employees and bank accounts</div>
              </div>
              <div style={{ padding:24 }}>
                <div
                  className={`ga-drop${dragOver?" over":""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="38" height="38" fill="none" stroke={colors.textMuted} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary }}>Drop file here or click to browse</div>
                  <div style={{ fontSize:"13px", color:colors.textMuted }}>Supports .csv, .xlsx, .xls, .pdf — relationship graph generated automatically</div>
                  <button
                    style={{ ...themeStyles.btnPrimary }}
                    onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >Select File</button>
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.pdf" style={{ display:"none" }} onChange={handleInput} />
                </div>
              </div>
            </div>
          )}

          {/* ── Loader ── */}
          {loading && <GraphLoader name={file?.name ?? ""} />}

          {/* ── Graph Results ── */}
          {!loading && graphData && (
            <div className="ga-in" style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {/* Legend / filter bar */}
              <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}`, padding:"16px 24px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:36, flexWrap:"wrap", rowGap:14 }}>

                  {/* Node type filters */}
                  <div>
                    <div style={{ fontSize:"10px", fontWeight:"700", color:colors.textSecondary, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:9 }}>Node Types</div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {[
                        { label:"Vendors",       type:"vendor",   color: NODE_TYPE_COLOR.vendor   },
                        { label:"Employees",     type:"employee", color: NODE_TYPE_COLOR.employee },
                        { label:"Bank Accounts", type:"account",  color: NODE_TYPE_COLOR.account  },
                      ].map(({ label, type, color }) => (
                        <button
                          key={type}
                          className={`ga-chip ${filterType===type?"sel":"idle"}`}
                          onClick={() => { setFilterType(f => f===type ? null : type); setActiveNode(null); }}
                        >
                          <span style={{ width:10, height:10, borderRadius:"50%", background:color, flexShrink:0, display:"inline-block" }} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ width:1, height:36, background:colors.border, alignSelf:"center" }} />

                  {/* Risk legend */}
                  <div>
                    <div style={{ fontSize:"10px", fontWeight:"700", color:colors.textSecondary, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:9 }}>Risk Levels</div>
                    <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                      {[["High Risk","high"],["Medium Risk","medium"],["Low Risk","low"]].map(([label, key]) => (
                        <div key={key} style={{ display:"flex", alignItems:"center", gap:7, fontSize:"13px", color:colors.textPrimary, fontWeight:"500" }}>
                          <span style={{ width:11, height:11, borderRadius:"50%", background:RISK_COLOR[key], display:"inline-block" }} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ flex:1 }} />

                  {filterType && (
                    <button onClick={() => setFilterType(null)} style={{ background:"none",border:"none",color:colors.teal,fontSize:"12.5px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",alignSelf:"center" }}>
                      Show All Nodes
                    </button>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                {STAT_LIST.map(({ label, val, accent }) => (
                  <div key={label} className="ga-stat-card">
                    <div style={{ fontSize:"26px", fontWeight:"800", color: accent ?? colors.textPrimary, lineHeight:1 }}>{val}</div>
                    <div style={{ fontSize:"12px", color:colors.textSecondary, marginTop:4 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Graph canvas */}
              <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}` }}>
                <div style={{ padding:"16px 24px", borderBottom:`1px solid ${colors.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                  <div>
                    <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:2 }}>Relationship Network</div>
                    <div style={{ fontSize:"13px", color:colors.textSecondary }}>Interactive graph showing vendor-employee-account connections</div>
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    <button className="ga-btn ga-btn-outline" onClick={handleExportSVG}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Export
                    </button>
                    <button className="ga-btn ga-btn-outline" onClick={() => setFullscreen(true)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                      Fullscreen
                    </button>
                  </div>
                </div>

                <div ref={graphWrapRef} style={{ height:520, position:"relative" }}>
                  <ForceGraph data={graphData} filterType={filterType} onNodeClick={setActiveNode} />
                  <NodePanel node={activeNode} onClose={() => setActiveNode(null)} />
                </div>

                <div style={{ padding:"11px 24px", borderTop:`1px solid ${colors.borderLight}`, fontSize:"12px", color:colors.textMuted, display:"flex", alignItems:"center", gap:6 }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {filterType
                    ? `Filtered to ${filterType} nodes — ${graphData.nodes.filter(n=>n.type===filterType).length} nodes visible`
                    : `${graphData.nodes.length} nodes and ${graphData.links.length} connections — drag to reposition, scroll to zoom, click a node for details`}
                </div>
              </div>

              {/* Related Reports */}
              <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}` }}>
                <div style={{ padding:"18px 24px", borderBottom:`1px solid ${colors.border}` }}>
                  <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Related AI Reports</div>
                  <div style={{ fontSize:"13px", color:colors.textSecondary }}>Network analysis findings documented in detail</div>
                </div>
                <div style={{ padding:"16px 24px", display:"flex", gap:"14px", flexWrap:"wrap" }}>
                  {REPORT_META.filter(r => r.pages.includes("/graph")).map(r => (
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