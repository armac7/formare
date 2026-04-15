export default function MucusIcon({ type, characteristic, size = 22 }) {
  const icons = {
    dry:         { emoji: "🏜️", label: "Dry" },
    moist:      { emoji: "💧", label: "Moist" },
    wet:      { emoji: "💦", label: "Wet" },
    slippery: { emoji: "🧊", label: "Slippery" },
    "wet/slippery": { emoji: "💦🧊", label: "Wet/Slippery" },
  };
  const ic = icons[type] || { emoji: "—", label: "None" };
  return (
    <span title={`${ic.label}${characteristic ? ` · ${characteristic}` : ""}`} style={{ fontSize: size }}>
      {ic.emoji}
    </span>
  );
}
