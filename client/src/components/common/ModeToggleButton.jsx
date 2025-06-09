import { useMode } from '../../context/ModeContext';
import { Sun, Moon } from 'lucide-react';

export default function ModeToggleButton({ className = '' }) {
  const { mode, toggleMode } = useMode();

  return (
    <button
      onClick={toggleMode}
      className={`p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-200 ${className}`}
      aria-label="Toggle Theme"
    >
      {mode === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-700" />}
    </button>
  );
}
