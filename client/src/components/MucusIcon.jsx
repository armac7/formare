export default function MucusIcon({ type, characteristic, size = 22 }) {
  const icons = {
    dry:         { emoji: "🏜️", label: "Dry" },
    sticky:      { emoji: "🍯", label: "Sticky" },
    creamy:      { emoji: "🥛", label: "Creamy" },
    watery:      { emoji: "💧", label: "Watery" },
    "egg-white": { emoji: "✨", label: "Egg-white" },
  };
  const ic = icons[type] || { emoji: "—", label: "None" };
  return (
    <span title={`${ic.label}${characteristic ? ` · ${characteristic}` : ""}`} style={{ fontSize: size }}>
      {ic.emoji}
    </span>
  );
}
