import { useState, useEffect } from "react";
import { TODAY, YEAR, MONTH, MONTH_NAMES, DAYS_OF_WEEK, MOCK, bleedingColor } from "../constants.js";
import { useMonthStatus } from "../context/MonthStatusContext.jsx";
import "./CalendarView.css";

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

// ── Main Component ─────────────────────────────────────────
export default function CalendarView({ onSelectDay, selectedDay }) {
  const isMobile = useIsMobile();
  const [viewMonth, setViewMonth] = useState(MONTH);
  const [viewYear, setViewYear] = useState(YEAR);
  const [projectedPeriod, setProjectedPeriod] = useState([]);
  const { monthData, loading, loadMonth } = useMonthStatus();
  
  useEffect(() => { 
    // console.log("Month or year changed, loading month status for", viewYear, viewMonth + 1);
    loadMonth(viewYear, viewMonth); // Load data for the current month/year when they change
    onSelectDay(selectedDay, viewMonth, viewYear); // Pass month and year to parent when changing month
  }, [viewMonth, viewYear, loadMonth]);

  // if is loading, show a loading state (can be a spinner or skeleton)
  if (loading) return <div className="calendar-loading"><p>Loading…</p></div>;

  const handleMonthChange = (direction) => {
    const newDate = new Date(viewYear, viewMonth + direction, 1);
    setViewMonth(newDate.getMonth());
    setViewYear(newDate.getFullYear());
  };

  // ── WEEK START: SUNDAY (Standard) ──
  // get number of days in the month and the weekday of the first day
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  
  // No shift needed for Sunday start
  const displayDaysOfWeek = DAYS_OF_WEEK;
  
  // makes sure to calculate today’s date based on the currently viewed month and year, not just the current month
  const isCurrentMonth = viewMonth === TODAY.getMonth() && viewYear === TODAY.getFullYear();
  const todayDate = isCurrentMonth ? TODAY.getDate() : null;

  // Create an array of cells for the calendar grid, starting with empty cells for the first week offset
  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // checks if the day is in the past, future, or has no data, and returns a corresponding state string
  function dayState(d) {
    if (!d) return "empty";
    const cellDate = new Date(viewYear, viewMonth, d);
    if (cellDate > TODAY) return "future";
    return "past";
  }

  // calculates dynamic styles for a calendar cell based on its state, bleeding status, whether it's projected, selected, or today
  function getDynamicStyles(d) {
    // console.log("Calculating styles for day", d, "with entry", monthData[d]);
    const state = dayState(d);
    const entry        = monthData[d];
    const bleeding     = entry?.bleeding;
    // const isProjPeriod = MOCK.projectedPeriod.includes(d);
    const isSelected   = selectedDay === d && state !== "future";
    const isToday = d === todayDate && state !== "future";
    // console.log(`Day ${d} - State: ${state}, Bleeding: ${bleeding}, Projected: ${isProjPeriod}, Selected: ${isSelected}, Today: ${isToday}`);

    // determine styles based on the above conditions
    let background = "transparent";
    let color      = "var(--text)";
    let border     = "2px solid transparent";
    let fontWeight = 400;

    if (state === "future")                 { color = "var(--future-grey)"; }
    if (bleeding && bleeding !== "None")    { background = bleedingColor[bleeding]; color = bleeding === "spotting" ? "var(--burgundy)" : "white"; }
    // if (isProjPeriod && state === "future") { border = "2px dashed var(--rose)"; color = "var(--rose)"; }
    if (isSelected)                         { border = "2px solid var(--burgundy)"; }
    if (isToday && !isSelected)             { border = "2px solid var(--gold)"; }
    if (isToday)                            { fontWeight = 700; }

    return { cellStyle: { background, border }, numStyle: { color, fontWeight } };
  }

  // a legend component to explain the bleeding colors and projected period styling
  const Legend = () => (
    <div className="calendar-legend">
      {/* Gets the bleeding types from the constants and creates a legend item for each, showing a colored dot and label */}
      {BLEEDING_LEGEND.map(key => (
        <div key={key} className="legend-item">
          <span className="legend-dot" style={{ background: bleedingColor[key] }} />
          <span className="legend-label">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        </div>
      ))}
      {/* A legend item for the projected period, showing a dashed border dot and label */}
      <div className="legend-item">
        <span className="legend-dot" style={{ background: "transparent", border: "2px dashed var(--rose)" }} />
        <span className="legend-label">Projected</span>
      </div>
    </div>
  );

  // a component to render the grid cells for each day, applying dynamic styles and click handlers
  const GridCells = () => cells.map((d, i) => {
    // if the cell is null (empty), render an empty div to maintain grid structure
    if (!d) return <div key={`e-${i}`} />;
    const state = dayState(d);
    const entry = monthData[d];
    // console.log(`Rendering cell for day ${d} with state ${state} and entry:`, entry);
    const { cellStyle, numStyle } = getDynamicStyles(d);

    // determine the class for the cell based on its state (empty, future, clickable)
    const cellClass = [
      "cal-cell",
      state === "future" ? "cal-cell--future" : "cal-cell--clickable",
    ].join(" ");

    // COMMENTS FOR <div> OPENING TAG:
    /* Use the day number as the key for the cell, since it is unique within the month */
    /* If the day is not in the future, make it clickable, when clicked call onSelectDay from the parent component */
    return (
      <div
        key={d}
        className={cellClass}
        style={cellStyle}
        onClick={() => state !== "future" && onSelectDay(d, viewMonth, viewYear)}
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

  // now we return the main JSX for the calendar view, which includes the header, 
  // days of week row, and the grid of cells, as well as the legend (conditionally rendered based on screen size)
  return (
    <div className="calendar-wrap">
      {/* Header section with month name, year, and an icon. The legend is shown in the header on desktop but moved below the grid on mobile for better layout */}
      <div className="calendar-header side-nav-layout">
        <button onClick={() => handleMonthChange(-1)} className="nav-arrow-side">←</button>

        <div className="calendar-title-center">
          <h2 className="calendar-month-name">{MONTH_NAMES[viewMonth]}</h2>
          <p className="calendar-year">{viewYear}</p>
        </div>

        <button onClick={() => handleMonthChange(1)} className="nav-arrow-side">→</button>
      </div>

      {/* Header section with month name, year, and an icon. The legend is shown in the header on desktop but moved below the grid on mobile for better layout */}
      <div className="dow-row">
        {displayDaysOfWeek.map(d => (
          <div key={d} className="dow-cell">
            {isMobile ? d[0] : d.slice(0, 2)}
          </div>
        ))}
      </div>
      
      {/* The grid of cells representing each day of the month, rendered by the GridCells component which applies dynamic styles and click handlers based on the day state and data */}
      <div className="cal-grid">
        <GridCells />
      </div>

      {/* On mobile, we show the legend below the grid to save horizontal space in the header and maintain a clean layout. On desktop, the legend is in the header for easy reference. */}
      {isMobile && <Legend />}
    </div>
  );
}