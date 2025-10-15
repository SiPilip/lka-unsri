import React from 'react';

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="relative flex items-center justify-between p-4 bg-accent">
        <div className="flex items-center gap-4">
          {onBack && (
            <div className="flex items-center gap-1">
                <button onClick={onBack} className="p-2 rounded-full text-primary hover:bg-black/10 transition-colors" aria-label="Kembali">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button onClick={onBack} className="p-2 rounded-full text-primary hover:bg-black/10 transition-colors" aria-label="Halaman Utama">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/id/thumb/c/c2/Lambang_Universitas_Sriwijaya.svg/1200px-Lambang_Universitas_Sriwijaya.svg.png" alt="Logo UNSRI" className="h-10 w-10 object-contain" />
            <div>
                <h1 className="text-xl font-bold text-primary">Konsultasi Akademik AI</h1>
                <p className="text-sm text-gray-700 hidden sm:block">Universitas Sriwijaya</p>
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;