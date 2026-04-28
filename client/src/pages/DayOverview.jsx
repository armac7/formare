import { YEAR, MONTH, SYMPTOM_OPTIONS, bleedingColor, bleedingLabel, btnPrimaryStyle } from "../constants.js";
import { useMonthStatus } from "../context/MonthStatusContext.jsx";
import { useAIInsight } from "../hooks/useAIInsight.js";
import MucusIcon from "../components/MucusIcon.jsx";
import "./css/DayOverview.css";

export default function DayOverview({ day, month, year, onEdit }) {
  const { monthData, loading } = useMonthStatus(month, year);
  const entry = monthData?.[day];

  // ── AI Insight ──
  const {
    insight,
    loading: insightLoading,
    error:   insightError,
    refetch: refetchInsight,
  } = useAIInsight(day, month, year, entry);

  if (loading) {
    return (
      <div className="overview-loading">
        <p>Loading…</p>
      </div>
    );
  }

  if (!day || month >= MONTH + 1 || year > YEAR) {
    return (
      <p className="overview-empty-prompt">
        Select a day to view its overview
      </p>
    );
  }

  const dateLabel = new Date(year, month, day).toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });

  return (
    <div className="overview-wrap">

      {/* Day header */}
      <div className="overview-header">
        <h3 className="overview-date-label">{dateLabel}</h3>
        <button className="overview-edit-btn" onClick={() => onEdit(day)}>
          Edit ✏️
        </button>
      </div>

      {entry ? (
        <div className="overview-content">

          {/* Biomarker cards */}
          <div className="bio-row">

            {/* BBT */}
            <div className="bio-card">
              <span className="bio-label">🌡️ BBT</span>
              <span className="bio-value">
                {entry.bbt ? `${entry.bbt}°F` : <span className="bio-value--muted">—</span>}
              </span>
            </div>

            {/* Mucus */}
            <div className="bio-card">
              <span className="bio-label">💧 Mucus</span>
              {entry.mucus ? (
                <div className="bio-mucus-inner">
                  <MucusIcon type={entry.mucus} size={18} />
                  <span className="bio-value">{entry.mucus}</span>
                </div>
              ) : (
                <span className="bio-value bio-value--muted">—</span>
              )}
            </div>

            {/* Bleeding */}
            <div className="bio-card">
              <span className="bio-label">🩸 Bleeding</span>
              <span
                className="bio-value"
                style={{ color: entry.bleeding ? bleedingColor[entry.bleeding] : undefined }}
              >
                {entry.bleeding ? bleedingLabel[entry.bleeding] : (
                  <span className="bio-value--muted">None</span>
                )}
              </span>
            </div>

          </div>

          {/* Symptoms */}
          {entry.symptoms?.length > 0 && (() => {
            const physical  = entry.symptoms.filter(s => SYMPTOM_OPTIONS.find(o => o.key === s && o.type === "physical"));
            const emotional = entry.symptoms.filter(s => SYMPTOM_OPTIONS.find(o => o.key === s && o.type === "emotional"));

            const renderChips = (keys) => keys.map(s => {
              const opt = SYMPTOM_OPTIONS.find(o => o.key === s);
              return (
                <span key={s} className="symptom-chip">
                  {opt?.emoji} {opt?.label ?? s.replaceAll("_", " ")}
                </span>
              );
            });

            return (
              <div className="overview-section">
                <p className="overview-section-label">Symptoms</p>
                {physical.length > 0 && (
                  <>
                    <p className="overview-section-sublabel">Physical</p>
                    <div className="symptom-chips">{renderChips(physical)}</div>
                  </>
                )}
                {emotional.length > 0 && (
                  <>
                    <p className="overview-section-sublabel">Emotional</p>
                    <div className="symptom-chips">{renderChips(emotional)}</div>
                  </>
                )}
              </div>
            );
          })()}

          {/* Notes */}
          <div className="overview-section">
            <p className="overview-section-label">Notes</p>
            <p className={`overview-notes-text${entry.notes ? "" : " overview-notes-text--empty"}`}>
              {entry.notes || "No notes for this day."}
            </p>
          </div>

          {/* ── AI Insight ── */}
          <div className="insight-section">
            <div className="insight-header">
              <span className="insight-title">✨ Daily Insight</span>
              <button
                className="insight-refresh-btn"
                onClick={refetchInsight}
                disabled={insightLoading}
                title="Refresh insight"
              >
                {insightLoading ? "…" : "↻"}
              </button>
            </div>

            {insightLoading && (
              <div className="insight-loading">
                <span className="insight-loading-dot" />
                <span className="insight-loading-dot" />
                <span className="insight-loading-dot" />
              </div>
            )}

            {insightError && !insightLoading && (
              <div className="insight-error">
                <p>{insightError}</p>
                <button className="insight-retry-btn" onClick={refetchInsight}>
                  Try again
                </button>
              </div>
            )}

            {insight && !insightLoading && (
              <p className="insight-text">{insight}</p>
            )}

            {!insight && !insightLoading && !insightError && (
              <p className="insight-empty">No insight available for this day.</p>
            )}
          </div>

        </div>
      ) : (
        <div className="overview-no-entry">
          <p>No data recorded for this day.</p>
          <button
            className="overview-add-btn"
            style={btnPrimaryStyle}
            onClick={() => onEdit(day)}
          >
            Add Entry
          </button>
        </div>
      )}

    </div>
  );
}