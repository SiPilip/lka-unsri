import React, { useState, useRef, useEffect } from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleThemeChange = (themeName: keyof typeof themes) => {
    setTheme(themeName);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="p-2 rounded-full text-primary hover:bg-black/10 transition-colors" aria-label="Ganti tema">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5a1.5 1.5 0 011.06.44l3.536 3.535a1.5 1.5 0 010 2.122L5.56 18.632A1.5 1.5 0 014.5 17.57V5A1.5 1.5 0 015.56.439l3.536 3.536A1.5 1.5 0 0110 3.5z" />
            <path d="M12.5 3a1.5 1.5 0 011.06.44l3.536 3.535a1.5 1.5 0 010 2.122l-4.596 4.596a1.5 1.5 0 01-2.121 0L9.313 12.63a1.5 1.5 0 010-2.121L11.434 8.44A1.5 1.5 0 0112.5 3z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-20">
          <div className="p-3 font-semibold text-sm border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
            Pilih Tema
          </div>
          <ul className="py-1">
            {Object.values(themes).map((t) => (
              <li key={t.name}>
                <button
                  onClick={() => handleThemeChange(t.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left ${
                    theme === t.name
                      ? 'bg-gray-100 dark:bg-gray-700 font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="capitalize">{t.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.primary }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.accent }}></div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
