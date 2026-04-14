// ─── Date Globals ─────────────────────────────────────────────────────────────
export const TODAY = new Date();
export const YEAR  = TODAY.getFullYear();
export const MONTH = TODAY.getMonth();

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES  = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Mock Data ────────────────────────────────────────────────────────────────
function makeMockData() {
  const data = {};
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();

  const bleedingDays = { 1: "heavy", 2: "heavy", 3: "medium", 4: "light", 5: "spotting" };
  const mucusTypes = ["dry", "sticky", "creamy", "watery", "egg-white"];
  const bbtBase = 97.2;

  for (let d = 1; d <= Math.min(TODAY.getDate(), daysInMonth); d++) {
    data[d] = {
      bbt: bleedingDays[d] ? null : parseFloat((bbtBase + Math.random() * 0.8 + (d > 14 ? 0.4 : 0)).toFixed(2)),
      bleeding: bleedingDays[d] || null,
      mucus: bleedingDays[d] ? null : mucusTypes[Math.floor(Math.random() * mucusTypes.length)],
      mucusCharacteristic: ["opaque", "translucent", "clear", "stretchy"][Math.floor(Math.random() * 4)],
      symptoms: d % 3 === 0 ? ["fatigue"] : d % 5 === 0 ? ["headache", "backache"] : [],
      notes: d === 3 ? "Felt very tired today, cramps in the morning." : d === 14 ? "Peak day — noticed stretchy CM." : "",
    };
  }

  return { entries: data, projectedPeriod: [28, 29, 30, 31] };
}

export const MOCK = makeMockData();

// ─── Bleeding ─────────────────────────────────────────────────────────────────
export const bleedingColor = {
  heavy:    "#C0303F",
  medium:   "#D4788A",
  light:    "#E8A8B4",
  spotting: "#F2D0D5",
};

export const bleedingLabel = {
  heavy: "Heavy", medium: "Medium", light: "Light", spotting: "Spotting",
};

// ─── Edit View Options ────────────────────────────────────────────────────────
export const SYMPTOM_OPTIONS = [
  { key: "headache", emoji: "🤕", label: "Headache" },
  { key: "backache", emoji: "🪑", label: "Backache" },
  { key: "fatigue",  emoji: "😴", label: "Fatigue" },
  { key: "mood",     emoji: "😌", label: "Mood Changes" },
];

export const MUCUS_OPTIONS = ["dry", "sticky", "creamy", "watery", "egg-white"];
export const MUCUS_CHAR    = ["opaque", "translucent", "clear", "stretchy"];
export const BLEEDING_OPT  = ["none", "spotting", "light", "medium", "heavy"];

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const inputStyle = {
  border: "1.5px solid var(--gold-light)", borderRadius: 10, padding: "12px 16px",
  fontSize: 14, fontFamily: "Lato, sans-serif", background: "var(--cream)",
  color: "var(--text)", outline: "none", width: "100%",
};

export const btnPrimaryStyle = {
  background: "linear-gradient(135deg, var(--rose-deep), var(--burgundy))",
  color: "white", border: "none", borderRadius: 10, padding: "13px",
  fontSize: 14, fontFamily: "Lato, sans-serif", fontWeight: 700,
  cursor: "pointer", letterSpacing: 1, marginTop: 4,
};

export const bioCard = {
  flex: 1, background: "var(--parchment)", borderRadius: 10, padding: "10px 10px 8px",
  display: "flex", flexDirection: "column", gap: 4,
};
export const bioLabel = { fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" };
export const bioValue = { fontSize: 14, fontWeight: 700, color: "var(--text)" };
