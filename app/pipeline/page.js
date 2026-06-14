"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import { colors, styles as themeStyles, globalPageCSS } from "../theme";
import { isDemoConfigured, DEMO_FILE_NAME, DEMO_PIPELINE_RESULTS, LEDGER_HEADERS, LEDGER_ROWS } from "../data/dummyData";
import { REPORT_META, REPORTS } from "../data/reports";

// ─── Page-specific Icons ──────────────────────────────────────────────────────
function UploadIcon()   { return <svg width="36" height="36" fill="none" stroke={colors.textMuted} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function XIcon()        { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function ChevronRight() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>; }
function CheckCircle({ color=colors.success }) { return <svg width="22" height="22" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>; }
function ClockIcon()    { return <svg width="22" height="22" fill="none" stroke={colors.textMuted} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function FileIcon()     { return <svg width="20" height="20" fill="none" stroke={colors.teal} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>; }

// ─── Step Definitions with sub-step messages ──────────────────────────────────
const STEP_DEFS = [
  {
    id: 1, title: "Upload Data", desc: "Financial data uploaded successfully", duration: 10000,
    substeps: ["Validating file format...","Reading binary stream...","Parsing sheet structure...","Indexing rows & columns...","Verifying data integrity...","Checksum validation...","File ready for pipeline"],
  },
  {
    id: 2, title: "Schema Extraction", desc: "Detected columns and data types", duration: 13000,
    substeps: ["Scanning column headers...","Sampling cell values...","Inferring numeric columns...","Inferring date columns...","Detecting text columns...","Validating type consistency...","Building schema map...","Schema extraction complete"],
  },
  {
    id: 3, title: "Schema Standardization", desc: "Mapped to standard audit schema", duration: 11000,
    substeps: ["Loading audit schema template...","Mapping column names...","Applying snake_case convention...","Resolving ambiguous fields...","Checking for missing required fields...","Generating field aliases...","Standardization complete"],
  },
  {
    id: 4, title: "Data Normalization", desc: "Cleaned and standardized values", duration: 14000,
    substeps: ["Trimming whitespace from all cells...","Handling null & empty values...","Standardizing date formats...","Normalizing numeric precision...","Removing duplicate rows...","Encoding categorical values...","Validating cleaned dataset...","Normalization complete"],
  },
  {
    id: 5, title: "Anomaly Detection", desc: "Identified suspicious patterns", duration: 15000,
    substeps: ["Loading statistical models...","Computing column means & std devs...","Applying 3σ outlier threshold...","Scanning for duplicate transactions...","Cross-referencing fraud patterns...","Clustering suspicious entries...","Ranking anomalies by severity...","Generating anomaly report...","Detection complete"],
  },
  {
    id: 6, title: "Graph Analysis", desc: "Building relationship graph", duration: 14000,
    substeps: ["Identifying entity columns...","Building node index...","Constructing edge relationships...","Detecting connected components...","Computing centrality scores...","Identifying high-degree nodes...","Running community detection...","Graph built successfully"],
  },
  {
    id: 7, title: "Risk Scoring", desc: "Calculate risk scores", duration: 12000,
    substeps: ["Loading risk model weights...","Extracting risk features...","Computing transaction risk scores...","Applying entity-level scoring...","Cross-referencing anomaly flags...","Normalizing score distribution...","Classifying High / Medium / Low...","Risk scoring complete"],
  },
  {
    id: 8, title: "Report Generation", desc: "Generate audit report", duration: 10000,
    substeps: ["Collecting pipeline outputs...","Compiling summary statistics...","Formatting findings...","Building executive summary...","Validating report completeness...","Audit report ready"],
  },
];

// ─── Real computation per step ────────────────────────────────────────────────
function computeStep(stepId, data) {
  const { headers, rows } = data;
  switch (stepId) {
    case 1: return {
      summary: `${rows.length.toLocaleString()} rows and ${headers.length} columns loaded successfully.`,
      details: { "Total Rows": rows.length, "Total Columns": headers.length, "Column Names": headers.join(", "), "Sample Row": headers.map((h,i)=>`${h}: ${rows[0]?.[i]??"-"}`).join(" | ") },
    };
    case 2: {
      const types = headers.map((h,ci)=>{
        const vals = rows.map(r=>r[ci]).filter(v=>v!=="");
        const nums = vals.filter(v=>!isNaN(Number(v))).length;
        const dates = vals.filter(v=>!isNaN(Date.parse(v))&&isNaN(Number(v))).length;
        return { col:h, type: nums/vals.length>0.8?"Number":dates/vals.length>0.6?"Date":"Text" };
      });
      return {
        summary: `Detected ${types.filter(t=>t.type==="Number").length} numeric, ${types.filter(t=>t.type==="Date").length} date, ${types.filter(t=>t.type==="Text").length} text columns.`,
        details: Object.fromEntries(types.map(t=>[t.col,t.type])),
        table: types.map(t=>({ Column:t.col, "Detected Type":t.type })),
      };
    }
    case 3: {
      const mapped = headers.map(h=>({ original:h, standardized:h.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"") }));
      return {
        summary: `${mapped.length} columns mapped to snake_case audit schema.`,
        details: Object.fromEntries(mapped.map(m=>[m.original,m.standardized])),
        table: mapped.map(m=>({ Original:m.original, Standardized:m.standardized })),
      };
    }
    case 4: {
      let blanks=0, trimCount=0;
      rows.forEach(row=>row.forEach(cell=>{ if(cell===""||cell===null)blanks++; else if(String(cell)!==String(cell).trim())trimCount++; }));
      const total = rows.length*headers.length;
      return {
        summary: `${total.toLocaleString()} cells processed. ${blanks} blanks found, ${trimCount} values trimmed.`,
        details: { "Total Cells":total, "Blank Cells":blanks, "Values Trimmed":trimCount, "Fill Rate":`${(((total-blanks)/total)*100).toFixed(1)}%`, "Quality Score":`${Math.round(((total-blanks)/total)*100)}/100` },
      };
    }
    case 5: {
      const numCols = headers.map((h,ci)=>{
        const vals = rows.map(r=>Number(r[ci])).filter(v=>!isNaN(v)&&v!==0);
        return { col:h, vals };
      }).filter(c=>c.vals.length>rows.length*0.4);
      const anomalies = numCols.map(({col,vals})=>{
        const mean = vals.reduce((a,b)=>a+b,0)/vals.length;
        const std = Math.sqrt(vals.map(v=>(v-mean)**2).reduce((a,b)=>a+b,0)/vals.length);
        const outliers = vals.filter(v=>Math.abs(v-mean)>3*std).length;
        return { col, outliers, mean:mean.toFixed(2), std:std.toFixed(2) };
      }).filter(a=>a.outliers>0);
      const dupes = rows.length - new Set(rows.map(r=>r.join("|"))).size;
      return {
        summary: `${anomalies.length} columns with outliers detected. ${dupes} duplicate rows found.`,
        details: { "Duplicate Rows":dupes, "Columns With Outliers":anomalies.length, "Outlier Columns":anomalies.map(a=>a.col).join(", ")||"None" },
        table: anomalies.length>0 ? anomalies.map(a=>({ Column:a.col, Outliers:a.outliers, Mean:a.mean, "Std Dev":a.std })) : [{ Result:"No significant outliers detected" }],
      };
    }
    case 6: {
      const relCols = headers.map((h,ci)=>{
        const vals = rows.map(r=>r[ci]).filter(v=>v!=="");
        const unique = new Set(vals).size;
        return { col:h, unique, total:vals.length };
      }).filter(c=>c.unique<c.total*0.5&&c.unique>1);
      return {
        summary: `${relCols.length} relational columns found. Graph contains ${rows.length} nodes.`,
        details: { "Graph Nodes":rows.length, "Relational Columns":relCols.map(c=>c.col).join(", ")||"None", "Estimated Edges":rows.length*(relCols.length||1) },
        table: relCols.map(c=>({ Column:c.col, "Unique Values":c.unique, "Total Values":c.total, "Cardinality":`${((c.unique/c.total)*100).toFixed(1)}%` })),
      };
    }
    case 7: {
      const numCols = headers.map((h,ci)=>{
        const vals = rows.map(r=>Number(r[ci])).filter(v=>!isNaN(v)&&v>0);
        return { col:h, vals, sum:vals.reduce((a,b)=>a+b,0) };
      }).filter(c=>c.vals.length>0).sort((a,b)=>b.sum-a.sum);
      const top = numCols[0];
      const scores = top ? rows.slice(0,8).map((row,i)=>{
        const val = Number(row[headers.indexOf(top.col)]);
        const score = Math.min(100,Math.round((val/top.sum)*10000));
        return { Row:i+1, [top.col]:isNaN(val)?"-":val, "Risk Score":score, Level:score>20?"High":score>10?"Medium":"Low" };
      }) : [];
      return {
        summary: `Risk scores computed. ${scores.filter(s=>s.Level==="High").length} high-risk entries in sample.`,
        details: { "Scoring Column":top?.col??"N/A", "Column Total":top?.sum?.toFixed(2)??"N/A", "High Risk":scores.filter(s=>s.Level==="High").length, "Medium Risk":scores.filter(s=>s.Level==="Medium").length, "Low Risk":scores.filter(s=>s.Level==="Low").length },
        table: scores,
      };
    }
    case 8: return {
      summary: "Audit report generated covering all 8 pipeline stages.",
      details: { "Report Date":new Date().toLocaleDateString(), "Total Rows Audited":rows.length, "Columns Analyzed":headers.length, "Pipeline Stages":"8 / 8", "Status":"Complete", "Output Format":"JSON + Executive Summary" },
    };
    default: return { summary:"Step completed.", details:{} };
  }
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    completed:  { bg:colors.successBg,  color:"#16a34a", label:"completed"  },
    processing: { bg:colors.infoBg,     color:"#2563eb", label:"processing" },
    pending:    { bg:colors.bgSubtle,   color:colors.textSecondary, label:"pending"    },
  };
  const c = map[status] ?? map.pending;
  return <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.color}40`, padding:"2px 10px", fontSize:"11px", fontWeight:"700", letterSpacing:"0.05em" }}>{c.label}</span>;
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ size=22, color=colors.info }) {
  return <div style={{ width:size, height:size, border:`2.5px solid ${color}25`, borderTop:`2.5px solid ${color}`, borderRadius:"50%", animation:"pb-spin 0.75s linear infinite", flexShrink:0 }} />;
}

// ─── Step Row ─────────────────────────────────────────────────────────────────
function StepRow({ step, isLast, onClick }) {
  const done = step.status==="completed", proc=step.status==="processing", pend=step.status==="pending";
  return (
    <div style={{ position:"relative" }}>
      <div
        onClick={done ? onClick : undefined}
        style={{ display:"flex", alignItems:"flex-start", gap:"16px", padding:"18px 24px", background:pend?colors.bgSubtle:colors.bgSurface, border:`1px solid ${proc?colors.info:colors.border}`, cursor:done?"pointer":"default", transition:"box-shadow 0.15s" }}
        onMouseEnter={e=>{ if(done) e.currentTarget.style.boxShadow="0 2px 14px rgba(0,0,0,0.08)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; }}
      >
        {/* Number bubble */}
        <div style={{ width:36, height:36, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:"700", background:done?colors.successBg:proc?colors.infoBg:colors.bgSubtle, color:done?"#16a34a":proc?"#2563eb":colors.textMuted }}>
          {step.id}
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
            <span style={{ fontWeight:"700", fontSize:"14.5px", color:pend?colors.textMuted:colors.textPrimary }}>{step.title}</span>
            <StatusBadge status={step.status} />
          </div>
          <div style={{ fontSize:"13px", color:pend?colors.textMuted:colors.textSecondary, marginTop:"3px" }}>{step.desc}</div>

          {/* Live sub-step message */}
          {proc && step.currentMsg && (
            <div style={{ fontSize:"12px", color:colors.info, marginTop:"6px", fontWeight:"500", display:"flex", alignItems:"center", gap:"6px" }}>
              <Spinner size={12} color={colors.info} />
              {step.currentMsg}
            </div>
          )}

          {/* Progress bar while processing */}
          {proc && (
            <div style={{ marginTop:"8px", height:"3px", background:colors.border, width:"100%" }}>
              <div style={{ height:"100%", background:colors.info, width:`${step.progress??0}%`, transition:"width 0.5s ease" }} />
            </div>
          )}

          {/* Completed summary */}
          {done && step.result && (
            <div style={{ fontSize:"12px", color:colors.teal, marginTop:"5px", fontWeight:"500" }}>{step.result.summary}</div>
          )}
        </div>

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0, marginTop:"4px" }}>
          {done && <span style={{ fontSize:"12px", color:colors.teal, fontWeight:"600", whiteSpace:"nowrap" }}>View Details</span>}
          {done  && <CheckCircle color="#22c55e" />}
          {proc  && <Spinner />}
          {pend  && <ClockIcon />}
          {done  && <ChevronRight />}
        </div>
      </div>

      {/* Connector */}
      {!isLast && (
        <div style={{ display:"flex", justifyContent:"flex-start", paddingLeft:"42px", height:"18px" }}>
          <div style={{ width:"2px", height:"100%", background:done?"rgba(34,197,94,0.35)":colors.border }} />
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ step, onClose }) {
  if (!step?.result) return null;
  const { result } = step;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.52)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={onClose}>
      <div style={{ background:colors.bgSurface, width:"100%", maxWidth:"700px", maxHeight:"82vh", overflowY:"auto", border:`1px solid ${colors.border}` }} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${colors.border}`, display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
              <div style={{ width:28, height:28, background:colors.teal, color:colors.textOnDark, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"700" }}>{step.id}</div>
              <span style={{ fontWeight:"700", fontSize:"16px", color:colors.textPrimary }}>{step.title}</span>
              <StatusBadge status="completed" />
            </div>
            <div style={{ fontSize:"13px", color:colors.textSecondary, marginTop:"4px" }}>{step.desc}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:colors.textSecondary, padding:"4px", flexShrink:0 }}><XIcon /></button>
        </div>

        <div style={{ padding:"20px 24px" }}>
          {/* Summary banner */}
          <div style={{ background:colors.tealAlpha, borderLeft:`3px solid ${colors.teal}`, padding:"12px 16px", marginBottom:"20px", fontSize:"13.5px", color:colors.textPrimary, fontWeight:"500" }}>
            {result.summary}
          </div>

          {/* Details */}
          {result.details && Object.keys(result.details).length>0 && (
            <>
              <div style={{ fontSize:"11px", fontWeight:"700", color:colors.textPrimary, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:"10px" }}>Details</div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px", marginBottom:"20px" }}>
                <tbody>
                  {Object.entries(result.details).map(([k,v],i)=>(
                    <tr key={i} style={{ borderBottom:"1px solid #f0f2ee" }}>
                      <td style={{ padding:"9px 12px", fontWeight:"600", color:colors.textPrimary, width:"40%", background:i%2===0?colors.bgSubtle:colors.bgSurface }}>{k}</td>
                      <td style={{ padding:"9px 12px", color:"#334155", background:i%2===0?colors.bgSubtle:colors.bgSurface, wordBreak:"break-all" }}>{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Data table */}
          {result.table && result.table.length>0 && (
            <>
              <div style={{ fontSize:"11px", fontWeight:"700", color:colors.textPrimary, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:"10px" }}>Data Output</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12.5px" }}>
                  <thead>
                    <tr>{Object.keys(result.table[0]).map((k,i)=><th key={i} style={{ background:colors.navyDark, color:colors.textOnDark, padding:"9px 12px", textAlign:"left", fontSize:"11px", fontWeight:"700", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{k}</th>)}</tr>
                  </thead>
                  <tbody>
                    {result.table.map((row,ri)=>(
                      <tr key={ri}>
                        {Object.values(row).map((v,ci)=><td key={ci} style={{ padding:"9px 12px", borderBottom:"1px solid #f0f2ee", color:"#334155" }}>{String(v)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PipelineBuilder() {
  const [file, setFile]               = useState(null);
  const [parsedData, setParsedData]   = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const [steps, setSteps]             = useState(STEP_DEFS.map(s=>({ ...s, status:"pending", result:null, progress:0, currentMsg:"" })));
  const [running, setRunning]         = useState(false);
  const [modalStep, setModalStep]     = useState(null);
  const fileInputRef                  = useRef();
  const runRef                        = useRef(false);

  const completedCount  = steps.filter(s=>s.status==="completed").length;
  const processingCount = steps.filter(s=>s.status==="processing").length;
  const pendingCount    = steps.filter(s=>s.status==="pending").length;
  const progress        = Math.round((completedCount/steps.length)*100);

  // ── Parse & auto-trigger pipeline ──────────────────────────────────────────
  const loadAndRun = useCallback(async (f) => {
    setFile(f);
    setParsedData(null);
    runRef.current = false;
    setRunning(false);
    setSteps(STEP_DEFS.map(s=>({ ...s, status:"pending", result:null, progress:0, currentMsg:"" })));

    const buf = await f.arrayBuffer();
    let wb;
    try {
      if (f.name.endsWith(".csv")) {
        wb = XLSX.read(new TextDecoder().decode(buf), { type:"string" });
      } else {
        wb = XLSX.read(buf, { type:"array" });
      }
    } catch(e) { return; }

    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw   = XLSX.utils.sheet_to_json(sheet, { header:1, defval:"" });
    const headers = raw[0].map(String);
    const rows    = raw.slice(1).filter(r=>r.some(c=>c!==""));
    const data    = { headers, rows };
    setParsedData(data);

    // ── Auto-run pipeline ──────────────────────────────────────────────────
    runRef.current = true;
    setRunning(true);
    setSteps(STEP_DEFS.map(s=>({ ...s, status:"pending", result:null, progress:0, currentMsg:"" })));

    for (let i=0; i<STEP_DEFS.length; i++) {
      if (!runRef.current) break;
      const def = STEP_DEFS[i];
      const substeps = def.substeps;
      const intervalMs = Math.floor(def.duration / substeps.length);

      // mark processing
      setSteps(prev=>prev.map((s,idx)=>idx===i ? { ...s, status:"processing", progress:0, currentMsg:substeps[0] } : s));

      // tick through substeps + progress bar
      for (let si=0; si<substeps.length; si++) {
        if (!runRef.current) break;
        await new Promise(res=>setTimeout(res, intervalMs));
        const pct = Math.round(((si+1)/substeps.length)*100);
        const msg = substeps[Math.min(si+1, substeps.length-1)];
        setSteps(prev=>prev.map((s,idx)=>idx===i ? { ...s, progress:pct, currentMsg:msg } : s));
      }

      if (!runRef.current) break;

      const result = computeStep(def.id, data);
      setSteps(prev=>prev.map((s,idx)=>idx===i ? { ...s, status:"completed", result, progress:100, currentMsg:"" } : s));
    }

    setRunning(false);
  }, []);

  const handleDrop  = (e) => { e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files[0]; if(f) loadAndRun(f); };
  const handleInput = (e) => { const f=e.target.files[0]; if(f) loadAndRun(f); };

  const resetPipeline = () => {
    runRef.current = false;
    setRunning(false);
    setFile(null);
    setParsedData(null);
    setSteps(STEP_DEFS.map(s=>({ ...s, status:"pending", result:null, progress:0, currentMsg:"" })));
  };

  useEffect(()=>()=>{ runRef.current=false; }, []);

  // ── Auto-load demo data if configured ──
  useEffect(() => {
    if (isDemoConfigured() && !file && !parsedData) {
      const mockFile = { name: DEMO_FILE_NAME };
      setFile(mockFile);
      setParsedData({ headers: LEDGER_HEADERS, rows: LEDGER_ROWS });
      setSteps(DEMO_PIPELINE_RESULTS.map(s => ({
        ...STEP_DEFS.find(d => d.id === s.id),
        ...s,
        progress: 100,
        currentMsg: "",
      })));
    }
  }, []);

  // keep modal in sync with live step data
  useEffect(()=>{
    if (modalStep) {
      const live = steps.find(s=>s.id===modalStep.id);
      if (live) setModalStep(live);
    }
  }, [steps]);

  return (
    <div style={themeStyles.pageWrapper}>
      <style>{`
        ${globalPageCSS}
        @keyframes pb-spin { to { transform:rotate(360deg); } }
        @keyframes pb-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .pb-drop { border:2px dashed ${colors.border}; background:${colors.bgSurface}; padding:44px 24px; display:flex; flex-direction:column; align-items:center; gap:12px; cursor:pointer; transition:border-color 0.2s,background 0.2s; }
        .pb-drop:hover,.pb-drop.over { border-color:${colors.teal}; background:${colors.tealAlpha}; }
        .pb-stat { background:${colors.bgSurface}; border:1px solid ${colors.border}; padding:16px 20px; flex:1; min-width:130px; }
        .pb-btn { border:none; padding:10px 20px; font-size:13px; font-weight:700; cursor:pointer; letter-spacing:0.04em; text-transform:uppercase; font-family:inherit; transition:background 0.15s; }
        .pb-btn-outline { background:${colors.bgSurface}; color:${colors.textPrimary}; border:1px solid ${colors.textPrimary} !important; }
        .pb-btn-outline:hover { background:${colors.bgSubtle}; }
        .pb-btn-danger { background:${colors.bgSurface}; color:${colors.error}; border:1px solid ${colors.error} !important; }
        .pb-btn-danger:hover { background:${colors.errorBg}; }
        @media(max-width:768px){ .app-sidebar{position:fixed!important;height:100vh;z-index:50;} .sidebar-mobile-btn{display:flex!important;} }
        @media(max-width:560px){ .pb-stat-row{flex-direction:column!important;} }
      `}</style>

      {modalStep && <Modal step={modalStep} onClose={()=>setModalStep(null)} />}

      <Sidebar activePage="Pipeline Builder" />

      {/* ── MAIN ── */}
      <div style={themeStyles.mainColumn}>
        {/* Header */}
        <header style={themeStyles.header}>
          <div>
            <h1 style={themeStyles.headerTitle}>Audit Pipeline Builder</h1>
            <p style={themeStyles.headerSubtitle}>Visual workflow showing AI-powered data processing steps</p>
          </div>
          {file && (
            <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12.5px" }}>
              <FileIcon />
              <span style={{ fontWeight:"600", color:colors.textPrimary }}>{file.name}</span>
              <button onClick={resetPipeline} style={{ background:"none", border:"none", cursor:"pointer", color:colors.textMuted, display:"flex", padding:"2px" }}><XIcon /></button>
            </div>
          )}
        </header>

        {/* Content */}
        <main style={themeStyles.contentArea}>

          {/* Upload — shown when no file */}
          {!file && (
            <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}`, marginBottom:"20px" }}>
              <div style={{ padding:"20px 24px", borderBottom:`1px solid ${colors.border}` }}>
                <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Upload Dataset to Begin</div>
                <div style={{ fontSize:"13px", color:colors.textSecondary }}>Drop a CSV or Excel file — the pipeline starts automatically</div>
              </div>
              <div style={{ padding:"24px" }}>
                <div
                  className={`pb-drop${dragOver?" over":""}`}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={()=>fileInputRef.current?.click()}
                >
                  <UploadIcon />
                  <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary }}>Drop file here or click to browse</div>
                  <div style={{ fontSize:"13px", color:colors.textMuted }}>Supports .csv, .xlsx, .xls, .pdf — pipeline runs automatically on upload</div>
                  <button
                    style={themeStyles.btnPrimary}
                    onClick={e=>{e.stopPropagation();fileInputRef.current?.click();}}
                  >
                    Select File
                  </button>
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.pdf" style={{ display:"none" }} onChange={handleInput} />
                </div>
              </div>
            </div>
          )}

          {/* Stat cards */}
          {file && (
            <div className="pb-stat-row" style={{ display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:"20px" }}>
              {[
                { label:"Completed",  value:completedCount,  bar:colors.success },
                { label:"Processing", value:processingCount, bar:colors.info },
                { label:"Pending",    value:pendingCount,    bar:colors.textMuted },
                { label:"Progress",   value:`${progress}%`,  bar:colors.teal },
              ].map(({ label, value, bar })=>(
                <div key={label} className="pb-stat">
                  <div style={{ fontSize:"28px", fontWeight:"800", color:colors.textPrimary, lineHeight:1 }}>{value}</div>
                  <div style={{ fontSize:"13px", color:colors.textSecondary, marginTop:"4px" }}>{label}</div>
                  <div style={{ height:"3px", background:bar, marginTop:"10px" }} />
                </div>
              ))}
            </div>
          )}

          {/* Pipeline steps */}
          {file && (
            <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}`, marginBottom:"20px" }}>
              <div style={{ padding:"20px 24px", borderBottom:`1px solid ${colors.border}`, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"10px" }}>
                <div>
                  <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Pipeline Workflow</div>
                  <div style={{ fontSize:"13px", color:colors.textSecondary }}>Each step shows the AI processing logic and results — click any completed step to view details</div>
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button className="pb-btn pb-btn-danger pb-btn" onClick={resetPipeline}>Reset Pipeline</button>
                </div>
              </div>

              <div style={{ padding:"16px 24px" }}>
                {steps.map((step,i)=>(
                  <StepRow
                    key={step.id}
                    step={step}
                    isLast={i===steps.length-1}
                    onClick={()=>setModalStep(step)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related Reports */}
          {file && completedCount === steps.length && (
            <div style={{ background:colors.bgSurface, border:`1px solid ${colors.border}`, marginTop:"4px" }}>
              <div style={{ padding:"18px 24px", borderBottom:`1px solid ${colors.border}` }}>
                <div style={{ fontWeight:"700", fontSize:"15px", color:colors.textPrimary, marginBottom:"2px" }}>Generated Reports</div>
                <div style={{ fontSize:"13px", color:colors.textSecondary }}>AI reports generated from this pipeline run</div>
              </div>
              <div style={{ padding:"16px 24px", display:"flex", gap:"14px", flexWrap:"wrap" }}>
                {REPORT_META.filter(r => r.pages.includes("/pipeline")).map(r => (
                  <a key={r.id} href="/reports" style={{ textDecoration:"none", flex:"1 1 260px", display:"flex", alignItems:"center", gap:"14px", padding:"14px 18px", background:colors.bgSubtle, border:`1px solid ${colors.border}`, borderLeft:`3px solid ${r.color}`, cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.bgSurface}
                    onMouseLeave={e => e.currentTarget.style.background = colors.bgSubtle}
                  >
                    <div style={{ width:"40px", height:"40px", background:`${r.color}15`, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"4px", fontSize:"18px", flexShrink:0 }}>
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