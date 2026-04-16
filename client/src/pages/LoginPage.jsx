import { useState } from "react";
import { inputStyle, btnPrimaryStyle } from "../constants.js";
import { login } from "../scripts/auth/login.js";
import { register } from "../scripts/auth/register.js";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [err, setErr] = useState("");

  function resetForm() {
    setUsername("");
    setPass("");
    setConfirmPass("");
    setErr("");
  }

  function switchMode(newMode) {
    setMode(newMode);
    resetForm();
  }

  async function handleLogin() {
    if (!username || !pass) { setErr("Please fill in all fields."); return; }
    if (pass.length < 4) { setErr("Password too short."); return; }

    try {
      const data = await login(username, pass);
      if (!data.success) { setErr("Invalid credentials."); return; }
      onLogin({ name: data.username, token: data.token });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
    } catch (error) {
      setErr("Something went wrong. Please try again.");
    }
  }

  async function handleRegister() {
    if (!username || !pass || !confirmPass) { setErr("Please fill in all fields."); return; }
    if (pass.length < 4) { setErr("Password must be at least 4 characters."); return; }
    if (pass !== confirmPass) { setErr("Passwords do not match."); return; }

    try {
      const data = await register(username, pass, confirmPass);
      if (!data.success) { setErr(data.message || "Could not create account."); return; }
      switchMode("login");
      setErr("Account created! Please log in.");
    } catch (error) {
      setErr("Something went wrong. Please try again.");
    }
  }

  const isLogin = mode === "login";

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

        {/* Mode toggle */}
        <div style={{
          display: "flex", background: "var(--parchment)", borderRadius: 12,
          padding: 4, marginBottom: 24,
        }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontWeight: mode === m ? 700 : 400, transition: "all 0.2s",
              background: mode === m ? "white" : "transparent",
              color: mode === m ? "var(--burgundy)" : "var(--text-muted)",
              boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
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
            onKeyDown={e => e.key === "Enter" && (isLogin ? handleLogin() : handleRegister())}
            style={inputStyle}
          />
          {!isLogin && (
            <input
              type="password" placeholder="Confirm Password" value={confirmPass}
              onChange={e => { setConfirmPass(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleRegister()}
              style={inputStyle}
            />
          )}
          {err && <p style={{ color: "var(--rose-deep)", fontSize: 13, textAlign: "center" }}>{err}</p>}
          <button onClick={isLogin ? handleLogin : handleRegister} style={btnPrimaryStyle}>
            {isLogin ? "Sign In" : "Create Account"}
          </button>
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