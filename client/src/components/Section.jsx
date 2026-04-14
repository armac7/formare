export default function Section({ icon, title, children }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(122,45,62,0.05)",
      border: "1px solid var(--gold-light)",
    }}>
      <div style={{
        padding: "12px 16px 10px", borderBottom: "1px solid var(--gold-light)",
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--parchment)",
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 500, color: "var(--burgundy)", letterSpacing: 0.5 }}>
          {title}
        </h4>
      </div>
      <div style={{ padding: "14px 16px" }}>{children}</div>
    </div>
  );
}
