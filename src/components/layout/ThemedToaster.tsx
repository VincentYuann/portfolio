import React from 'react';
import { Toaster } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

export const ThemedToaster: React.FC = () => {
  const { theme } = useTheme();

  // Inverse theme: Day page gets Night toast, Night page gets Day toast
  return (
    <Toaster
      position="bottom-left"
      theme={theme === 'night' ? 'light' : 'dark'}
      gap={10}
      offset={24}
      toastOptions={{
        duration: 4000,
        className: 'font-sans text-xs border rounded-xl',
      }}
    />
  );
};
