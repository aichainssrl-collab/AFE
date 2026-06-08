/* ============================================================
   AIchain Finance Engine — Icons + SVG charts
   ============================================================ */

/* ---------------- Icon set ---------------- */
const ICON_PATHS = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  bolt: "M13 3 5 13h5l-1 8 8-11h-5z",
  target: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M12 12m-0.6 0a0.6 0.6 0 1 0 1.2 0a0.6 0.6 0 1 0-1.2 0",
  receipt: "M5 3h14v18l-3-2-3 2-3-2-2 2V3z M9 8h6 M9 12h6",
  gauge: "M4 18a8 8 0 1 1 16 0 M12 14l4-4",
  scan: "M4 7V5a1 1 0 0 1 1-1h2 M17 4h2a1 1 0 0 1 1 1v2 M20 17v2a1 1 0 0 1-1 1h-2 M7 20H5a1 1 0 0 1-1-1v-2 M4 12h16",
  shield: "M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z M9.5 12l2 2 3.5-4",
  folder: "M3 7a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
  trend: "M4 16l5-5 4 3 7-7 M16 7h4v4",
  coins: "M12 7m-8 0a8 3.2 0 1 0 16 0a8 3.2 0 1 0-16 0 M4 7v5c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V7 M4 12v5c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-5",
  layers: "M12 3 3 8l9 5 9-5z M3 13l9 5 9-5 M3 18l9 5 9-5",
  server: "M4 5h16v5H4z M4 14h16v5H4z M7.5 7.5h.01 M7.5 16.5h.01",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M3 20a6 6 0 0 1 12 0 M16 4.5a3.5 3.5 0 0 1 0 7 M17 14.2A6 6 0 0 1 21 20",
  sheet: "M5 3h14v18H5z M5 9h14 M5 15h14 M11 3v18",
  box: "M12 3 4 7v10l8 4 8-4V7z M4 7l8 4 8-4 M12 11v10",
  check: "M5 12.5 10 17.5 19.5 7",
  alert: "M12 4 2.5 20h19z M12 10v4 M12 17h.01",
  upload: "M12 16V4 M7 9l5-5 5 5 M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2",
  sync: "M4 11a8 8 0 0 1 14-5l2 2 M20 4v4h-4 M20 13a8 8 0 0 1-14 5l-2-2 M4 20v-4h4",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
  clock: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 7v5l3.5 2",
  building: "M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16 M15 9h3a1 1 0 0 1 1 1v11 M8 8h2 M8 12h2 M8 16h2",
  cloud: "M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.5 3.5 3.5 0 0 1 17.5 18z",
  doc: "M6 3h8l4 4v14H6z M14 3v4h4 M9 13h6 M9 16h6",
  euro: "M16 6a6 6 0 1 0 0 12 M5 10h7 M5 14h6",
  spark2: "M12 2v4 M12 18v4 M2 12h4 M18 12h4 M5 5l2.5 2.5 M16.5 16.5 19 19 M19 5l-2.5 2.5 M7.5 16.5 5 19",
};

function Icon({ name, size = 20, stroke = 1.7, fill = false, style, className }) {
  const d = ICON_PATHS[name] || ICON_PATHS.grid;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={(i === 0 ? seg : "M" + seg)} />
      ))}
    </svg>
  );
}

/* ---------------- Line chart ---------------- */
function LineChart({
  series,
  labels,
  height = 280,
  yMin,
  yMax,
  yFormat = (v) => v,
  padTop = 24,
  animateKey = 0,
  showDots = true,
}) {
  const W = 1000;
  const H = (height / 1) * (1000 / 1000);
  const padL = 56,
    padR = 28,
    padB = 42,
    padT = padTop;
  const allVals = series.flatMap((s) => s.data.filter((v) => v != null));
  const minV = yMin != null ? yMin : Math.min(...allVals);
  const maxV = yMax != null ? yMax : Math.max(...allVals);
  const span = maxV - minV || 1;
  const innerW = W - padL - padR;
  const innerH = height - padT - padB;
  const x = (i) => padL + (innerW * i) / (labels.length - 1);
  const y = (v) => padT + innerH - ((v - minV) / span) * innerH;

  const gridLines = 4;
  const ticks = Array.from({ length: gridLines + 1 }, (_, i) => minV + (span * i) / gridLines);

  function segPath(data) {
    let d = "";
    let started = false;
    data.forEach((v, i) => {
      if (v == null) {
        started = false;
        return;
      }
      d += (started ? " L" : " M") + x(i).toFixed(1) + " " + y(v).toFixed(1);
      started = true;
    });
    return d.trim();
  }
  function areaPath(data) {
    const pts = data.map((v, i) => (v == null ? null : [x(i), y(v)])).filter(Boolean);
    if (!pts.length) return "";
    let d = "M" + pts[0][0].toFixed(1) + " " + y(minV).toFixed(1);
    pts.forEach((p) => (d += " L" + p[0].toFixed(1) + " " + p[1].toFixed(1)));
    d += " L" + pts[pts.length - 1][0].toFixed(1) + " " + y(minV).toFixed(1) + " Z";
    return d;
  }

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" style={{ display: "block", overflow: "visible" }}>
      {/* gridlines */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#E7E9F1" strokeWidth="1" />
          <text x={padL - 12} y={y(t) + 4} textAnchor="end" fontSize="15" fill="#9CA1B5" fontFamily="var(--font-mono)">
            {yFormat(Math.round(t * 10) / 10)}
          </text>
        </g>
      ))}
      {/* x labels */}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={height - 14} textAnchor="middle" fontSize="15" fill="#9CA1B5" fontFamily="var(--font-mono)">
          {l}
        </text>
      ))}
      {/* areas */}
      {series.map((s, si) =>
        s.area ? (
          <path key={"a" + si} d={areaPath(s.data)} fill={s.color} opacity="0.10" />
        ) : null
      )}
      {/* lines */}
      {series.map((s, si) => {
        const dStr = segPath(s.data);
        return (
          <path
            key={"l" + si + "-" + animateKey}
            d={dStr}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width || 3}
            strokeDasharray={s.dashed ? "7 7" : undefined}
            className="lc-line"
            style={{ ["--lc-len"]: 2600 }}
          />
        );
      })}
      {/* dots on last actual point */}
      {showDots &&
        series.map((s, si) => {
          const lastIdx = s.data.reduce((acc, v, i) => (v != null ? i : acc), -1);
          if (lastIdx < 0 || s.noDot) return null;
          return (
            <g key={"d" + si}>
              <circle cx={x(lastIdx)} cy={y(s.data[lastIdx])} r="6.5" fill="#fff" stroke={s.color} strokeWidth="3" />
            </g>
          );
        })}
    </svg>
  );
}

