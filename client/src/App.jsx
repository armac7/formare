import { useState, useEffect } from "react";
import { TODAY } from "./constants.js";

// pages and components
import LoginPage    from "./pages/LoginPage.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import DayOverview  from "./pages/DayOverview.jsx";
import DayByDayView from "./pages/DayByDayView.jsx";
import InsightsView from "./pages/InsightsView.jsx";
import ProfileView  from "./pages/ProfileView.jsx";
import TabBar       from "./components/TabBar.jsx";
import { logout } from "./scripts/auth/logout.js";

export default function App() {
  const [user,        setUser]        = useState(null);
  const [view,        setView]        = useState("calendar"); // calendar | edit
  const [activeTab,   setActiveTab]   = useState("calendar");
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [editDay, setEditDay] = useState(null);
  const [loading, setLoading] = useState(true);

  async function handleLogin() {
  const res = await fetch("/auth", {
    credentials: "include"
  });

  const data = await res.json();

  if (data.loggedIn) {
    setUser({ name: data.username });
  }
}

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    logout();
  }

  useEffect(() => {
  async function checkAuth() {
    try {
      const res = await fetch("/auth", {
        credentials: "include"
      });

      const data = await res.json();

      if (data.loggedIn) {
        setUser({ name: data.username });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  checkAuth();
}, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginPage onLogin={handleLogin} />;
  
  if (view === "edit") return (
    <>
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--cream)" }}>
        <DayByDayView initialDay={editDay} onBack={() => setView("calendar")} />
      </div>
    </>
  );

  return (
    <>
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--cream)" }}>
        {/* App Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 12px", background: "white", borderBottom: "1px solid var(--gold-light)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🌸</span>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 400, color: "var(--burgundy)", letterSpacing: 2 }}>
              Formare
            </h1>
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>
            {user.name}
          </span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {activeTab === "calendar" && (
            <>
              <CalendarView
                selectedDay={selectedDay}
                onSelectDay={d => setSelectedDay(d)}
              />
              <div style={{ height: 1, background: "var(--gold-light)", margin: "0 16px" }} />
              <div style={{ paddingTop: 16 }}>
                <DayOverview
                  day={selectedDay}
                  onEdit={d => { setEditDay(d); setView("edit"); }}
                />
              </div>
            </>
          )}
          {activeTab === "insights" && <InsightsView />}
          {activeTab === "profile"  && <ProfileView user={user} onLogout={handleLogout} />}
        </div>

        {/* Tab Bar */}
        <TabBar active={activeTab} onTab={tab => setActiveTab(tab)} />
      </div>
    </>
  );
}