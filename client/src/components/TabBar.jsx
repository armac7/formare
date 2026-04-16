export default function TabBar({ active, onTab }) {
  const tabs = [
    { key: "calendar", icon: "📅", label: "Calendar" },
    { key: "insights", icon: "✨", label: "Insights" },
    { key: "profile",  icon: "🌸", label: "Profile" },
  ];
  return (
    <div style={{
      display: "flex", background: "white",
      borderTop: "1px solid var(--gold-light)",
      position: "sticky", bottom: 0,
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onTab(t.key)} style={{
          flex: 1, padding: "10px 0 8px", border: "none", background: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          color: active === t.key ? "var(--rose-deep)" : "var(--text-muted)",
          transition: "color 0.15s",
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{t.label}</span>
          {active === t.key && (
            <span style={{ width: 16, height: 2, background: "var(--rose-deep)", borderRadius: 2 }} />
          )}
        </button>
      ))}
    </div>
  );
}
