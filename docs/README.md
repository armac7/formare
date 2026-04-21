# Formare Documentation

## Front-End

### React Render
The Formare front-end relies on React as the foundational framework for presenting the User Interface and handling the User Experience. The React render is found in `/client/src/main.jsx` as 

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Though, it really just runs `/client/src/App.jsx` and pushes it to the `div element` with the ID "root" in `/client/index.html`. `App.jsx` handles the actual state of the webapp itself. All of the individual pages and components are separated out in `/client/src/pages/` and are imported into `App.jsx` for utilization.

### App.jsx Functionality and Pages

The application is unusable if not authentication and logged in, so the app first ensures that there is currently a user signed in; if not, then the user is sent to the login page:

```jsx
// handles the login logic
async function handleLogin() {
    const res  = await fetch("/auth", { credentials: "include" });
    const data = await res.json();
    if (data.loggedIn) setUser({ name: data.username });
  }

// handles the logout logic, calls a JS function "logout" to handle the backend token destruction.
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    logout();
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        // gets the authentication info from the backend
        const res  = await fetch("/auth", { credentials: "include" });
        // parses the response
        const data = await res.json();
        // if the user is logged in, update the user useState.
        if (data.loggedIn) setUser({ name: data.username });
        // otherwise, no user
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    // actually calls the function
    checkAuth();
  }, []);

  if (loading) return <div className="app-loading">Loading…</div>;
  // if the user does not exist (is null), redirect to the login page. On login, call the handleLogin function
  if (!user)   return <LoginPage onLogin={handleLogin} />;
```

`App.jsx` imports each page from `/client/src/pages/` at the top and utilizes them alongside useState hooks to determine which page should be currently shown to the user. You can see that above with the `useEffect`, which utilizes the `setUser` useState hook and `setLoading`.

`App.jsx` is a big state machine which handles what the user currently sees and can do. 

For example, this is the primary return of `App.jsx`

```jsx
return (
    // wrapped in a Context that allows data persistence for the given user without multiple DB calls.
    <MonthStatusProvider>
      <div className="app-shell">

        {/* App header */}
        <header className="app-header">
          <div className="app-header-logo">
            <span className="app-header-icon">🌸</span>
            <h1 className="app-header-title">Formare</h1>
          </div>
          // utilizes the user useState hook to get the current users name.
          <span className="app-header-username">{user.name}</span>
        </header>

        {/* Main content */}
        <main className="app-content">
        // if the activeTab is the calendar view (the default dashboard), then it is loaded
        // with the dayOverview directly under it
          {activeTab === "calendar" && (
            <>
            // the code for this component is stored in /client/src/pages/CalendarView.jsx
              <CalendarView
                selectedDay={selectedDay}
                onSelectDay={d => setSelectedDay(d)}
              />
              <div className="calendar-divider" />
              <div className="day-overview-tab">
              // the code for this component is stored in /client/src/pages/DayOverview.jsx
                <DayOverview
                  day={selectedDay}
                  onEdit={d => { setEditDay(d); setView("edit"); }}
                />
              </div>
            </>
          )}
        // likewise, if the activeTab is something else, call that page instead.
          {activeTab === "insights" && <InsightsView />}
          {activeTab === "profile"  && <ProfileView user={user} onLogout={handleLogout} />}
        </main>

        {/* Tab bar */}
        <TabBar active={activeTab} onTab={tab => setActiveTab(tab)} />

      </div>
    </MonthStatusProvider>
  );
```

### Data Consistency

Instead of doing multiple calls per page or when the data is needed, the data for the given month is called in `/client/src/context/MonthStatusContext.js`. This is then exported for use across the whole project. 

For example, the `CalendarView.jsx` component utilizes this hook, `const { monthData, loading } = useMonthStatus();`, to get the monthData from `useMonthStatus` which is imported from `MonthStatusContext.js`. `monthData` is an `array of objects` which holds an `object` for **every day of data recieved back from the database for a given month**.

This will look something like the following:



The context calls the function `getMonthStatus` from `../scripts/api/getMonthStatus.js"` to get the desired info from the database. This will be further discussed in the `Back-End` section. 
