import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full p-4 text-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm mt-auto border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-[#aaaaaa] [text-shadow:0_0_8px_rgba(170,170,170,0.4)]">
          © 2025 Kibernanera Dev Team SK-UNSRI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;