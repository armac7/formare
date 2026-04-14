import { useState, useRef, useEffect } from "react";

// ─── Fonts via Google ───────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Lato:wght@300;400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:      #FAF6F1;
      --parchment:  #F2EBE0;
      --rose-light: #F5C9C9;
      --rose:       #D4788A;
      --rose-deep:  #A84B5F;
      --burgundy:   #7A2D3E;
      --gold:       #C9A96E;
      --gold-light: #E8D5B0;
      --sage:       #8A9E8A;
      --sage-light: #C8D5C8;
      --text:       #3A2A2A;
      --text-muted: #8A7070;
      --future-grey:#C8BFB8;
      --white:      #FFFFFF;
    }

    body {
      font-family: 'Lato', sans-serif;
      background: var(--cream);
      color: var(--text);
      min-height: 100vh;
    }

    h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; }
  `}</style>
);

// ─── Mock Data ───────────────────────────────────────────────────────────────
const TODAY = new Date();
const YEAR  = TODAY.getFullYear();
const MONTH = TODAY.getMonth();

function makeMockData() {
  const data = {};
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();

  // Simulated period: days 1-5
  const bleedingDays = { 1: "heavy", 2: "heavy", 3: "medium", 4: "light", 5: "spotting" };
  const mucusTypes = ["dry", "sticky", "creamy", "watery", "egg-white"];
  const bbtBase = 97.2;

  for (let d = 1; d <= Math.min(TODAY.getDate(), daysInMonth); d++) {
    data[d] = {
      bbt: bleedingDays[d] ? null : parseFloat((bbtBase + Math.random() * 0.8 + (d > 14 ? 0.4 : 0)).toFixed(2)),
      bleeding: bleedingDays[d] || null,
      mucus: bleedingDays[d] ? null : mucusTypes[Math.floor(Math.random() * mucusTypes.length)],
      mucusCharacteristic: ["opaque", "translucent", "clear", "stretchy"][Math.floor(Math.random() * 4)],
      symptoms: d % 3 === 0 ? ["fatigue"] : d % 5 === 0 ? ["headache", "backache"] : [],
      notes: d === 3 ? "Felt very tired today, cramps in the morning." : d === 14 ? "Peak day — noticed stretchy CM." : "",
    };
  }

  // Projected period: days 28-32 (future)
  return { entries: data, projectedPeriod: [28, 29, 30, 31] };
}

const MOCK = makeMockData();

// ─── Bleeding Color ──────────────────────────────────────────────────────────
const bleedingColor = {
  heavy:    "#C0303F",
  medium:   "#D4788A",
  light:    "#E8A8B4",
  spotting: "#F2D0D5",
};

const bleedingLabel = {
  heavy: "Heavy", medium: "Medium", light: "Light", spotting: "Spotting"
};

// ─── Mucus Icon ──────────────────────────────────────────────────────────────
function MucusIcon({ type, characteristic, size = 22 }) {
  const icons = {
    dry:       { emoji: "🏜️", label: "Dry" },
    sticky:    { emoji: "🍯", label: "Sticky" },
    creamy:    { emoji: "🥛", label: "Creamy" },
    watery:    { emoji: "💧", label: "Watery" },
    "egg-white": { emoji: "✨", label: "Egg-white" },
  };
  const ic = icons[type] || { emoji: "—", label: "None" };
  return (
    <span title={`${ic.label}${characteristic ? ` · ${characteristic}` : ""}`} style={{ fontSize: size }}>
      {ic.emoji}
    </span>
  );
}

// ─── Login Page ──────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [err,   setErr]   = useState("");

  function handleSubmit() {
    if (!email || !pass) { setErr("Please fill in all fields."); return; }
    if (pass.length < 4) { setErr("Password too short."); return; }
    onLogin({ name: email.split("@")[0] });
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(160deg, var(--parchment) 0%, var(--cream) 60%, #F0E8F0 100%)`,
      padding: "24px",
    }}>
      <div style={{
        background: "white", borderRadius: 24, padding: "48px 40px", maxWidth: 400, width: "100%",
        boxShadow: "0 8px 48px rgba(122,45,62,0.10)",
        border: "1px solid var(--gold-light)",
        display: "flex", flexDirection: "column", gap: 0,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--rose-light), var(--gold-light))",
            margin: "0 auto 12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
          }}>🌸</div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 300, color: "var(--burgundy)", letterSpacing: 2 }}>
            Formare
          </h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>
            Cycle Awareness
          </p>
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="email" placeholder="Email address" value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }}
            style={inputStyle}
          />
          <input
            type="password" placeholder="Password" value={pass}
            onChange={e => { setPass(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={inputStyle}
          />
          {err && <p style={{ color: "var(--rose-deep)", fontSize: 13, textAlign: "center" }}>{err}</p>}
          <button onClick={handleSubmit} style={btnPrimaryStyle}>Sign In</button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>New to Formare? </span>
          <span style={{ color: "var(--rose-deep)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            Create account
          </span>
        </div>

        <p style={{
          marginTop: 28, fontSize: 11, color: "var(--text-muted)", textAlign: "center",
          lineHeight: 1.6, borderTop: "1px solid var(--gold-light)", paddingTop: 16
        }}>
          ✝ <em>Formare</em> is a cycle awareness companion, not medical advice.
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  border: "1.5px solid var(--gold-light)", borderRadius: 10, padding: "12px 16px",
  fontSize: 14, fontFamily: "Lato, sans-serif", background: "var(--cream)",
  color: "var(--text)", outline: "none", width: "100%",
};

const btnPrimaryStyle = {
  background: "linear-gradient(135deg, var(--rose-deep), var(--burgundy))",
  color: "white", border: "none", borderRadius: 10, padding: "13px",
  fontSize: 14, fontFamily: "Lato, sans-serif", fontWeight: 700,
  cursor: "pointer", letterSpacing: 1, marginTop: 4,
};

// ─── Calendar View ───────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function CalendarView({ onSelectDay, selectedDay, user }) {
  const daysInMonth   = new Date(YEAR, MONTH + 1, 0).getDate();
  const firstDayIndex = new Date(YEAR, MONTH, 1).getDay();
  const todayDate     = TODAY.getDate();

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function dayState(d) {
    if (!d) return "empty";
    if (d > todayDate) return "future";
    return "past";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 400, color: "var(--burgundy)" }}>
            {MONTH_NAMES[MONTH]}
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase" }}>{YEAR}</p>
        </div>
        <div style={{ fontSize: 22 }}>🌸</div>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px", gap: 2 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--text-muted)", fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", padding: "6px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px 8px", gap: 4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const state   = dayState(d);
          const entry   = MOCK.entries[d];
          const bleeding = entry?.bleeding;
          const isProjPeriod = MOCK.projectedPeriod.includes(d);
          const isSelected = selectedDay === d;
          const isToday    = d === todayDate;

          let bg = "transparent";
          let textColor = "var(--text)";
          let border = "2px solid transparent";
          let opacity = 1;

          if (state === "future") {
            opacity = 0.5;
            textColor = "var(--future-grey)";
          }
          if (bleeding) {
            bg = bleedingColor[bleeding];
            textColor = bleeding === "spotting" ? "var(--burgundy)" : "white";
          }
          if (isProjPeriod && state === "future") {
            border = `2px dashed var(--rose)`;
            textColor = "var(--rose)";
          }
          if (isSelected) border = `2px solid var(--burgundy)`;
          if (isToday && !isSelected) border = `2px solid var(--gold)`;

          return (
            <div
              key={d}
              onClick={() => state !== "future" && onSelectDay(d)}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: "50%",
                background: bg,
                border,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: state === "future" ? "default" : "pointer",
                opacity,
                transition: "transform 0.1s",
              }}
              onMouseEnter={e => { if (state !== "future") e.currentTarget.style.transform = "scale(1.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: textColor, lineHeight: 1 }}>
                {d}
              </span>
              {/* BBT dot */}
              {entry?.bbt && (
                <span style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: entry.bbt > 97.7 ? "var(--gold)" : "var(--sage)",
                  marginTop: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: 12, padding: "8px 16px 12px", flexWrap: "wrap", justifyContent: "center"
      }}>
        {[
          { color: bleedingColor.heavy,   label: "Heavy" },
          { color: bleedingColor.medium,  label: "Medium" },
          { color: bleedingColor.light,   label: "Light" },
          { color: bleedingColor.spotting,label: "Spotting" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, display: "block", border: "1px solid rgba(0,0,0,0.1)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px dashed var(--rose)", display: "block" }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Projected</span>
        </div>
      </div>
    </div>
  );
}

// ─── Day Overview Panel ──────────────────────────────────────────────────────
function DayOverview({ day, onEdit }) {
  if (!day) {
    return (
      <div style={{ padding: "20px 20px 8px", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14, fontStyle: "italic" }}>
          Select a day to view its overview
        </p>
      </div>
    );
  }

  const entry = MOCK.entries[day];
  const dateLabel = new Date(YEAR, MONTH, day).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ padding: "0 16px 16px" }}>
      {/* Day header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 500, color: "var(--burgundy)" }}>
            {dateLabel}
          </h3>
        </div>
        <button onClick={() => onEdit(day)} style={{
          background: "var(--parchment)", border: "1px solid var(--gold-light)",
          borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700,
          color: "var(--rose-deep)", cursor: "pointer", letterSpacing: 0.5,
        }}>
          Edit ✏️
        </button>
      </div>

      {entry ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Biomarkers row */}
          <div style={{ display: "flex", gap: 10 }}>
            {/* BBT */}
            <div style={bioCard}>
              <span style={bioLabel}>🌡️ BBT</span>
              <span style={bioValue}>
                {entry.bbt ? `${entry.bbt}°F` : "—"}
              </span>
            </div>
            {/* Mucus */}
            <div style={bioCard}>
              <span style={bioLabel}>💧 Mucus</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {entry.mucus
                  ? <><MucusIcon type={entry.mucus} size={18} />
                      <span style={{ ...bioValue, fontSize: 12 }}>{entry.mucus}</span></>
                  : <span style={bioValue}>—</span>
                }
              </div>
            </div>
            {/* Bleeding */}
            <div style={bioCard}>
              <span style={bioLabel}>🩸 Bleeding</span>
              <span style={{ ...bioValue, color: entry.bleeding ? bleedingColor[entry.bleeding] : "var(--text-muted)" }}>
                {entry.bleeding ? bleedingLabel[entry.bleeding] : "None"}
              </span>
            </div>
          </div>

          {/* Symptoms */}
          {entry.symptoms?.length > 0 && (
            <div style={{ background: "var(--parchment)", borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Symptoms</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {entry.symptoms.map(s => (
                  <span key={s} style={{
                    background: "var(--rose-light)", color: "var(--burgundy)",
                    borderRadius: 20, padding: "3px 10px", fontSize: 12,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={{ background: "var(--parchment)", borderRadius: 10, padding: "10px 14px" }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>Notes</p>
            <p style={{ fontSize: 13, color: entry.notes ? "var(--text)" : "var(--text-muted)", fontStyle: entry.notes ? "normal" : "italic", lineHeight: 1.5 }}>
              {entry.notes || "No notes for this day."}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ background: "var(--parchment)", borderRadius: 10, padding: 16, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 13, fontStyle: "italic" }}>No data recorded for this day.</p>
          <button onClick={() => onEdit(day)} style={{ ...btnPrimaryStyle, marginTop: 12, padding: "9px 20px", fontSize: 13 }}>
            Add Entry
          </button>
        </div>
      )}
    </div>
  );
}

const bioCard = {
  flex: 1, background: "var(--parchment)", borderRadius: 10, padding: "10px 10px 8px",
  display: "flex", flexDirection: "column", gap: 4,
};
const bioLabel = { fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" };
const bioValue = { fontSize: 14, fontWeight: 700, color: "var(--text)" };

// ─── Day-by-Day Edit View ────────────────────────────────────────────────────
const SYMPTOM_OPTIONS = [
  { key: "headache",  emoji: "🤕", label: "Headache" },
  { key: "backache",  emoji: "🪑", label: "Backache" },
  { key: "fatigue",   emoji: "😴", label: "Fatigue" },
  { key: "mood",      emoji: "😌", label: "Mood Changes" },
];

const MUCUS_OPTIONS = ["dry","sticky","creamy","watery","egg-white"];
const MUCUS_CHAR    = ["opaque","translucent","clear","stretchy"];
const BLEEDING_OPT  = ["none","spotting","light","medium","heavy"];

function DayByDayView({ initialDay, onBack }) {
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const [currentDay, setCurrentDay] = useState(initialDay || TODAY.getDate());
  const [localData, setLocalData] = useState(() => {
    // Clone mock data
    const d = {};
    for (let i = 1; i <= daysInMonth; i++) {
      d[i] = MOCK.entries[i] ? { ...MOCK.entries[i], symptoms: [...(MOCK.entries[i].symptoms || [])] }
        : { bbt: null, bleeding: null, mucus: null, mucusCharacteristic: null, symptoms: [], notes: "" };
    }
    return d;
  });

  const scrollRef = useRef(null);
  const todayDate = TODAY.getDate();

  // Scroll to center current day
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const CARD_W = 72;
    const idx = currentDay - 1;
    const offset = idx * CARD_W - container.clientWidth / 2 + CARD_W / 2;
    container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
  }, [currentDay]);

  function update(field, value) {
    setLocalData(prev => ({ ...prev, [currentDay]: { ...prev[currentDay], [field]: value } }));
  }
  function toggleSymptom(key) {
    const syms = localData[currentDay].symptoms || [];
    const next = syms.includes(key) ? syms.filter(s => s !== key) : [...syms, key];
    update("symptoms", next);
  }

  const entry = localData[currentDay] || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--cream)" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", background: "white", borderBottom: "1px solid var(--gold-light)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--rose-deep)" }}>
          ← 
        </button>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 400, color: "var(--burgundy)" }}>
            {MONTH_NAMES[MONTH]} {currentDay}
          </h2>
          <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1 }}>
            {new Date(YEAR, MONTH, currentDay).toLocaleDateString("en-US", { weekday: "long" })}
          </p>
        </div>
        <button style={{
          background: "var(--rose-deep)", color: "white", border: "none",
          borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }} onClick={() => { /* save */ onBack(); }}>
          Save
        </button>
      </div>

      {/* Day scroll strip */}
      <div ref={scrollRef} style={{
        overflowX: "auto", display: "flex", gap: 4, padding: "14px 16px",
        background: "white", borderBottom: "1px solid var(--gold-light)",
        scrollbarWidth: "none",
      }}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const isFuture = d > todayDate;
          const isSelected = d === currentDay;
          const e = localData[d];
          const hasBleed = e?.bleeding && e.bleeding !== "none";

          return (
            <div
              key={d}
              onClick={() => !isFuture && setCurrentDay(d)}
              style={{
                minWidth: 60, height: 60, borderRadius: 12, flexShrink: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: isSelected ? "var(--burgundy)" : hasBleed ? bleedingColor[e.bleeding] : "var(--parchment)",
                border: d === todayDate && !isSelected ? "2px solid var(--gold)" : "2px solid transparent",
                cursor: isFuture ? "default" : "pointer",
                opacity: isFuture ? 0.4 : 1,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 10, color: isSelected ? "rgba(255,255,255,0.7)" : "var(--text-muted)", letterSpacing: 0.5 }}>
                {new Date(YEAR, MONTH, d).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: isSelected ? "white" : hasBleed ? (e.bleeding === "spotting" ? "var(--burgundy)" : "white") : "var(--text)" }}>
                {d}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input sections */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* BBT */}
        <Section icon="🌡️" title="Basal Body Temperature">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="number" step="0.01" min="96" max="100" placeholder="e.g. 97.40"
              value={entry.bbt || ""}
              onChange={e => update("bbt", e.target.value ? parseFloat(e.target.value) : null)}
              style={{ ...inputStyle, maxWidth: 140, textAlign: "center", fontSize: 18, fontWeight: 700, color: "var(--burgundy)" }}
            />
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>°F</span>
            {entry.bbt && (
              <span style={{
                fontSize: 11, padding: "3px 8px", borderRadius: 20,
                background: entry.bbt > 97.7 ? "var(--gold-light)" : "var(--sage-light)",
                color: entry.bbt > 97.7 ? "var(--burgundy)" : "var(--sage)",
                fontWeight: 700,
              }}>
                {entry.bbt > 97.7 ? "Post-ovulatory" : "Pre-ovulatory"}
              </span>
            )}
          </div>
        </Section>

        {/* Cervical Mucus */}
        <Section icon="💧" title="Cervical Mucus">
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Sensation</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {MUCUS_OPTIONS.map(opt => (
              <button key={opt} onClick={() => update("mucus", entry.mucus === opt ? null : opt)} style={{
                background: entry.mucus === opt ? "var(--rose-deep)" : "var(--parchment)",
                color: entry.mucus === opt ? "white" : "var(--text)",
                border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 12,
                cursor: "pointer", fontWeight: entry.mucus === opt ? 700 : 400,
                transition: "all 0.15s",
              }}>
                <MucusIcon type={opt} size={14} /> {opt}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Characteristic</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MUCUS_CHAR.map(opt => (
              <button key={opt} onClick={() => update("mucusCharacteristic", entry.mucusCharacteristic === opt ? null : opt)} style={{
                background: entry.mucusCharacteristic === opt ? "var(--sage)" : "var(--parchment)",
                color: entry.mucusCharacteristic === opt ? "white" : "var(--text)",
                border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 12, cursor: "pointer",
                transition: "all 0.15s",
              }}>
                {opt}
              </button>
            ))}
          </div>
        </Section>

        {/* Bleeding */}
        <Section icon="🩸" title="Bleeding">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BLEEDING_OPT.map(opt => {
              const active = (entry.bleeding || "none") === opt;
              return (
                <button key={opt} onClick={() => update("bleeding", opt === "none" ? null : opt)} style={{
                  background: active ? (opt === "none" ? "var(--parchment)" : bleedingColor[opt]) : "var(--parchment)",
                  color: active && opt !== "none" && opt !== "spotting" ? "white" : "var(--text)",
                  border: active ? "2px solid transparent" : "2px solid var(--gold-light)",
                  borderRadius: 20, padding: "7px 16px", fontSize: 12, cursor: "pointer",
                  fontWeight: active ? 700 : 400, transition: "all 0.15s",
                }}>
                  {opt === "none" ? "None" : bleedingLabel[opt]}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Secondary Symptoms */}
        <Section icon="🧩" title="Secondary Symptoms">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SYMPTOM_OPTIONS.map(s => {
              const active = (entry.symptoms || []).includes(s.key);
              return (
                <button key={s.key} onClick={() => toggleSymptom(s.key)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: active ? "var(--rose-light)" : "var(--parchment)",
                  border: `2px solid ${active ? "var(--rose)" : "transparent"}`,
                  borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 400, color: active ? "var(--burgundy)" : "var(--text)" }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Notes */}
        <Section icon="📝" title="Notes">
          <textarea
            placeholder="How are you feeling today? Any observations…"
            value={entry.notes || ""}
            onChange={e => update("notes", e.target.value)}
            rows={4}
            style={{
              ...inputStyle, resize: "none", lineHeight: 1.6, fontFamily: "Cormorant Garamond, serif",
              fontSize: 15, fontStyle: "italic",
            }}
          />
        </Section>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(122,45,62,0.05)",
      border: "1px solid var(--gold-light)",
    }}>
      <div style={{
        padding: "12px 16px 10px", borderBottom: "1px solid var(--gold-light)",
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--parchment)",
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 500, color: "var(--burgundy)", letterSpacing: 0.5 }}>
          {title}
        </h4>
      </div>
      <div style={{ padding: "14px 16px" }}>{children}</div>
    </div>
  );
}

// ─── Bottom Tab Bar ──────────────────────────────────────────────────────────
function TabBar({ active, onTab }) {
  const tabs = [
    { key: "calendar", icon: "📅", label: "Calendar" },
    { key: "insights", icon: "✨", label: "Insights" },
    { key: "profile",  icon: "🌸", label: "Profile" },
  ];
  return (
    <div style={{
      display: "flex", background: "white",
      borderTop: "1px solid var(--gold-light)",
      position: "sticky", bottom: 0,
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onTab(t.key)} style={{
          flex: 1, padding: "10px 0 8px", border: "none", background: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          color: active === t.key ? "var(--rose-deep)" : "var(--text-muted)",
          transition: "color 0.15s",
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{t.label}</span>
          {active === t.key && (
            <span style={{ width: 16, height: 2, background: "var(--rose-deep)", borderRadius: 2 }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Insights Placeholder ────────────────────────────────────────────────────
function InsightsView() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: 32 }}>
      <span style={{ fontSize: 48 }}>✨</span>
      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "var(--burgundy)", textAlign: "center" }}>
        Daily Insights
      </h3>
      <p style={{ color: "var(--text-muted)", textAlign: "center", fontSize: 14, lineHeight: 1.7 }}>
        AI-powered cycle insights are coming in Sprint 3.<br />Log a few weeks of data to unlock personalized patterns.
      </p>
    </div>
  );
}

// ─── Profile Placeholder ─────────────────────────────────────────────────────
function ProfileView({ user, onLogout }) {
  return (
    <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--rose-light), var(--gold-light))",
          margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
        }}>🌸</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "var(--burgundy)" }}>{user.name}</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Cycle awareness companion</p>
      </div>
      <div style={{ background: "var(--parchment)", borderRadius: 14, padding: 16, border: "1px solid var(--gold-light)" }}>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.7, fontSize: 15 }}>
          ✝ <em>Formare</em> supports a vision of health rooted in dignity of the human person and respect for the natural rhythms of the body.
        </p>
      </div>
      <button onClick={onLogout} style={{
        marginTop: 8, border: "1.5px solid var(--rose)", background: "none", color: "var(--rose-deep)",
        borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer",
      }}>
        Sign Out
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
        ❌ Not medical advice · ❌ Not a contraceptive tool<br />❌ Not a replacement for certified NFP instruction
      </p>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [user,        setUser]        = useState(null);
  const [view,        setView]        = useState("calendar"); // calendar | edit
  const [activeTab,   setActiveTab]   = useState("calendar");
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [editDay,     setEditDay]     = useState(null);

  if (!user) return (
    <>
      <FontLoader />
      <LoginPage onLogin={u => setUser(u)} />
    </>
  );

  if (view === "edit") return (
    <>
      <FontLoader />
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--cream)" }}>
        <DayByDayView initialDay={editDay} onBack={() => setView("calendar")} />
      </div>
    </>
  );

  return (
    <>
      <FontLoader />
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--cream)" }}>
        {/* App Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 12px", background: "white", borderBottom: "1px solid var(--gold-light)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🌸</span>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 400, color: "var(--burgundy)", letterSpacing: 2 }}>
              Formare
            </h1>
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>
            {user.name}
          </span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {activeTab === "calendar" && (
            <>
              <CalendarView
                selectedDay={selectedDay}
                onSelectDay={d => setSelectedDay(d)}
                user={user}
              />
              {/* Divider */}
              <div style={{ height: 1, background: "var(--gold-light)", margin: "0 16px" }} />
              {/* Day Overview */}
              <div style={{ paddingTop: 16 }}>
                <DayOverview
                  day={selectedDay}
                  onEdit={d => { setEditDay(d); setView("edit"); }}
                />
              </div>
            </>
          )}
          {activeTab === "insights" && <InsightsView />}
          {activeTab === "profile"  && <ProfileView user={user} onLogout={() => setUser(null)} />}
        </div>

        {/* Tab Bar */}
        <TabBar active={activeTab} onTab={tab => setActiveTab(tab)} />
      </div>
    </>
  );
}