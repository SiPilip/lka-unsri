import React, { useState, useRef } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { Notification } from '../types';
import ThemeSwitcher from './ThemeSwitcher';

const HomeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ProfileIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ScheduleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const AskIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const HistoryIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>;
const InterestIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.6.11.82-.26.82-.58v-2.14c-2.78.6-3.37-1.34-3.37-1.34-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3 1.23-1.6-2.67-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.47 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.82.58A10 10 0 0 0 22 12 10 10 0 0 0 12 2z" /><circle cx="12" cy="12" r="3" /></svg>;
const NotificationIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const LogoutIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

interface SidebarItemProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    hasBadge?: boolean;
    isActive: boolean;
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(({ onClick, icon, label, hasBadge, isActive }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        className={`w-full flex items-center p-3 text-left rounded-lg transition-colors group ${
            isActive
                ? 'bg-primary text-text-on-primary font-semibold'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
        <div className={`transition-colors ${isActive ? 'text-text-on-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-accent'}`}>{icon}</div>
        <span className="ml-4">{label}</span>
        {hasBadge && <span className="ml-auto w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>}
    </button>
));

type StudentView = 'dashboard' | 'profile' | 'ask' | 'schedule' | 'history' | 'interests';

interface StudentDashboardProps {
    userName: string;
    onNavigate: (target: StudentView) => void;
    onLogout: () => void;
    notifications: Notification[];
    hasUnread: boolean;
    onMarkAsRead: () => void;
    onDeleteNotification: (id: string) => void;
    onClearAllNotifications: () => void;
    activeView: StudentView;
    children: React.ReactNode;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userName, onNavigate, onLogout, notifications, hasUnread, onMarkAsRead, onDeleteNotification, onClearAllNotifications, activeView, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);

    const handleNavigate = (target: StudentView) => {
        onNavigate(target);
        setIsSidebarOpen(false);
    };

    const handleNotificationClick = () => {
        setShowNotifications(prev => !prev);
        if (hasUnread) {
            onMarkAsRead();
        }
    };

    const confirmLogout = () => {
        onLogout();
        setShowLogoutConfirm(false);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-primary dark:text-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3L22 8L12 13L2 8L12 3Z" />
                        <path d="M4 11.5V15.5C4 15.7761 4.22386 16 4.5 16H19.5C19.7761 16 20 15.7761 20 15.5V11.5L12 15L4 11.5Z" />
                    </svg>
                    <span className="font-bold text-gray-800 dark:text-gray-200">Dashboard Mahasiswa</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden" aria-label="Tutup menu">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                <SidebarItem onClick={() => handleNavigate('dashboard')} icon={<HomeIcon />} label="Beranda" isActive={activeView === 'dashboard'}/>
                <SidebarItem onClick={() => handleNavigate('profile')} icon={<ProfileIcon />} label="Profil Mahasiswa" isActive={activeView === 'profile'}/>
                <SidebarItem onClick={() => handleNavigate('schedule')} icon={<ScheduleIcon />} label="Jadwal Konsultasi" isActive={activeView === 'schedule'}/>
                <SidebarItem onClick={() => handleNavigate('ask')} icon={<AskIcon />} label="Tanya Dosen PA" isActive={activeView === 'ask'}/>
                <SidebarItem onClick={() => handleNavigate('history')} icon={<HistoryIcon />} label="Riwayat Konsultasi" isActive={activeView === 'history'}/>
                <SidebarItem onClick={() => handleNavigate('interests')} icon={<InterestIcon />} label="Minat di Jurusan" isActive={activeView === 'interests'}/>
            </nav>
        </div>
    );

    return (
        <div className="flex h-screen bg-content-background dark:bg-gray-900">
             {/* Overlay for mobile sidebar */}
            <div 
                className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`} 
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            />
            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
            >
                <SidebarContent />
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 flex items-center justify-between p-4 bg-accent z-30">
                    <div className="flex items-center gap-3">
                        {activeView !== 'dashboard' ? (
                            <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-full text-primary hover:bg-black/10 transition-colors" aria-label="Kembali">
                               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                        ) : (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-full text-primary hover:bg-black/10 transition-colors md:hidden" aria-label="Buka menu">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        )}

                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-primary">Layanan Konsultasi Akademik</h1>
                            <p className="text-xs text-gray-700">Universitas Sriwijaya</p>
                        </div>
                        <div className="sm:hidden flex items-center">
                            <span className="font-bold text-primary">Konsultasi UNSRI</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <div className="relative">
                            <button ref={notificationButtonRef} onClick={handleNotificationClick} className="relative p-2 rounded-full text-primary hover:bg-black/10 transition-colors" aria-label="Notifikasi">
                                <NotificationIcon />
                                {hasUnread && <span className="absolute top-1 right-1 block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-accent"></span>}
                            </button>
                            {showNotifications && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-slate-50 dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-20 flex flex-col">
                                   <div className="p-3 font-semibold text-sm border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">Notifikasi</div>
                                   <ul className="flex-1 py-1 max-h-64 overflow-y-auto">
                                       {notifications.length > 0 ? (
                                           notifications.map((notif) => (
                                               <li key={notif.id} className="group flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                   <span>{notif.message}</span>
                                                   <button onClick={() => onDeleteNotification(notif.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full" aria-label="Hapus notifikasi">
                                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                   </button>
                                               </li>
                                           ))
                                       ) : (
                                           <li className="px-3 py-2 text-sm text-gray-500">Tidak ada notifikasi baru.</li>
                                       )}
                                   </ul>
                                   {notifications.length > 0 && (
                                       <div className="p-2 border-t dark:border-gray-700">
                                           <button onClick={onClearAllNotifications} className="w-full px-2 py-1 text-xs text-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50">
                                               Hapus Semua
                                           </button>
                                       </div>
                                   )}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setShowLogoutConfirm(true)} className="p-2 rounded-full text-primary hover:bg-black/10 transition-colors" aria-label="Logout">
                            <LogoutIcon />
                        </button>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto bg-background">
                    {children}
                </main>
            </div>
            
            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
                title="Konfirmasi Logout"
                message="Apakah Anda yakin ingin keluar dari akun Anda?"
            />
        </div>
    );
};

export default StudentDashboard;