/* ============================================================
   AIchain Finance Engine — Shared UI primitives
   ============================================================ */
const { Icon, Sparkline } = window;

function Card({ children, style, pad = 24, className, ...rest }) {
  return (
    <div className={"card " + (className || "")} style={{ padding: pad, ...style }} {...rest}>
      {children}
    </div>
  );
}

function SectionTitle({ kicker, title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
      <div>
        {kicker && <div className="kicker">{kicker}</div>}
        <h2 className="sec-title">{title}</h2>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function Badge({ children, tone = "neutral", icon, soft = true, style }) {
  const tones = {
    neutral: ["#EEF0F6", "#5C6178"],
    success: ["#E2F5EC", "#13855A"],
    danger: ["#FCE7E7", "#C23434"],
    warn: ["#FCF1DC", "#9A6B00"],
    info: ["#E1F6FB", "#0784A0"],
    purple: ["#EEE9F6", "#5B3E91"],
  };
  const [bg, fg] = tones[tone] || tones.neutral;
  return (
    <span
      className="badge"
      style={{
        background: soft ? bg : fg,
        color: soft ? fg : "#fff",
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={14} stroke={2.1} />}
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", icon, iconRight, onClick, disabled, full, size = "md", style }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}${full ? " btn-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 20 : 17} stroke={2.1} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 20 : 17} stroke={2.1} />}
    </button>
  );
}

function KPICard({ label, value, unit, delta, deltaTone = "success", spark, sparkColor, icon, accent = "var(--brand)", note }) {
  return (
    <div className="card kpi">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="kpi-label">{label}</div>
        {icon && (
          <div className="kpi-icon" style={{ background: "color-mix(in srgb," + accent + " 12%, transparent)", color: accent }}>
            <Icon name={icon} size={18} stroke={2} />
          </div>
        )}
      </div>
      <div className="kpi-value">
        {value}
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, gap: 10 }}>
        <div>
          {delta && <Badge tone={deltaTone} icon={deltaTone === "success" ? "trend" : undefined}>{delta}</Badge>}
          {note && !delta && <div className="kpi-note">{note}</div>}
        </div>
        {spark && <Sparkline data={spark} color={sparkColor || accent} width={96} height={32} />}
      </div>
    </div>
  );
}

function Field({ label, value, conf }) {
  return (
    <div className="xfield">
      <div className="xfield-label">{label}</div>
      <div className="xfield-row">
        <div className="xfield-value">{value}</div>
        {conf != null && (
          <div className="xfield-conf" style={{ color: conf >= 98 ? "#13855A" : conf >= 95 ? "#9A6B00" : "#C23434" }}>
            <span className="conf-dot" style={{ background: conf >= 98 ? "#1FAE6F" : conf >= 95 ? "#D79A14" : "#D64545" }} />
            {conf}%
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button className={"toggle" + (on ? " on" : "")} onClick={onClick} aria-pressed={on}>
      <span className="toggle-knob" />
    </button>
  );
}

/* Generic placeholder dashboard for secondary process nav items,
   so nothing in the sidebar is a dead end. */
function ProcessDashboard({ title, kicker, kpis = [], note, accent }) {
  return (
    <div className="screen">
      <SectionTitle kicker={kicker} title={title} sub={note} />
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <KPICard key={i} {...k} accent={accent} />
        ))}
      </div>
      <Card style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14, color: "var(--muted)" }}>
        <div className="round-ic" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
          <Icon name="cloud" size={20} />
        </div>
        <div style={{ fontSize: 15 }}>
          Modulo connesso al motore AIchain. I dati AFC sono sincronizzati in tempo reale dal flusso Serverless —
          nessuna configurazione tecnica richiesta.
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { Card, SectionTitle, Badge, Button, KPICard, Field, Toggle, ProcessDashboard });
