import { useState, useEffect } from "react";
import { TODAY } from "./constants.js";
import LoginPage    from "./pages/LoginPage.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import DayOverview  from "./pages/DayOverview.jsx";
import DayByDayView from "./pages/DayByDayView.jsx";
import InsightsView from "./pages/InsightsView.jsx";
import ProfileView  from "./pages/ProfileView.jsx";
import TabBar       from "./components/TabBar.jsx";
import { logout } from "./scripts/auth/logout.js";
import { MonthStatusProvider } from "./context/MonthStatusContext.jsx";
import "./App.css";

export default function App() {
  const [user,        setUser]        = useState(null);
  const [view,        setView]        = useState("calendar");
  const [activeTab,   setActiveTab]   = useState("calendar");
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [selectedMonth, setSelectedMonth] = useState(TODAY.getMonth());
  const [selectedYear, setSelectedYear] = useState(TODAY.getFullYear());
  const [editDay,     setEditDay]     = useState(null);
  const [loading,     setLoading]     = useState(true);

  async function handleLogin() {
    const res  = await fetch("/auth", { credentials: "include" });
    const data = await res.json();
    if (data.loggedIn) setUser({ name: data.username });
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
        const res  = await fetch("/auth", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) setUser({ name: data.username });
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();

  }, []);

  if (loading) return <div className="app-loading">Loading…</div>;
  if (!user)   return <LoginPage onLogin={handleLogin} />;

  // Edit view — full screen, no header/tabbar
  if (view === "edit") return (
    <MonthStatusProvider>
      <div className="app-shell">
        <DayByDayView
          initialDay={editDay}
          month={selectedMonth}
          year={selectedYear}
          onBack={() => setView("calendar")}
        />
      </div>
    </MonthStatusProvider>
  );

  return (
    <MonthStatusProvider>
      <div className="app-shell">

        {/* App header */}
        <header className="app-header">
          <div className="app-header-logo">
            <span className="app-header-icon">🌸</span>
            <h1 className="app-header-title">Formare</h1>
          </div>
          <span className="app-header-username">{user.name}</span>
        </header>

        {/* Main content */}
        <main className="app-content">
          {activeTab === "calendar" && (
            <>
              <CalendarView
                selectedDay={selectedDay}
                onSelectDay={(d, month, year) => {
                  setSelectedDay(d)
                  setSelectedMonth(month);
                  setSelectedYear(year);
                }}
              />
              <div className="calendar-divider" />
              <div className="day-overview-tab">
                <DayOverview
                  day={selectedDay}
                  month={selectedMonth}
                  year={selectedYear}
                  onEdit={d => { setEditDay(d); setView("edit"); }}
                />
              </div>
            </>
          )}
          {activeTab === "insights" && <InsightsView />}
          {activeTab === "profile"  && <ProfileView user={user} onLogout={handleLogout} />}
        </main>

        {/* Tab bar */}
        <TabBar active={activeTab} onTab={tab => setActiveTab(tab)} />

      </div>
    </MonthStatusProvider>
  );
}