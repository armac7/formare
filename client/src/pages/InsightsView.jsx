export default function InsightsView() {
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
