import { TODAY, YEAR, MONTH, MONTH_NAMES, DAYS_OF_WEEK, MOCK, bleedingColor } from "../constants.js";
import { useMonthStatus } from "../context/MonthStatusContext.jsx";

export default function CalendarView({ onSelectDay, selectedDay }) {
  const { monthData, loading } = useMonthStatus();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const daysInMonth   = new Date(YEAR, MONTH + 1, 0).getDate();
  const firstDayIndex = new Date(YEAR, MONTH, 1).getDay();
  const todayDate = TODAY.getDate();

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
          <div key={d} style={{
            textAlign: "center", fontSize: 10, color: "var(--text-muted)", fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", padding: "6px 0",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px 8px", gap: 4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const state        = dayState(d);
          const entry        = monthData[d];
          const bleeding     = entry?.bleeding;
          const isProjPeriod = MOCK.projectedPeriod.includes(d);
          const isSelected   = selectedDay === d;
          const isToday      = d === todayDate;

          let bg        = "transparent";
          let textColor = "var(--text)";
          let border    = "2px solid transparent";
          let opacity   = 1;

          if (state === "future") { opacity = 0.5; textColor = "var(--future-grey)"; }
          if (bleeding !== "None") {
            bg = bleedingColor[bleeding];
            textColor = bleeding === "spotting" ? "var(--burgundy)" : "white";
          }
          if (isProjPeriod && state === "future") { border = `2px dashed var(--rose)`; textColor = "var(--rose)"; }
          if (isSelected) border = `2px solid var(--burgundy)`;
          if (isToday && !isSelected) border = `2px solid var(--gold)`;

          return (
            <div
              key={d}
              onClick={() => state !== "future" && onSelectDay(d)}
              style={{
                position: "relative", aspectRatio: "1", borderRadius: "50%",
                background: bg, border,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: state === "future" ? "default" : "pointer",
                opacity, transition: "transform 0.1s",
              }}
              onMouseEnter={e => { if (state !== "future") e.currentTarget.style.transform = "scale(1.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: textColor, lineHeight: 1 }}>
                {d}
              </span>
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
      <div style={{ display: "flex", gap: 12, padding: "8px 16px 12px", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { color: bleedingColor.heavy,    label: "Heavy" },
          { color: bleedingColor.medium,   label: "Medium" },
          { color: bleedingColor.light,    label: "Light" },
          { color: bleedingColor.spotting, label: "Spotting" },
          { color: bleedingColor.brown,    label: "Brown" },
          { color: bleedingColor.none,     label: "None" }
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