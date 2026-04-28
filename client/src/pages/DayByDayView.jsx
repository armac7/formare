import { useState, useRef, useEffect } from "react";
import { useMonthStatus } from "../context/MonthStatusContext.jsx";
import { saveMonthStatus } from "../scripts/api/saveMonthStatus.js";
import {
  TODAY, YEAR, MONTH, MONTH_NAMES,
  bleedingColor, bleedingLabel,
  SYMPTOM_OPTIONS, MUCUS_OPTIONS, MUCUS_CHAR, BLEEDING_OPT,
  inputStyle,
} from "../constants.js";
import Section from "../components/Section.jsx";
import MucusIcon from "../components/MucusIcon.jsx";
import "./css/DayByDayView.css";

export default function DayByDayView({ initialDay, month, year, onBack }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const [currentDay, setCurrentDay] = useState(initialDay || TODAY.getDate());
  const { monthData, loadMonth } = useMonthStatus(year, month);

  const [localData, setLocalData] = useState(() => {
    const d = {};
    for (let i = 1; i <= daysInMonth; i++) {
      d[i] = monthData[i]
        ? { ...monthData[i], symptoms: [...(monthData[i].symptoms || [])] }
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
    const idx    = currentDay - 1;
    const offset = idx * CARD_W - container.clientWidth / 2 + CARD_W / 2;
    container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
  }, [currentDay]);

  function update(field, value) {
    setLocalData(prev => ({
      ...prev,
      [currentDay]: {
        ...(prev[currentDay] ?? { bbt: null, bleeding: null, mucus: null, mucusCharacteristic: null, symptoms: [], notes: "" }),
        [field]: value,
      },
    }));
  }

  function toggleSymptom(key) {
    const syms = localData[currentDay].symptoms || [];
    const next = syms.includes(key) ? syms.filter(s => s !== key) : [...syms, key];
    update("symptoms", next);
  }

  async function handleSave() {
    // console.log("saveMonthStatus:", typeof saveMonthStatus);
    // console.log("refetch:", typeof refetch);
    // console.log("onBack:", typeof onBack);
    // console.log("Saving day status for", year, month + 1, "day", currentDay, "with data:", localData[currentDay]);
    const payload = Object.fromEntries(
      Object.entries(localData).map(([day, d]) => [
        day,
        {
          ...d,
          date: d.date ?? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        },
      ])
    );

    // console.log("Saving month status with payload:", payload);
    await saveMonthStatus(payload);
    await loadMonth(year, month);
    onBack();
  }

  const entry     = localData[currentDay] || {};
  const weekday   = new Date(year, month, currentDay).toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="daybyday-wrap">

      {/* ── Top bar ── */}
      <div className="daybyday-topbar">
        <button className="topbar-back-btn" onClick={onBack}>←</button>
        <div className="topbar-center">
          <h2 className="topbar-title">{MONTH_NAMES[month]} {currentDay}</h2>
          <p className="topbar-weekday">{weekday}</p>
        </div>
        <button className="topbar-save-btn" onClick={handleSave}>Save</button>
      </div>

      {/* ── Day scroll strip ── */}
      <div className="day-scroll-strip" ref={scrollRef}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const isFuture   = d > todayDate && month >= MONTH && year >= YEAR;
          const isSelected = d === currentDay;
          const e          = localData[d];
          const hasBleed   = e?.bleeding && e.bleeding !== "None";

          // Dynamic colors driven by data — stay inline
          const cardStyle = {
            background: isSelected
              ? "var(--burgundy)"
              : hasBleed
                ? bleedingColor[e.bleeding]
                : "var(--parchment)",
            border: d === todayDate && !isSelected
              ? "2px solid var(--gold)"
              : "2px solid transparent",
          };

          const weekdayColor = isSelected ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
          const numColor     = isSelected
            ? "white"
            : hasBleed
              ? (e.bleeding === "spotting" ? "var(--burgundy)" : "white")
              : "var(--text)";

          return (
            <div
              key={d}
              className={`day-card ${isFuture ? "day-card--future" : "day-card--clickable"}`}
              style={cardStyle}
              onClick={() => !isFuture && setCurrentDay(d)}
            >
              <span className="day-card-weekday" style={{ color: weekdayColor }}>
                {new Date(year, month, d).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
              </span>
              <span className="day-card-num" style={{ color: numColor }}>{d}</span>
            </div>
          );
        })}
      </div>

      {/* ── Input sections ── */}
      <div className="daybyday-body">

        {/* BBT */}
        <Section icon="🌡️" title="Basal Body Temperature">
          <div className="bbt-row">
            <input
              type="number"
              step="0.01" min="96" max="100"
              placeholder="e.g. 97.40"
              value={entry.bbt || ""}
              onChange={e => update("bbt", e.target.value ? parseFloat(e.target.value) : null)}
              style={{
                ...inputStyle,
                maxWidth: 140, textAlign: "center",
                fontSize: 18, fontWeight: 700,
                color: "var(--burgundy)",
              }}
            />
            <span className="bbt-unit">°F</span>
            {entry.bbt && (
              <span className={`bbt-phase-badge ${entry.bbt > 97.7 ? "bbt-phase-badge--high" : "bbt-phase-badge--low"}`}>
                {entry.bbt > 97.7 ? "Post-ovulatory" : "Pre-ovulatory"}
              </span>
            )}
          </div>
        </Section>

        {/* Cervical Mucus */}
        <Section icon="💧" title="Cervical Mucus">
          <p className="mucus-sublabel">Sensation</p>
          <div className="mucus-options">
            {MUCUS_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`mucus-btn ${entry.mucus === opt ? "mucus-btn--active" : "mucus-btn--inactive"}`}
                onClick={() => update("mucus", entry.mucus === opt ? null : opt)}
              >
                <MucusIcon type={opt} size={14} /> {opt}
              </button>
            ))}
          </div>

          <p className="mucus-sublabel">Characteristic</p>
          <div className="mucus-char-options">
            {MUCUS_CHAR.map(opt => (
              <button
                key={opt}
                className={`mucus-char-btn ${entry.mucusCharacteristic === opt ? "mucus-char-btn--active" : "mucus-char-btn--inactive"}`}
                onClick={() => update("mucusCharacteristic", entry.mucusCharacteristic === opt ? null : opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </Section>

        {/* Bleeding */}
        <Section icon="🩸" title="Bleeding">
          <div className="bleeding-options">
            {BLEEDING_OPT.map(opt => {
              const active = (entry.bleeding || "None") === opt;
              // Background + text color driven by bleedingColor data — stay inline
              const btnStyle = {
                background: active
                  ? (opt === "none" ? "var(--parchment)" : bleedingColor[opt])
                  : "var(--parchment)",
                color: active && opt !== "none" && opt !== "spotting" ? "white" : "var(--text)",
                border: active ? "2px solid transparent" : "2px solid var(--gold-light)",
                fontWeight: active ? 700 : 400,
              };
              return (
                <button
                  key={opt}
                  className="bleeding-btn"
                  style={btnStyle}
                  onClick={() => update("bleeding", opt === "none" ? null : opt)}
                >
                  {opt === "None" ? "None" : bleedingLabel[opt]}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Secondary Symptoms */}
        <Section icon="🧩" title="Secondary Symptoms">
          {["physical", "emotional"].map(type => (
            <div key={type}>
              <p className="overview-section-sublabel" style={{ textTransform: "capitalize" }}>{type}</p>
              <div className="symptoms-grid">
                {SYMPTOM_OPTIONS.filter(s => s.type === type).map(s => {
                  const active = (entry.symptoms || []).includes(s.key);
                  return (
                    <button
                      key={s.key}
                      className={`symptom-btn ${active ? "symptom-btn--active" : "symptom-btn--inactive"}`}
                      onClick={() => toggleSymptom(s.key)}
                    >
                      <span className="symptom-emoji">{s.emoji}</span>
                      <span className={`symptom-label ${active ? "symptom-label--active" : "symptom-label--inactive"}`}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Section>

        {/* Notes */}
        <Section icon="📝" title="Notes">
          <textarea
            className="notes-textarea"
            placeholder="How are you feeling today? Any observations…"
            value={entry.notes || ""}
            onChange={e => update("notes", e.target.value)}
            rows={4}
            style={inputStyle}
          />
        </Section>

        <div className="daybyday-spacer" />
      </div>

    </div>
  );
}
