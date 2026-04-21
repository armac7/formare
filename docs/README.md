# Formare Documentation

## Front-End

### React Render

**DISCLAIMER: Claude helped to produce the code for the front-end as this was the first serious project we all (Ryan, John, and Arun) have particpated in utilizing React. An effort has been made to truly learn React through this project, but given the time constraints, we could not make the application we wanted without the reliance of coding tools.**

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

For example, the `CalendarView.jsx` component utilizes this hook, `const { monthData, loading } = useMonthStatus();`, to get the monthData from `useMonthStatus` which is imported from `MonthStatusContext.js`. `monthData` is an `array of key-object pairs` where each **key is the day of the month (1-indexed), holding an object for every day of data recieved back from the database for a given month. 

To further explain, if `monthData[d]` is called and `d` is a day that does not exist as a key in the array, then `undefined` will be returned. 

This will look something like the following (this is test data for user admin):

```
Object { 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}, 6: {…}, 7: {…}, 8: {…}, 9: {…}, 10: {…}, … }
    1: Object { date: "2026-04-01", bbt: 97.2, bleeding: "heavy", … }
    2: Object { date: "2026-04-02", bbt: 97.1, bleeding: "medium", … }
    3: Object { date: "2026-04-03", bbt: 97, bleeding: "light", … }
    4: Object { date: "2026-04-04", bbt: 97.1, bleeding: "spotting", … }
    5: Object { date: "2026-04-05", bbt: 97.2, bleeding: "brown", … }
    6: Object { date: "2026-04-06", bbt: 97.3, bleeding: "None", … }
    7: Object { date: "2026-04-07", bbt: 97.4, bleeding: "None", … }
    8: Object { date: "2026-04-08", bbt: 97.5, bleeding: "None", … }
    9: Object { date: "2026-04-09", bbt: 97.4, bleeding: "None", … }
    10: Object { date: "2026-04-10", bbt: 97.3, bleeding: "None", … }
    11: Object { date: "2026-04-11", bbt: 97.2, bleeding: "None", … }
    12: Object { date: "2026-04-12", bbt: 97.7, bleeding: "None", … }
    13: Object { date: "2026-04-13", bbt: 98, mucus: "moist", … }
    14: Object { date: "2026-04-14", bbt: 98, bleeding: "None", … }
    15: Object { date: "2026-04-15", bbt: 98.1, bleeding: "None", … }
    16: Object { date: "2026-04-16", bleeding: "heavy", mucus: "moist", … }
```

The app parses this data and presents the day (or days) necessary to be shown per the current screen.

The context calls the function `getMonthStatus` from `client/src/scripts/api/getMonthStatus.js` to get the desired info from the database. This will be further discussed in the `Back-End` section. 

### Data Presentation

The data is called through `MonthStatusContext.jsx` into wherever it is needed using hooks, as shown above. Once done, the page will typically call `const entry = monthData[day]` and then parse the `entry` variable for the necessary information. This returns an object corresponding to the day. 

Let's take the `DayOverview.jsx` component as an example.

![Day Overview Prieview](day-overview-preview.svg)

First, the export function is defined `export default function DayOverview({ day, onEdit }) {` and the
month data is loaded `const { monthData, loading } = useMonthStatus();`

The given day entry is passed to a variable, `const entry = monthData[day];` and the date label ("Tuesday, April 14" in the above image) is created:

```jsx
const dateLabel = new Date(YEAR, MONTH, day).toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });
```

Then, the actual return element is created:

```jsx
return (
    <div className="overview-wrap">
        // notice this is the top of the component with the date label and the edit button.
      {/* Day header */}
      <div className="overview-header">
        <h3 className="overview-date-label">{dateLabel}</h3>
        <button className="overview-edit-btn" onClick={() => onEdit(day)}>
          Edit ✏️
        </button>
      </div>

        // here is when the entry data is parsed into each individual element and presented
      {entry ? (
        <div className="overview-content">

          {/* Biomarker cards */}
          <div className="bio-row">
            // first is bbt, called as entry.bbt if it exists; otherwise, just a dash
            // this pattern follows the rest of the biomarkers.
            {/* BBT */}
            <div className="bio-card">
              <span className="bio-label">🌡️ BBT</span>
              <span className="bio-value">
                {entry.bbt ? `${entry.bbt}°F` : <span className="bio-value--muted">—</span>}
              </span>
            </div>

            //... cut out the rest of the elements, can be found in `/client/src/pages/DayOverview.jsx`

        </div>
      ) : (
        // or, if there is no entry for the given day, an element specifying that is returned instead.
        <div className="overview-no-entry">
          <p>No data recorded for this day.</p>
          <button
            className={`overview-add-btn`}
            style={btnPrimaryStyle}
            onClick={() => onEdit(day)}
          >
            Add Entry
          </button>
        </div>
      )}

    </div>
  );
```

## Back-End

### Stack and File Config
This segues nicely into the backend. 

The Back-End Stack consists of **Node.JS, Express.JS, express-session, MongoDB via Mongoose, and dotenv**.
The structure is broken up nicely into the following sections:

