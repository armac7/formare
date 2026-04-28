// ─── Date Globals ─────────────────────────────────────────────────────────────
export const TODAY = new Date();
export const YEAR  = TODAY.getFullYear();
export const MONTH = TODAY.getMonth();

// console.log(`Today is ${TODAY}, year: ${YEAR}, month: ${MONTH}`);

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES  = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Bleeding ─────────────────────────────────────────────────────────────────
export const bleedingColor = {
  heavy:    "#C0303F",
  medium:   "#D4788A",
  light:    "#E8A8B4",
  spotting: "#F2D0D5",
  brown: "#A0522D",
  none: "#3A2A2A"
};

export const bleedingLabel = {
  heavy: "Heavy", medium: "Medium", light: "Light", spotting: "Spotting", brown: "Brown", none: "None",
};

// ─── Edit View Options ────────────────────────────────────────────────────────
export const SYMPTOM_OPTIONS = [
  
  // Physical symptoms
  { key: "headache", emoji: "🤕", label: "Headache", type: "physical" },
  { key: "backache", emoji: "🪑", label: "Backache", type: "physical" },
  { key: "fatigue", emoji: "😴", label: "Fatigue", type: "physical" },
  { key: "acne", emoji: "🧴", label: "Acne", type: "physical" },
  { key: "bloating", emoji: "🎈", label: "Bloating", type: "physical" },
  { key: "breast_tenderness", emoji: "💢", label: "Breast Tenderness", type: "physical" },
  { key: "cramping", emoji: "⚡", label: "Cramping", type: "physical" },
  { key: "constipation", emoji: "🚫", label: "Constipation", type: "physical" },
  { key: "increased_libido", emoji: "🔥", label: "Increased Libido", type: "physical" },
  { key: "migraine", emoji: "🌩️", label: "Migraine", type: "physical" },
  { key: "nausea", emoji: "🤢", label: "Nausea", type: "physical" },
  { key: "pms", emoji: "📅", label: "PMS", type: "physical" },
  { key: "illness", emoji: "🤒", label: "Illness", type: "physical" },
  { key: "decreased_appetite", emoji: "🍽️", label: "Decreased Appetite", type: "physical" },
  { key: "joint_muscle_pain", emoji: "🦴", label: "Joint/Muscle Pain", type: "physical" },
  { key: "increased_appetite", emoji: "🍔", label: "Increased Appetite", type: "physical" },
  
  // Emotional symptoms
  { key: "anxious", emoji: "😟", label: "Anxious", type: "emotional" },
  { key: "lethargic", emoji: "🫠", label: "Lethargic", type: "emotional" },
  { key: "energetic", emoji: "⚡", label: "Energetic", type: "emotional" },
  { key: "irritable", emoji: "😠", label: "Irritable", type: "emotional" },
  { key: "sad", emoji: "😢", label: "Sad", type: "emotional" },
  { key: "stressed", emoji: "😣", label: "Stressed", type: "emotional" },
  { key: "social_withdrawal", emoji: "🚪", label: "Social Withdrawal", type: "emotional" },
  { key: "mood_swings", emoji: "🎭", label: "Mood Swings", type: "emotional" },
];

export const MUCUS_OPTIONS = ["dry", "moist", "wet", "slippery", "wet/slippery"];
export const MUCUS_CHAR    = ["nothing", "tacky", "stretchy"];
export const BLEEDING_OPT  = ["none", "spotting", "light", "medium", "heavy", "brown"];

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
