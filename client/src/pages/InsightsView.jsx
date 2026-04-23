import { useState, useEffect } from "react";
import { TODAY, MONTH_NAMES } from "../constants.js";
import { useMonthStatus } from "../context/MonthStatusContext.jsx";
import "./InsightsView.css";

const OPENAI_monthLY_ENDPOINT = "/api/ai-monthly-insight";

export default function InsightsView({day, month, year}) {
  const { monthData, loading, allMonthsData } = useMonthStatus();
  const [insight, setInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Summary stats from current month ──
  const entries = Object.values(monthData);
  const loggedDays = entries.length;
  const bleedingDays = entries.filter(e => e.bleeding && e.bleeding !== "None").length;
  const bbtReadings = entries.filter(e => e.bbt).map(e => e.bbt);
  const avgBBT = bbtReadings.length
    ? (bbtReadings.reduce((a, b) => a + b, 0) / bbtReadings.length).toFixed(2)
    : null;

  // Most common symptoms this month
  const symptomCount = {};
  entries.forEach(e => (e.symptoms || []).forEach(s => {
    symptomCount[s] = (symptomCount[s] || 0) + 1;
  }));
  const topSymptoms = Object.entries(symptomCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key.replaceAll("_", " "));

  async function fetchMonthlyInsight(force = false) {
    if (loggedDays === 0) return;
    const cacheKey = `formare_monthly_insight_${year}_${month}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached && !force) { setInsight(cached); return; }

    setAiLoading(true);
    setError(null);

    try {
      const res = await fetch(OPENAI_monthLY_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: year,
          month: month,
          loggedDays,
          bleedingDays,
          avgBBT,
          topSymptoms,
          totalDays: new Date(year, month + 1, 0).getDate(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch insight");
      setInsight(data.insight);
      sessionStorage.setItem(cacheKey, data.insight);
    } catch (err) {
      setError("Could not load monthly insight. Try again later.");
    } finally {
      setAiLoading(false);
    }
  }

  useEffect(() => {
    if (!loading && loggedDays > 0) fetchMonthlyInsight();
  }, [loading]);

  if (loading) {
    return (
      <div className="insights-loading">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="insights-wrap">

      {/* ── Header ── */}
      <div className="insights-header">
        <div>
          <h2 className="insights-title">Monthly Insights</h2>
          <p className="insights-subtitle">{MONTH_NAMES[month]} {year}</p>
        </div>
        <span className="insights-icon">✨</span>
      </div>

      {/* ── Stats cards ── */}
      <div className="insights-stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{loggedDays}</span>
          <span className="stat-label">Days Logged</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🩸</span>
          <span className="stat-value">{bleedingDays}</span>
          <span className="stat-label">Bleeding Days</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🌡️</span>
          <span className="stat-value">{avgBBT ?? "—"}</span>
          <span className="stat-label">Avg BBT °F</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-value">
            {Math.round((loggedDays / new Date(year, month + 1, 0).getDate()) * 100)}%
          </span>
          <span className="stat-label">Consistency</span>
        </div>
      </div>

      {/* ── Top symptoms ── */}
      {topSymptoms.length > 0 && (
        <div className="insights-section">
          <p className="insights-section-label">Most Logged Symptoms</p>
          <div className="insights-chips">
            {topSymptoms.map(s => (
              <span key={s} className="insights-chip">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Monthly insight ── */}
      <div className="insights-ai-section">
        <div className="insights-ai-header">
          <span className="insights-ai-title">✨ AI Monthly Summary</span>
          <button
            className="insights-refresh-btn"
            onClick={() => fetchMonthlyInsight(true)}
            disabled={aiLoading}
            title="Refresh"
          >
            {aiLoading ? "…" : "↻"}
          </button>
        </div>

        {aiLoading && (
          <div className="insights-loading-dots">
            <span /><span /><span />
          </div>
        )}

        {error && !aiLoading && (
          <div className="insights-error">
            <p>{error}</p>
            <button className="insights-retry-btn" onClick={() => fetchMonthlyInsight(true)}>
              Try again
            </button>
          </div>
        )}

        {insight && !aiLoading && (
          <p className="insights-ai-text">{insight}</p>
        )}

        {!insight && !aiLoading && !error && loggedDays === 0 && (
          <p className="insights-empty">
            No data logged this month yet. Start tracking to unlock your monthly summary.
          </p>
        )}
      </div>

    </div>
  );
}