```
/server/
|-config/
|----db.js (handles mongoose DB connection)
|-controllers/
|----authControllers.js (handles User model related DB calls for login/logout)
|----bodyStatusControllers.js (handles DB calls related to cycle information)
|----dbControllers.js (handles DB calls related to user creation or info editing)
|-middleware/
|----session.js (handles session)
|-models/
|----BodyStatus.js (mongoose model for BodyStatus)
|----User.js (mongoose model for User)
|-routes/ (all the related routes to the above controllers)
|----authRoutes.js
|----bodyStatusRoutes.js
|----dbRoutes.js
|----sessionRoutes.js
|-app.js (actual Node.JS app)
|//
```

`App.js` is set up where it handles the routes in this order:

```js
app.use('/', sessionRoutes);
app.use('/', authRoutes);
app.use('/', dbRoutes);
app.use('/', bodyStatusRoutes);
```

So, the server, when it recieves a request, will check in that order. 

### Data Call Example

Using the above example of `getMonthStatus`, let's trace that file from front to back and back to front.

First, the script at `client/src/scripts/api/getMonthStatus.js` is called inside `MonthStatusContext.jsx`.
The desired YEAR and MONTH is passed to the function and the request is formulated and sent to the backend:

```js
const res = await fetch(
      `/api/month-info?year=${year}&month=${month}`,
      {
          method: 'GET',
          credentials: "include"
      }
    );
```

This heads to the server where it tries to deduce where the route is from, given the above list. It checks and finally lands at `router.get('/api/month-info', getMonthStatus)`, where `getMonthStatus` comes from `server/controllers/bodyStatusController.js`. 

`getMonthStatus` recieves the req and res as arguments and immediately checks whether or not the user is logged in. If not authenticated, then the user is denied access; otherwise, the process continues:

```js
// gets the current user and parses the req query out into year and month from the above fetch.
    const { username } = req.session.user;
    const { year, month } = req.query;
      
    // the month is padded to ensure appropriate data is passed to the database query.
    const mm = String(month).padStart(2, "0");

    // console.log(`Fetching body status for ${username} for ${year}-${mm}`);
    try {
        // the BodyStatus model is used to find the desired month of data, using the indexed call
        // required the current data and user. 
        const bodyStatus = await BodyStatus.find({
            date: new RegExp(`^${year}-${mm}`),
            username
        }).lean();

        // then, if something is returned,
        if (bodyStatus.length > 0) {
            // the information is formatted to a new array via a map to ensure all the desired values
            // are present, either as null or recorded data.
            const formatted = bodyStatus.map(entry => ({
                date: entry.date,
                bbt: entry.basilBodyTemp ?? null,
                bleeding: entry.bleeding ?? null,
                mucus: entry.mucusSensations ?? null,
                mucusCharacteristic: entry.mucusCharacteristics ?? null,
                notes: entry.notes ?? "",
                symptoms: entry.secondaryBiomarkers?.length
                    ? entry.secondaryBiomarkers.join(", ")
                    : ""
            }));
          
            // finally, this data is returned.
            return res.json(formatted);
        } else {
            return res.status(404).json({ message: 'No body status found for the specified date' });
        }
    } catch (err) {
      console.error('Error fetching body status:', err);
      return res.status(500).json({ message: 'Error fetching body status' });
    }
```

Hopping back to the front-end script, we await the response then return it if a proper response was given.

```
const data = await res.json();
      
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch month status');
    }
    
    return data;
```

This response corresponds with the above **array of objects** with each object corresponding to a key (the key is the number of the day).

### Database Design Explanation

The database was designed this way with the help of **Professor Jason Watson** from the University of North Alabama over a short meeting. He instructed that a document database such as MongoDB is built around transactions, which essentially is a question asked by the user in a given scenario that represents the primary function of the application.

Formare's question is this: **"What is my body status for a given cycle?"**
A cycle is about 28 days on average, and thus fits nicely into a calendar month. 

*"Data presented together should be stored together,"* or so he said, and thus came the schema design.
Each document represents a specific day for a given user and contains all the information inputted from the front-end UI.
This is why there is the normalization process of formatting the response as seen above in the database back-end query script. It's for the sake of front-end ease of display so that every possible option is present either as null or actual data. 

When `getMonthStatus` is called, a `find` statement for the documents relating to a given user in a specific month of a specific year is ran. The reason for this is because the main dashboard of Formare is a calendar view, and this nicely presents away to get all the immediately necessary data without multiple database calls. 

# Sections to Add to Documentation

## Front-End
- MonthStatusContext.jsx internals, how it actually works
- Edit flow, how the "edit" view actually works (how a user edits or adds an entry)
- CSS/styling approach

## Back-End
- *Authentication flow, how login/logout actually works
- Session handling, what does session middleware do and how long does the session last
- *Mongoose models
- Other routes, like dbRoutes

## General
- Environment variables
- Known limitations or TODOs.

(* = important next steps to document).