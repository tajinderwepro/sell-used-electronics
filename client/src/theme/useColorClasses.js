import { useContext } from 'react';
import { ModeContext } from '../context/ModeContext';
import { COLOR_CLASSES_LIGHT, COLOR_CLASSES_DARK } from './colors';

export const useColorClasses = () => {
  const { mode } = useContext(ModeContext); 
  return mode === 'dark' ? COLOR_CLASSES_DARK : COLOR_CLASSES_LIGHT;
};
