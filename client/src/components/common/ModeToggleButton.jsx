import { useMode } from '../../context/ModeContext';
import { Sun, Moon } from 'lucide-react';
import { useColorClasses } from '../../theme/useColorClasses';

export default function ModeToggleButton({ className = '', onClick }) {
  const { mode, toggleMode } = useMode();
  const COLOR_CLASSES = useColorClasses();
  const Icon = mode === 'dark' ? Sun : Moon;
  const label = mode === 'dark' ? 'Light Mode' : 'Dark Mode';
  
  const handleClick = () => {
    toggleMode();
    if(onClick){
      onClick();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full px-4 py-2 text-sm ${COLOR_CLASSES.secondaryBgHover} transition-colors ${className}`}
      aria-label="Toggle Theme"
    >
      <Icon className={`h-4 w-4 mr-2 ${mode === 'dark' ? 'text-yellow-500' : 'text-gray-700'}`} />
      {label}
    </button>
  );
}
