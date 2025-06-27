import { useMode } from "../context/ModeContext";

const THEME_OPTIONS = [
  { key: 'default', label: 'Default', color: '#14b8a6' }, // teal-600
  { key: 'blue', label: 'Blue', color: '#3b82f6' },       // blue-600
  { key: 'green', label: 'Green', color: '#16a34a' },     // green-600
  { key: 'brown', label: 'Brown', color: '#92400e' },     // amber-800
  { key: 'pink', label: 'Pink', color: '#ec4899' },       // pink-600
  { key: 'cyan', label: 'Cyan', color: '#06b6d4' },       // cyan-600
];


export default function ThemePicker() {
  const { theme, setTheme } = useMode();

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {THEME_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          className={`w-8 h-8 rounded-full border-2 focus:outline-none transition-transform transform hover:scale-[1.3] ${theme === opt.key ? 'scale-[1.3]' : 'border-gray-300'}`}
          style={{ backgroundColor: opt.color }}
          onClick={() => setTheme(opt.key)}
          title={opt.label}
        />
      ))}
    </div>
  );
}
