"use client";

import { colors } from "../theme";

/**
 * Simple Markdown → React renderer.
 * Supports: headings, tables, bold, inline code, code blocks, lists, horizontal rules, paragraphs.
 * No external dependencies.
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line → skip
    if (line.trim() === "") { i++; continue; }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} style={{ border: "none", borderTop: `1px solid ${colors.border}`, margin: "20px 0" }} />);
      i++; continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const sizes = { 1: "22px", 2: "18px", 3: "15px", 4: "13.5px", 5: "12px", 6: "11px" };
      const margins = { 1: "28px 0 12px", 2: "24px 0 10px", 3: "20px 0 8px", 4: "16px 0 6px", 5: "12px 0 4px", 6: "10px 0 4px" };
      elements.push(
        <div key={i} style={{ fontSize: sizes[level], fontWeight: "700", color: level <= 2 ? colors.navyDark : colors.textPrimary, margin: margins[level], letterSpacing: "0.01em", lineHeight: "1.3" }}>
          {inlineFormat(text)}
        </div>
      );
      i++; continue;
    }

    // Code block (```)
    if (line.trim().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={`code-${i}`} style={{ background: colors.bgSubtle, border: `1px solid ${colors.border}`, padding: "14px 16px", fontSize: "12.5px", fontFamily: "'Fira Code', 'Consolas', monospace", lineHeight: "1.6", overflowX: "auto", margin: "12px 0", color: colors.textPrimary, whiteSpace: "pre-wrap" }}>
          {codeLines.join("\n")}
        </pre>
      );
      continue;
    }

    // Table
    if (line.includes("|") && line.trim().startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<MarkdownTable key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: "8px 0", paddingLeft: "24px", color: colors.textPrimary, fontSize: "13.5px", lineHeight: "1.8" }}>
          {listItems.map((item, j) => <li key={j}>{inlineFormat(item)}</li>)}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ margin: "8px 0", paddingLeft: "24px", color: colors.textPrimary, fontSize: "13.5px", lineHeight: "1.8" }}>
          {listItems.map((item, j) => <li key={j}>{inlineFormat(item)}</li>)}
        </ol>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} style={{ margin: "6px 0", color: colors.textPrimary, fontSize: "13.5px", lineHeight: "1.7" }}>
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}

// ─── Inline formatting: bold, inline code, links ──────────────────────────────
function inlineFormat(text) {
  // Split on bold (**...**), inline code (`...`), and plain text
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[1];
    if (token.startsWith("**")) {
      parts.push(<strong key={match.index} style={{ fontWeight: "700" }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={match.index} style={{ background: colors.bgSubtle, padding: "2px 6px", fontSize: "12px", fontFamily: "'Fira Code', monospace", border: `1px solid ${colors.border}` }}>
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

// ─── Table component ──────────────────────────────────────────────────────────
function MarkdownTable({ lines }) {
  if (lines.length < 2) return null;
  const parseRow = (line) => line.split("|").map(c => c.trim()).filter(Boolean);
  const headers = parseRow(lines[0]);
  // Skip separator row (|---|---|)
  const startIdx = lines[1] && /^[\s|:-]+$/.test(lines[1]) ? 2 : 1;
  const rows = lines.slice(startIdx).map(parseRow);

  return (
    <div style={{ overflowX: "auto", margin: "12px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", fontFamily: "inherit" }}>
        <thead>
          <tr>
            {headers.map((h, j) => (
              <th key={j} style={{ textAlign: "left", padding: "10px 14px", background: colors.navyDark, color: colors.textOnDark, fontWeight: "600", fontSize: "11.5px", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: `2px solid ${colors.teal}` }}>
                {inlineFormat(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? colors.bgSurface : colors.bgSubtle }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "9px 14px", borderBottom: `1px solid ${colors.border}`, color: colors.textPrimary, whiteSpace: "nowrap" }}>
                  {formatCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(text) {
  // Emoji-like status markers
  if (text === "✅ Match" || text === "✅ Verified" || text.startsWith("✅")) return <span style={{ color: colors.success, fontWeight: "600" }}>{text}</span>;
  if (text === "❌" || text.startsWith("❌")) return <span style={{ color: colors.error, fontWeight: "600" }}>{text}</span>;
  if (text.startsWith("⚠️")) return <span style={{ color: colors.warning, fontWeight: "600" }}>{text}</span>;
  return inlineFormat(text);
}
