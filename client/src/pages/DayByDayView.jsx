import { useState, useRef, useEffect } from "react";
import {
  TODAY, YEAR, MONTH, MONTH_NAMES,
  MOCK, bleedingColor, bleedingLabel,
  SYMPTOM_OPTIONS, MUCUS_OPTIONS, MUCUS_CHAR, BLEEDING_OPT,
  inputStyle,
} from "../constants.js";
import Section from "../components/Section.jsx";
import MucusIcon from "../components/MucusIcon.jsx";

export default function DayByDayView({ initialDay, onBack }) {
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const [currentDay, setCurrentDay] = useState(initialDay || TODAY.getDate());
  const [localData, setLocalData] = useState(() => {
    const d = {};
    for (let i = 1; i <= daysInMonth; i++) {
      d[i] = MOCK.entries[i]
        ? { ...MOCK.entries[i], symptoms: [...(MOCK.entries[i].symptoms || [])] }
        : { bbt: null, bleeding: null, mucus: null, mucusCharacteristic: null, symptoms: [], notes: "" };
    }
    return d;
  });

  const scrollRef = useRef(null);
  const todayDate = TODAY.getDate();

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
          const isFuture  = d > todayDate;
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
