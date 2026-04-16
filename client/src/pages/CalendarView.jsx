import { useState, useEffect } from "react";
import { TODAY, YEAR, MONTH, MONTH_NAMES, DAYS_OF_WEEK, MOCK, bleedingColor } from "../constants.js";
import { useMonthStatus } from "../context/MonthStatusContext.jsx";
import "./CalendarView.css";

// ── Hook: detect screen width ──────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

const BLEEDING_LEGEND = ["heavy", "medium", "light", "spotting", "brown"];

export default function CalendarView({ onSelectDay, selectedDay }) {
  const { monthData, loading } = useMonthStatus();
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="calendar-loading">
        <p>Loading…</p>
      </div>
    );
  }

  const daysInMonth   = new Date(YEAR, MONTH + 1, 0).getDate();
  const firstDayIndex = new Date(YEAR, MONTH, 1).getDay();
  const todayDate     = TODAY.getDate();

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function dayState(d) {
    if (!d)            return "empty";
    if (d > todayDate) return "future";
    return "past";
  }

  function getDynamicStyles(d) {
    const state        = dayState(d);
    const entry        = monthData[d];
    const bleeding     = entry?.bleeding;
    const isProjPeriod = MOCK.projectedPeriod.includes(d);
    const isSelected   = selectedDay === d;
    const isToday      = d === todayDate;

    let background = "transparent";
    let color      = "var(--text)";
    let border     = "2px solid transparent";
    let fontWeight = 400;

    if (state === "future")                 { color = "var(--future-grey)"; }
    if (bleeding && bleeding !== "None")    { background = bleedingColor[bleeding]; color = bleeding === "spotting" ? "var(--burgundy)" : "white"; }
    if (isProjPeriod && state === "future") { border = "2px dashed var(--rose)"; color = "var(--rose)"; }
    if (isSelected)                         { border = "2px solid var(--burgundy)"; }
    if (isToday && !isSelected)             { border = "2px solid var(--gold)"; }
    if (isToday)                            { fontWeight = 700; }

    return { cellStyle: { background, border }, numStyle: { color, fontWeight } };
  }

  const Legend = () => (
    <div className="calendar-legend">
      {BLEEDING_LEGEND.map(key => (
        <div key={key} className="legend-item">
          <span className="legend-dot" style={{ background: bleedingColor[key] }} />
          <span className="legend-label">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        </div>
      ))}
      <div className="legend-item">
        <span className="legend-dot" style={{ background: "transparent", border: "2px dashed var(--rose)" }} />
        <span className="legend-label">Projected</span>
      </div>
    </div>
  );

  const GridCells = () => cells.map((d, i) => {
    if (!d) return <div key={`e-${i}`} />;
    const state = dayState(d);
    const entry = monthData[d];
    const { cellStyle, numStyle } = getDynamicStyles(d);

    const cellClass = [
      "cal-cell",
      state === "future" ? "cal-cell--future" : "cal-cell--clickable",
    ].join(" ");

    return (
      <div
        key={d}
        className={cellClass}
        style={cellStyle}
        onClick={() => state !== "future" && onSelectDay(d)}
      >
        <span className="cal-day-num" style={numStyle}>{d}</span>
        {entry?.bbt && (
          <span className="bbt-dot"
            style={{ background: entry.bbt > 97.7 ? "var(--gold)" : "var(--sage)" }}
          />
        )}
        {entry?.bbt && (
          <span className="bbt-label">{entry.bbt}°</span>
        )}
      </div>
    );
  });

  return (
    <div className="calendar-wrap">

      <div className="calendar-header">
        <div>
          <h2 className="calendar-month-name">{MONTH_NAMES[MONTH]}</h2>
          <p className="calendar-year">{YEAR}</p>
        </div>
        {!isMobile && <Legend />}
        <span className="calendar-header-icon">🌸</span>
      </div>

      <div className="dow-row">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="dow-cell">
            {isMobile ? d[0] : d.slice(0, 2)}
          </div>
        ))}
      </div>

      <div className="cal-grid">
        <GridCells />
      </div>

      {isMobile && <Legend />}

    </div>
  );
}