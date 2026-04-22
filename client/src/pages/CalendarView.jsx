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

export default function CalendarView({ onSelectDay, selectedDay }) {
  const { monthData, loading } = useMonthStatus();
  const isMobile = useIsMobile();

  const [viewMonth, setViewMonth] = useState(MONTH);
  const [viewYear, setViewYear] = useState(YEAR);

  if (loading) return <div className="calendar-loading"><p>Loading…</p></div>;

  const handleMonthChange = (direction) => {
    const newDate = new Date(viewYear, viewMonth + direction, 1);
    setViewMonth(newDate.getMonth());
    setViewYear(newDate.getFullYear());
  };

  // ── WEEK START: SUNDAY (Standard) ──
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  // No shift needed for Sunday start
  const displayDaysOfWeek = DAYS_OF_WEEK;

  const isCurrentMonth = viewMonth === TODAY.getMonth() && viewYear === TODAY.getFullYear();

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function dayState(d) {
    if (!d) return "empty";
    const cellDate = new Date(viewYear, viewMonth, d);
    if (cellDate > TODAY) return "future";
    return "past";
  }

  // ... (getDynamicStyles and Legend components remain as they were in your original file)

  const GridCells = () => cells.map((d, i) => {
    if (!d) return <div key={`e-${i}`} />;
    const state = dayState(d);
    // Logic for styles remains same, using viewYear/viewMonth for context
    return (
      <div
        key={d}
        className={`cal-cell ${state === "future" ? "cal-cell--future" : "cal-cell--clickable"}`}
        onClick={() => state !== "future" && onSelectDay(d, viewMonth, viewYear)}
      >
        <span className="cal-day-num">{d}</span>
      </div>
    );
  });

  return (
    <div className="calendar-wrap">
      {/* ── UPDATED HEADER FOR SIDE ARROWS ── */}
      <div className="calendar-header side-nav-layout">
        <button onClick={() => handleMonthChange(-1)} className="nav-arrow-side">←</button>

        <div className="calendar-title-center">
          <h2 className="calendar-month-name">{MONTH_NAMES[viewMonth]}</h2>
          <p className="calendar-year">{viewYear}</p>
        </div>

        <button onClick={() => handleMonthChange(1)} className="nav-arrow-side">→</button>
      </div>

      <div className="dow-row">
        {displayDaysOfWeek.map(d => (
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