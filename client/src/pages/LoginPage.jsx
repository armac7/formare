import { useState } from "react";
import { inputStyle, btnPrimaryStyle } from "../constants.js";
import { login } from "../scripts/auth/login.js";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [pass,  setPass]  = useState("");
  const [err,   setErr]   = useState("");

  async function handleSubmit() {
    if (!username || !pass) { setErr("Please fill in all fields."); return; }
    if (pass.length < 4) { setErr("Password too short."); return; }
    
    try {
      const data = await login(username, pass);

      if (!data.success) {
        setErr("Invalid credentials.");
        return;
      }

      onLogin({
        name: data.username,
        token: data.token
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
    } catch (error) {
      setErr(error);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(160deg, var(--parchment) 0%, var(--cream) 60%, #F0E8F0 100%)`,
      padding: "24px",
    }}>
      <div style={{
        background: "white", borderRadius: 24, padding: "48px 40px", maxWidth: 400, width: "100%",
        boxShadow: "0 8px 48px rgba(122,45,62,0.10)",
        border: "1px solid var(--gold-light)",
        display: "flex", flexDirection: "column", gap: 0,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--rose-light), var(--gold-light))",
            margin: "0 auto 12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
          }}>🌸</div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 300, color: "var(--burgundy)", letterSpacing: 2 }}>
            Formare
          </h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>
            Cycle Awareness
          </p>
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="text" placeholder="Username" value={username}
            onChange={e => { setUsername(e.target.value); setErr(""); }}
            style={inputStyle}
          />
          <input
            type="password" placeholder="Password" value={pass}
            onChange={e => { setPass(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={inputStyle}
          />
          {err && <p style={{ color: "var(--rose-deep)", fontSize: 13, textAlign: "center" }}>{err}</p>}
          <button onClick={handleSubmit} style={btnPrimaryStyle}>Sign In</button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>New to Formare? </span>
          <span style={{ color: "var(--rose-deep)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            Create account
          </span>
        </div>

        <p style={{
          marginTop: 28, fontSize: 11, color: "var(--text-muted)", textAlign: "center",
          lineHeight: 1.6, borderTop: "1px solid var(--gold-light)", paddingTop: 16,
        }}>
          ✝ <em>Formare</em> is a cycle awareness companion, not medical advice.
        </p>
      </div>
    </div>
  );
}
