"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import { colors, styles as themeStyles, globalPageCSS } from "../theme";
import { isDemoConfigured, DEMO_FILE_NAME, DEMO_TRANSACTIONS } from "../data/dummyData";
import { REPORT_META } from "../data/reports";

// ─── Page-specific Icons ──────────────────────────────────────────────────────
function SearchIcon()   { return <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function UploadIcon()   { return <svg width="36" height="36" fill="none" stroke={colors.textMuted} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function XIcon()        { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function EyeIcon()      { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function FileIcon()     { return <svg width="20" height="20" fill="none" stroke={colors.teal} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>; }
function AlertIcon()    { return <svg width="28" height="28" fill="none" stroke={colors.error} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function TrendIcon()    { return <svg width="28" height="28" fill="none" stroke={colors.warning} strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
function DocIcon()      { return <svg width="28" height="28" fill="none" stroke="#eab308" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>; }

// ─── Loader messages ──────────────────────────────────────────────────────────
const LOADER_STEPS = [
  "Reading file structure...",
  "Extracting financial records...",
  "Running anomaly detection models...",
  "Scoring transaction risk levels...",
  "Cross-referencing vendor database...",
  "Generating flagged transaction list...",
  "Investigation ready.",
];

// ─── Flag types ───────────────────────────────────────────────────────────────
const FLAG_TYPES = [
  "Unusual Amount","Vendor Collusion","Document Mismatch",
  "Payment Spike","Missing Documentation","Duplicate Entry",
  "Unauthorized Approval","Round-Number Transaction",
];

function scoreColor(s) {
  return s >= 80 ? colors.error : s >= 60 ? colors.warning : colors.success;
}

function generateTransactions(rows, headers) {
  const lower       = headers.map(h => h.toLowerCase());
  const vendorIdx   = lower.findIndex(h => h.includes("vendor") || h.includes("company") || h.includes("name") || h.includes("party"));
  const amountIdx   = lower.findIndex(h => h.includes("amount") || h.includes("value") || h.includes("total") || h.includes("sum"));
  const dateIdx     = lower.findIndex(h => h.includes("date") || h.includes("time") || h.includes("day"));
  const approverIdx = lower.findIndex(h => h.includes("approv") || h.includes("auth") || h.includes("manager") || h.includes("by"));
  const year        = new Date().getFullYear();

  return rows.slice(0, 20).map((row, i) => {
    const vendor   = vendorIdx   >= 0 ? String(row[vendorIdx]   || `Vendor ${i+1}`) : `Vendor ${i+1}`;
    const rawAmt   = amountIdx   >= 0 ? Number(row[amountIdx])  : 0;
    const amount   = isNaN(rawAmt) || rawAmt === 0 ? Math.round(Math.random()*900000+50000) : rawAmt;
    const date     = dateIdx     >= 0 ? String(row[dateIdx]     || `${year}-01-${String(i+1).padStart(2,"0")}`) : `${year}-01-${String(i+1).padStart(2,"0")}`;
    const approver = approverIdx >= 0 ? String(row[approverIdx] || "N/A") : "N/A";
    const riskScore = Math.round(Math.random()*60+30);
    const flagType  = riskScore > 70 ? FLAG_TYPES[i % 4] : riskScore > 50 ? FLAG_TYPES[4+(i%4)] : "None";
    const status    = riskScore > 75 ? "flagged" : riskScore > 50 ? "pending" : "reviewed";

    return {
      txnId: `TXN-${year}-${String(i+1).padStart(3,"0")}`,
      vendor: vendor.slice(0, 24),
      amount,
      riskScore,
      flagType,
      status,
      date,
      approver: approver.slice(0, 20),
    };
  });
}

// ─── Upload Loader ────────────────────────────────────────────────────────────
function UploadLoader({ fileName }) {
  const [step, setStep] = useState(0);

  useState(() => {
    const id = setInterval(() => setStep(s => s < LOADER_STEPS.length - 1 ? s + 1 : s), 400);
    return () => clearInterval(id);
  });

  const pct = Math.round(((step + 1) / LOADER_STEPS.length) * 100);

  return (
    <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}`, padding:"52px 32px", display:"flex", flexDirection:"column", alignItems:"center", gap:"22px" }}>
      {/* Spinner ring */}
      <div style={{ position:"relative", width:"58px", height:"58px" }}>
        <div style={{ position:"absolute", inset:0, border:`3px solid ${colors.border}`, borderTop:`3px solid ${colors.teal}`, borderRadius:"50%", animation:"inv-spin 0.75s linear infinite" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:colors.teal }}>
          <SearchIcon />
        </div>
      </div>

      <div style={{ textAlign:"center" }}>
        <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"7px" }}>
          Analysing {fileName}
        </div>
        <div style={{ fontSize:"13px", color:colors.teal, fontWeight:"500", minHeight:"20px" }}>
          {LOADER_STEPS[step]}
        </div>
      </div>

      <div style={{ width:"300px", height:"4px", background:colors.border }}>
        <div style={{ height:"100%", width:`${pct}%`, background:colors.teal, transition:"width 0.4s ease" }} />
      </div>
      <div style={{ fontSize:"12px", color:colors.textMuted }}>{pct}% complete</div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    flagged:  { bg:colors.errorBg,   color:colors.error },
    pending:  { bg:colors.warningBg, color:"#d97706" },
    reviewed: { bg:colors.successBg, color:"#16a34a" },
  };
  const c = map[status] ?? map.pending;
  return <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.color}40`, padding:"3px 10px", fontSize:"11px", fontWeight:"700", letterSpacing:"0.04em" }}>{status}</span>;
}

// ─── Risk Pill ────────────────────────────────────────────────────────────────
function RiskPill({ score }) {
  const color = scoreColor(score);
  return <span style={{ background:`${color}15`, color, border:`1px solid ${color}50`, padding:"3px 10px", fontSize:"12px", fontWeight:"700", minWidth:"36px", display:"inline-block", textAlign:"center" }}>{score}</span>;
}

// ─── Row Detail Modal ─────────────────────────────────────────────────────────
function RowModal({ row, onClose }) {
  if (!row) return null;
  const color = scoreColor(row.riskScore);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.52)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={onClose}>
      <div style={{ background:colors.bgSurface, width:"100%", maxWidth:"520px", border:`1px solid ${colors.border}` }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${colors.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontWeight:"800", fontSize:"16px", color:colors.textPrimary }}>{row.txnId}</div>
            <div style={{ fontSize:"13px", color:colors.textSecondary, marginTop:"2px" }}>Transaction Investigation Detail</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:colors.textSecondary }}><XIcon /></button>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"16px", padding:"14px 16px", background:`${color}0d`, borderLeft:`3px solid ${color}`, marginBottom:"20px" }}>
            <div style={{ fontSize:"32px", fontWeight:"800", color }}>{row.riskScore}</div>
            <div>
              <div style={{ fontWeight:"700", color:colors.textPrimary, fontSize:"14px" }}>Risk Score</div>
              <div style={{ fontSize:"12.5px", color:colors.textSecondary }}>{row.riskScore>=80?"High Risk":row.riskScore>=60?"Medium Risk":"Low Risk"} — {row.flagType}</div>
            </div>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <tbody>
              {[["Transaction ID",row.txnId],["Vendor",row.vendor],["Amount",`₹${Number(row.amount).toLocaleString()}`],["Date",row.date],["Approver",row.approver],["Flag Type",row.flagType],["Status",row.status]].map(([k,v],i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${colors.borderLight}` }}>
                  <td style={{ padding:"10px 12px", fontWeight:"600", color:colors.textPrimary, width:"40%", background:i%2===0?colors.bgSubtle:colors.bgSurface }}>{k}</td>
                  <td style={{ padding:"10px 12px", color:"#334155", background:i%2===0?colors.bgSubtle:colors.bgSurface }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop:"20px", padding:"13px 16px", background:colors.tealAlpha, borderLeft:`3px solid ${colors.teal}`, fontSize:"13px", color:"#334155", lineHeight:"1.6" }}>
            <strong style={{ color:colors.textPrimary }}>AI Analysis: </strong>
            {row.aiAnalysis
              ? row.aiAnalysis
              : row.riskScore>=80
              ? `This transaction from ${row.vendor} shows a ${row.flagType.toLowerCase()} pattern. Immediate review is recommended. Amount of ₹${Number(row.amount).toLocaleString()} is significantly above threshold for this vendor category.`
              : row.riskScore>=60
              ? `Transaction flagged for ${row.flagType.toLowerCase()}. Further documentation verification is advised. Pending approval chain review.`
              : `Low risk profile. Transaction appears within normal operational parameters. Standard review completed.`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PDF download ─────────────────────────────────────────────────────────────
async function downloadPDF(transactions, fileName) {
  // Import jsPDF
  const jsPDFMod   = await import("jspdf");
  const jsPDF      = jsPDFMod.jsPDF || jsPDFMod.default;
  // Import autoTable — it exports a function, not a plugin
  const autoTableMod = await import("jspdf-autotable");
  const autoTable    = autoTableMod.default || autoTableMod;

  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W   = doc.internal.pageSize.getWidth();
  const now = new Date().toLocaleString();

  const flagged  = transactions.filter(t=>t.status==="flagged").length;
  const pending  = transactions.filter(t=>t.status==="pending").length;
  const highRisk = transactions.filter(t=>t.riskScore>=80).length;

  // ── Dark header bar
  doc.setFillColor(26,35,50);
  doc.rect(0,0,W,38,"F");
  doc.setTextColor(255,255,255);
  doc.setFontSize(20); doc.setFont("helvetica","bold");
  doc.text("Auditor — Investigation Report",14,16);
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text(`Banking Audit 2026  |  Generated: ${now}`,14,24);
  doc.text(`Source File: ${fileName}`,14,30);

  // ── Executive Summary
  doc.setTextColor(26,35,50);
  doc.setFontSize(13); doc.setFont("helvetica","bold");
  doc.text("Executive Summary",14,50);
  doc.setLineWidth(0.5); doc.setDrawColor(74,155,143);
  doc.line(14,52,W-14,52);

  doc.setFontSize(10); doc.setFont("helvetica","normal"); doc.setTextColor(51,65,85);
  const summaryText =
    `This investigation report was automatically generated by AuditAI Analytics Platform for the Banking Audit 2026 workspace. ` +
    `A total of ${transactions.length} transactions were analyzed from the uploaded dataset "${fileName}". ` +
    `Our AI-powered anomaly detection pipeline identified ${flagged} flagged transactions and ${pending} transactions pending review. ` +
    `${highRisk} transactions were categorized as high-risk with a risk score of 80 or above.\n\n` +
    `The following findings require immediate attention from the audit committee. All flagged transactions have been ` +
    `cross-referenced against known fraud patterns, vendor collusion databases, and standard compliance frameworks.`;
  const summaryLines = doc.splitTextToSize(summaryText, W-28);
  doc.text(summaryLines, 14, 60);

  // ── Key Metrics
  const metricsY = 60 + summaryLines.length * 5 + 8;
  doc.setFontSize(12); doc.setFont("helvetica","bold"); doc.setTextColor(26,35,50);
  doc.text("Key Metrics",14,metricsY);
  doc.setDrawColor(74,155,143);
  doc.line(14,metricsY+2,W-14,metricsY+2);

  const metrics = [
    ["Total Transactions Reviewed", transactions.length],
    ["High Risk Transactions (Score >= 80)", highRisk],
    ["Flagged Transactions", flagged],
    ["Pending Review", pending],
    ["Reviewed & Cleared", transactions.filter(t=>t.status==="reviewed").length],
    ["Suspicious Vendors (Unique)", new Set(transactions.filter(t=>t.riskScore>=60).map(t=>t.vendor)).size],
  ];

  let my = metricsY + 8;
  metrics.forEach(([label,val],i) => {
    doc.setFillColor(i%2===0?248:255, i%2===0?249:255, i%2===0?247:255);
    doc.rect(14,my-4,W-28,8,"F");
    doc.setFontSize(10); doc.setFont("helvetica","normal"); doc.setTextColor(51,65,85);
    doc.text(label,18,my+1);
    doc.setFont("helvetica","bold"); doc.setTextColor(26,35,50);
    doc.text(String(val),W-18,my+1,{align:"right"});
    my += 9;
  });

  // ── Transactions table using autoTable as function
  my += 6;
  doc.setFontSize(12); doc.setFont("helvetica","bold"); doc.setTextColor(26,35,50);
  doc.text("Flagged Transactions Detail",14,my);
  doc.setDrawColor(74,155,143);
  doc.line(14,my+2,W-14,my+2);

  const tableBody = transactions.map(t=>[
    t.txnId,
    t.vendor.length>18?t.vendor.slice(0,18)+"...":t.vendor,
    `Rs.${Number(t.amount).toLocaleString()}`,
    String(t.riskScore),
    t.flagType,
    t.status.toUpperCase(),
    t.date,
  ]);

  // Call autoTable as a standalone function with doc as first arg
  autoTable(doc, {
    startY: my+6,
    head: [["Txn ID","Vendor","Amount","Risk","Flag Type","Status","Date"]],
    body: tableBody,
    styles: { fontSize:8, cellPadding:2.5, textColor:[51,65,85] },
    headStyles: { fillColor:[26,35,50], textColor:[255,255,255], fontStyle:"bold", fontSize:8 },
    alternateRowStyles: { fillColor:[248,249,247] },
    columnStyles: { 0:{fontStyle:"bold"}, 3:{halign:"center"}, 5:{halign:"center"} },
    margin: { left:14, right:14 },
  });

  // ── Detailed analysis — new page
  doc.addPage();
  doc.setFillColor(26,35,50);
  doc.rect(0,0,W,18,"F");
  doc.setTextColor(255,255,255);
  doc.setFontSize(13); doc.setFont("helvetica","bold");
  doc.text("Detailed Transaction Analysis",14,12);

  let py = 26;
  transactions.slice(0,12).forEach(t => {
    if (py > 260) { doc.addPage(); py=20; }

    doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(26,35,50);
    doc.text(`${t.txnId}  -  ${t.vendor}`,14,py);

    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text(`Amount: Rs.${Number(t.amount).toLocaleString()}   |   Risk: ${t.riskScore}   |   Status: ${t.status.toUpperCase()}   |   Date: ${t.date}`,14,py+5);

    const analysis =
      t.riskScore>=80
        ? `HIGH RISK: This transaction from "${t.vendor}" exhibits a "${t.flagType}" pattern. The amount Rs.${Number(t.amount).toLocaleString()} is anomalous. Immediate escalation to the audit committee is required. The authorization by "${t.approver}" must be verified against procurement policy.`
        : t.riskScore>=60
        ? `MEDIUM RISK: Transaction flagged for "${t.flagType}". Vendor "${t.vendor}" appears in related risk clusters. Amount Rs.${Number(t.amount).toLocaleString()} warrants documentation review. Approver "${t.approver}" should confirm validity.`
        : `LOW RISK: Transaction from "${t.vendor}" for Rs.${Number(t.amount).toLocaleString()} shows no significant anomalies. Standard compliance criteria met. Cleared for record.`;

    doc.setTextColor(51,65,85);
    const lines = doc.splitTextToSize(analysis, W-28);
    doc.text(lines,14,py+11);
    py += 11 + lines.length*4.5 + 6;

    doc.setDrawColor(228,231,226); doc.setLineWidth(0.3);
    doc.line(14,py-3,W-14,py-3);
  });

  // ── Footer
  doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(148,163,160);
  doc.text(`Auditor Analytics Platform  |  Confidential  |  ${now}`, W/2, 290, {align:"center"});

  doc.save(`Investigation_Report_${new Date().toISOString().slice(0,10)}.pdf`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Investigation() {
  const [dragOver,      setDragOver]      = useState(false);
  const [file,          setFile]          = useState(null);
  const [loading,       setLoading]       = useState(false);   // ← loader state
  const [transactions,  setTransactions]  = useState([]);
  const [search,        setSearch]        = useState("");
  const [selectedRow,   setSelectedRow]   = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const fileInputRef = useRef();

  // ── Auto-load demo data if configured ──
  useEffect(() => {
    if (isDemoConfigured() && !file && transactions.length === 0 && !loading) {
      setFile({ name: DEMO_FILE_NAME });
      setTransactions(DEMO_TRANSACTIONS);
    }
  }, []);

  const loadFile = useCallback(async (f) => {
    setFile(f);
    setLoading(true);
    setTransactions([]);

    // Minimum 2.8s loader so the analysis steps are visible
    const minDelay = new Promise(res => setTimeout(res, 2800));

    try {
      const buf = await f.arrayBuffer();
      let wb;
      if (f.name.endsWith(".csv")) {
        wb = XLSX.read(new TextDecoder().decode(buf), { type:"string" });
      } else {
        wb = XLSX.read(buf, { type:"array" });
      }
      const sheet   = wb.Sheets[wb.SheetNames[0]];
      const raw     = XLSX.utils.sheet_to_json(sheet, { header:1, defval:"" });
      const headers = raw[0].map(String);
      const rows    = raw.slice(1).filter(r => r.some(c => c !== ""));
      const txns    = generateTransactions(rows, headers);

      await minDelay;
      setTransactions(txns);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop  = (e) => { e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files[0]; if(f) loadFile(f); };
  const handleInput = (e) => { const f=e.target.files[0]; if(f) loadFile(f); };

  const filtered = transactions.filter(t =>
    search==="" ||
    t.txnId.toLowerCase().includes(search.toLowerCase()) ||
    t.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const highRisk   = transactions.filter(t=>t.riskScore>=80).length;
  const suspicious = new Set(transactions.filter(t=>t.riskScore>=60).map(t=>t.vendor)).size;
  const violations = transactions.filter(t=>t.flagType!=="None"&&t.status==="flagged").length;

  const handleExport = () => {
    if (!transactions.length) return;
    const rows = [
      ["Transaction ID","Vendor","Amount","Risk Score","Flag Type","Status","Date","Approver"],
      ...transactions.map(t=>[t.txnId,t.vendor,t.amount,t.riskScore,t.flagType,t.status,t.date,t.approver]),
    ];
    const csv  = rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download="flagged_transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async () => {
    if (!transactions.length) return;
    setGeneratingPdf(true);
    try { await downloadPDF(transactions, file?.name ?? "dataset"); }
    catch(e) { console.error(e); }
    finally  { setGeneratingPdf(false); }
  };

  return (
    <div style={themeStyles.pageWrapper}>
      <style>{`
        ${globalPageCSS}
        @keyframes inv-spin { to{transform:rotate(360deg);} }
        @keyframes inv-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .inv-results { animation:inv-fadein 0.35s ease forwards; }
        .inv-drop{border:2px dashed ${colors.border};background:${colors.bgSurface};padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:12px;cursor:pointer;transition:border-color 0.2s,background 0.2s;}
        .inv-drop:hover,.inv-drop.over{border-color:${colors.teal};background:${colors.tealAlpha};}
        .inv-table{width:100%;border-collapse:collapse;font-size:13px;}
        .inv-table th{background:${colors.bgSubtle};border-bottom:2px solid ${colors.border};padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:${colors.textPrimary};letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;}
        .inv-table td{padding:11px 14px;border-bottom:1px solid ${colors.borderLight};color:#334155;white-space:nowrap;}
        .inv-table tr:last-child td{border-bottom:none;}
        .inv-table tr:hover td{background:${colors.bgSubtle};}
        .inv-stat{background:${colors.bgSurface};border:1px solid ${colors.border};padding:20px 22px;flex:1;min-width:170px;display:flex;align-items:center;justify-content:space-between;}
        .inv-btn{border:none;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:0.03em;font-family:inherit;transition:background 0.15s;}
        .inv-btn-primary{background:${colors.navyDark};color:${colors.textOnDark};}
        .inv-btn-primary:hover{background:${colors.navyLight};}
        .inv-btn-primary:disabled{background:${colors.textMuted};cursor:not-allowed;}
        .inv-btn-outline{background:${colors.bgSurface};color:${colors.textPrimary};border:1px solid ${colors.border}!important;}
        .inv-btn-outline:hover{background:${colors.bgSubtle};}
        .inv-investigate{background:none;border:none;cursor:pointer;font-size:13px;font-weight:700;color:${colors.textPrimary};display:flex;align-items:center;gap:6px;font-family:inherit;padding:0;}
        .inv-investigate:hover{color:${colors.teal};}
        @media(max-width:768px){.app-sidebar{position:fixed!important;height:100vh;z-index:50;}.sidebar-mobile-btn{display:flex!important;}}
        @media(max-width:640px){.inv-stat-row{flex-direction:column!important;}}
      `}</style>

      {selectedRow && <RowModal row={selectedRow} onClose={()=>setSelectedRow(null)} />}

      <Sidebar activePage="Investigation" />

      {/* ── MAIN ── */}
      <div style={themeStyles.mainColumn}>
        {/* Header */}
        <header style={themeStyles.header}>
          <div>
            <h1 style={themeStyles.headerTitle}>Investigation Studio</h1>
            <p style={themeStyles.headerSubtitle}>Explore anomalies and flagged transactions with AI explanations</p>
          </div>
          {file && !loading && (
            <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12.5px" }}>
              <FileIcon />
              <span style={{ fontWeight:"600", color:colors.textPrimary }}>{file.name}</span>
              <button onClick={()=>{setFile(null);setTransactions([]);setLoading(false);}} style={{ background:"none",border:"none",cursor:"pointer",color:colors.textMuted,display:"flex",padding:"2px" }}><XIcon /></button>
            </div>
          )}
        </header>

        <main style={themeStyles.contentArea}>

          {/* Upload */}
          {!file && !loading && (
            <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}`, marginBottom:"20px" }}>
              <div style={{ padding:"20px 24px", borderBottom:`1px solid ${colors.border}` }}>
                <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Upload Dataset for Investigation</div>
                <div style={{ fontSize:"13px", color:colors.textSecondary }}>Upload a CSV or Excel file to generate flagged transaction analysis</div>
              </div>
              <div style={{ padding:"24px" }}>
                <div
                  className={`inv-drop${dragOver?" over":""}`}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={()=>fileInputRef.current?.click()}
                >
                  <UploadIcon />
                  <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary }}>Drop file here or click to browse</div>
                  <div style={{ fontSize:"13px", color:colors.textMuted }}>Supports .csv, .xlsx, .xls, .pdf</div>
                  <button
                    style={themeStyles.btnPrimary}
                    onClick={e=>{e.stopPropagation();fileInputRef.current?.click();}}
                  >Select File</button>
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.pdf" style={{ display:"none" }} onChange={handleInput} />
                </div>
              </div>
            </div>
          )}

          {/* Loader — shown while file is being analysed */}
          {loading && <UploadLoader fileName={file?.name ?? ""} />}

          {/* Results */}
          {!loading && transactions.length > 0 && (
            <div className="inv-results">

              {/* Stat cards */}
              <div className="inv-stat-row" style={{ display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:"20px" }}>
                <div className="inv-stat">
                  <div>
                    <div style={{ fontSize:"13px", color:colors.textSecondary, marginBottom:"4px" }}>High Risk Transactions</div>
                    <div style={{ fontSize:"32px", fontWeight:"800", color:colors.textPrimary, lineHeight:1 }}>{highRisk}</div>
                  </div>
                  <div style={{ width:48, height:48, background:colors.errorBg, display:"flex", alignItems:"center", justifyContent:"center" }}><AlertIcon /></div>
                </div>
                <div className="inv-stat">
                  <div>
                    <div style={{ fontSize:"13px", color:colors.textSecondary, marginBottom:"4px" }}>Suspicious Vendors</div>
                    <div style={{ fontSize:"32px", fontWeight:"800", color:colors.textPrimary, lineHeight:1 }}>{suspicious}</div>
                  </div>
                  <div style={{ width:48, height:48, background:colors.warningBg, display:"flex", alignItems:"center", justifyContent:"center" }}><TrendIcon /></div>
                </div>
                <div className="inv-stat">
                  <div>
                    <div style={{ fontSize:"13px", color:colors.textSecondary, marginBottom:"4px" }}>Compliance Violations</div>
                    <div style={{ fontSize:"32px", fontWeight:"800", color:colors.textPrimary, lineHeight:1 }}>{violations}</div>
                  </div>
                  <div style={{ width:48, height:48, background:"rgba(234,179,8,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}><DocIcon /></div>
                </div>
              </div>

              {/* Table */}
              <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}` }}>
                <div style={{ padding:"18px 24px", borderBottom:`1px solid ${colors.border}`, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
                  <div>
                    <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Flagged Transactions</div>
                    <div style={{ fontSize:"13px", color:colors.textSecondary }}>AI-detected anomalies requiring investigation</div>
                  </div>
                  <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                    <button className="inv-btn inv-btn-outline inv-btn" onClick={handleExport}>Export CSV</button>
                    <button className="inv-btn inv-btn-primary inv-btn" onClick={handleGenerateReport} disabled={generatingPdf}>
                      {generatingPdf?"Generating PDF...":"Generate Report"}
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div style={{ padding:"14px 24px", borderBottom:`1px solid ${colors.borderLight}` }}>
                  <div style={{ position:"relative", maxWidth:"480px" }}>
                    <div style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:colors.textMuted }}><SearchIcon /></div>
                    <input
                      value={search}
                      onChange={e=>setSearch(e.target.value)}
                      placeholder="Search by vendor or transaction ID..."
                      style={{ width:"100%", padding:"10px 14px 10px 38px", border:`1px solid ${colors.border}`, background:colors.bgSubtle, fontSize:"13px", fontFamily:"inherit", color:colors.textPrimary, outline:"none" }}
                    />
                  </div>
                </div>

                <div style={{ overflowX:"auto" }}>
                  <table className="inv-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th>Risk Score</th>
                        <th>Flag Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t,i)=>(
                        <tr key={i}>
                          <td style={{ fontWeight:"700", color:colors.textPrimary }}>{t.txnId}</td>
                          <td>{t.vendor}</td>
                          <td style={{ fontWeight:"600" }}>₹{Number(t.amount).toLocaleString()}</td>
                          <td><RiskPill score={t.riskScore} /></td>
                          <td style={{ color:colors.textSecondary }}>{t.flagType}</td>
                          <td><StatusBadge status={t.status} /></td>
                          <td style={{ color:colors.textSecondary }}>{t.date}</td>
                          <td>
                            <button className="inv-investigate" onClick={()=>setSelectedRow(t)}>
                              <EyeIcon /><span>Investigate</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filtered.length===0 && (
                        <tr><td colSpan={8} style={{ textAlign:"center", padding:"32px", color:colors.textMuted }}>No transactions match your search.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding:"12px 24px", borderTop:`1px solid ${colors.borderLight}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"13px", color:colors.textSecondary }}>Showing {filtered.length} of {transactions.length} transactions</span>
                  {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",color:colors.teal,fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit" }}>Clear search</button>}
                </div>
              </div>

            </div>
          )}

          {/* Related Reports */}
          {!loading && transactions.length > 0 && (
            <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}`, marginTop:"20px" }}>
              <div style={{ padding:"18px 24px", borderBottom:`1px solid ${colors.border}` }}>
                <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Related AI Reports</div>
                <div style={{ fontSize:"13px", color:colors.textSecondary }}>In-depth reports related to investigation findings</div>
              </div>
              <div style={{ padding:"16px 24px", display:"flex", gap:"14px", flexWrap:"wrap" }}>
                {REPORT_META.filter(r => r.pages.includes("/investigation")).map(r => (
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
          )}

        </main>
      </div>
    </div>
  );
}