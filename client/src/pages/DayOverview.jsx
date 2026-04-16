import { YEAR, MONTH, MOCK, bleedingColor, bleedingLabel, bioCard, bioLabel, bioValue, btnPrimaryStyle } from "../constants.js";
import { useMonthStatus } from "../context/MonthStatusContext.jsx";

import { useState, useEffect } from "react";
import MucusIcon from "../components/MucusIcon.jsx";

export default function DayOverview({ day, onEdit }) {
  const { monthData, loading } = useMonthStatus();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!day) {
    return (
      <div style={{ padding: "20px 20px 8px", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14, fontStyle: "italic" }}>
          Select a day to view its overview
        </p>
      </div>
    );
  }

  const entry = monthData[day];
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
              <span style={bioValue}>{entry.bbt ? `${entry.bbt}°F` : "—"}</span>
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