export default function ProfileView({ user, onLogout }) {
  return (
    <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--rose-light), var(--gold-light))",
          margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
        }}>🌸</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "var(--burgundy)" }}>{user.name}</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Cycle awareness companion</p>
      </div>
      <div style={{ background: "var(--parchment)", borderRadius: 14, padding: 16, border: "1px solid var(--gold-light)" }}>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.7, fontSize: 15 }}>
          ✝ <em>Formare</em> supports a vision of health rooted in dignity of the human person and respect for the natural rhythms of the body.
        </p>
      </div>
      <button onClick={onLogout} style={{
        marginTop: 8, border: "1.5px solid var(--rose)", background: "none", color: "var(--rose-deep)",
        borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer",
      }}>
        Sign Out
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
        ❌ Not medical advice · ❌ Not a contraceptive tool<br />❌ Not a replacement for certified NFP instruction
      </p>
    </div>
  );
}