/* ---------------- Bar + line combo ---------------- */
function BarComboChart({ labels, bars, line, height = 300, yMax, yFormat = (v) => v }) {
  const W = 1000;
  const padL = 56,
    padR = 28,
    padB = 42,
    padT = 24;
  const allVals = [...bars.flatMap((b) => b.data), ...(line ? line.data.filter((v) => v != null) : [])];
  const maxV = yMax != null ? yMax : Math.max(...allVals) * 1.1;
  const innerW = W - padL - padR;
  const innerH = height - padT - padB;
  const groupW = innerW / labels.length;
  const barCount = bars.length;
  const bw = Math.min(34, (groupW * 0.6) / barCount);
  const y = (v) => padT + innerH - (v / maxV) * innerH;
  const x = (i) => padL + groupW * i + groupW / 2;
  const ticks = Array.from({ length: 5 }, (_, i) => (maxV * i) / 4);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" style={{ display: "block", overflow: "visible" }}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#E7E9F1" strokeWidth="1" />
          <text x={padL - 12} y={y(t) + 4} textAnchor="end" fontSize="15" fill="#9CA1B5" fontFamily="var(--font-mono)">
            {yFormat(Math.round(t))}
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={height - 14} textAnchor="middle" fontSize="15" fill="#9CA1B5" fontFamily="var(--font-mono)">
          {l}
        </text>
      ))}
      {labels.map((_, i) =>
        bars.map((b, bi) => {
          const bx = x(i) - (barCount * bw) / 2 - (barCount - 1) * 2 + bi * (bw + 4);
          const v = b.data[i];
          if (v == null) return null;
          return (
            <rect
              key={i + "-" + bi}
              x={bx}
              y={y(v)}
              width={bw}
              height={Math.max(0, padT + innerH - y(v))}
              rx="4"
              fill={b.color}
              opacity={b.opacity != null ? b.opacity : 1}
            />
          );
        })
      )}
      {line && (
        <path
          d={line.data
            .map((v, i) => (v == null ? null : (i ? "L" : "M") + x(i) + " " + y(v)))
            .filter(Boolean)
            .join(" ")}
          fill="none"
          stroke={line.color}
          strokeWidth="3.5"
          strokeDasharray={line.dashed ? "7 7" : undefined}
          className="lc-line"
          style={{ ["--lc-len"]: 2600 }}
        />
      )}
      {line &&
        line.data.map((v, i) =>
          v == null ? null : <circle key={i} cx={x(i)} cy={y(v)} r="5" fill="#fff" stroke={line.color} strokeWidth="2.5" />
        )}
    </svg>
  );
}

/* ---------------- Accuracy gauge ---------------- */
function GaugeRing({ value, max = 100, size = 168, label, color = "#5B3E91", suffix = "%" }) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const arc = c * 0.75; // 270deg gauge
  const off = arc * (1 - pct);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ECEEF5" strokeWidth="13" strokeDasharray={`${arc} ${c}`} strokeLinecap="round" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="13"
          strokeDasharray={`${arc} ${c}`}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 34, fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>
          {value}
          <span style={{ fontSize: 18, color: "var(--muted)" }}>{suffix}</span>
        </div>
        {label && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, textAlign: "center" }}>{label}</div>}
      </div>
    </div>
  );
}

/* ---------------- Sparkline ---------------- */
function Sparkline({ data, color = "#5B3E91", width = 120, height = 36, fillArea = true }) {
  const min = Math.min(...data),
    max = Math.max(...data);
  const span = max - min || 1;
  const x = (i) => (width * i) / (data.length - 1);
  const y = (v) => height - 4 - ((v - min) / span) * (height - 8);
  const line = data.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
  const area = line + ` L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {fillArea && <path d={area} fill={color} opacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

Object.assign(window, { Icon, LineChart, BarComboChart, GaugeRing, Sparkline });
