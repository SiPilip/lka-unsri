import React, { useState, useMemo, useRef } from 'react';
import { User, Question, ScheduleSlot, Notification } from '../types';
import ProfilePage from './ProfilePage';
import ConfirmationModal from './ConfirmationModal';
import ThemeSwitcher from './ThemeSwitcher';

type LecturerView = 'dashboard' | 'questions' | 'schedule' | 'students' | 'profile';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center space-x-4 border-l-4" style={{ borderColor: color }}>
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: `${color}20`, color: color }}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-primary text-text-on-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const AttachmentPreviewModal: React.FC<{
    attachment: Required<Question>['attachment'];
    onClose: () => void;
}> = ({ attachment, onClose }) => {
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = attachment.dataUrl;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderPreview = () => {
        if (attachment.type.startsWith('image/')) {
            return <img src={attachment.dataUrl} alt={attachment.name} className="max-w-full max-h-[60vh] object-contain mx-auto" />;
        }
        if (attachment.type === 'application/pdf') {
            return <embed src={attachment.dataUrl} type="application/pdf" className="w-full h-[70vh]" />;
        }
        // Generic preview for other file types
        return (
            <div className="text-center p-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                <p className="mt-4 font-semibold text-gray-800 dark:text-gray-200">{attachment.name}</p>
                <p className="text-sm text-gray-500">{attachment.type}</p>
                <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Pratinjau tidak tersedia untuk tipe file ini.</p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">{attachment.name}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-2xl font-bold" aria-label="Tutup pratinjau">&times;</button>
                </div>
                <div className="p-4 overflow-y-auto flex-grow">
                    {renderPreview()}
                </div>
                <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Tutup</button>
                    <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Unduh File
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LecturerDashboardProps {
    user: User;
    allUsers: User[];
    questions: Question[];
    schedule: ScheduleSlot[];
    onLogout: () => void;
    onAnswerQuestion: (questionId: string, answerText: string) => void;
    onUpdateUser: (updatedUser: User) => void;
    onAddScheduleSlot: (slot: Omit<ScheduleSlot, 'id' | 'bookedStudents'>) => void;
    onMarkAsCompleted: (slotId: string, studentId: string) => void;
    notifications: Notification[];
    hasUnread: boolean;
    onMarkAsRead: () => void;
    onDeleteNotification: (id: string) => void;
    onClearAllNotifications: () => void;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = (props) => {
    const { user, allUsers, questions, schedule, onLogout, onAnswerQuestion, onUpdateUser, onAddScheduleSlot, onMarkAsCompleted, notifications, hasUnread, onMarkAsRead, onDeleteNotification, onClearAllNotifications } = props;
    const [activeView, setActiveView] = useState<LecturerView>('dashboard');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);
    
    // Memoized data filtering for performance
    const mentoredStudents = useMemo(() => allUsers.filter(u => u.role === 'student' && u.dosenPA === user.idNumber), [allUsers, user.idNumber]);
    const myQuestions = useMemo(() => questions.filter(q => q.lecturerId === user.idNumber), [questions, user.idNumber]);
    const newQuestionsCount = useMemo(() => myQuestions.filter(q => q.status === 'new').length, [myQuestions]);
    const mySchedule = useMemo(() => schedule.filter(s => s.lecturerId === user.idNumber).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [schedule, user.idNumber]);
    const pendingScheduleRequestsCount = useMemo(() => mySchedule.reduce((count, slot) => count + slot.bookedStudents.filter(s => s.status === 'booked').length, 0), [mySchedule]);

    const studentsWithBookings = useMemo(() => {
        const bookedStudentIds = new Set<string>();
        mySchedule.forEach(slot => {
            slot.bookedStudents.forEach(student => {
                bookedStudentIds.add(student.studentId);
            });
        });
        // Now, find the full user objects for these IDs
        return allUsers.filter(u => u.role === 'student' && bookedStudentIds.has(u.idNumber));
    }, [mySchedule, allUsers]);

    const confirmLogout = () => {
        onLogout();
        setShowLogoutConfirm(false);
    };
    
    const handleNotificationClick = () => {
        setShowNotifications(prev => !prev);
        if (hasUnread) {
            onMarkAsRead();
        }
    };

    const renderContent = () => {
        switch(activeView) {
            case 'dashboard': return <SummaryView stats={{ newQuestions: newQuestionsCount, totalBookings: pendingScheduleRequestsCount, totalStudents: studentsWithBookings.length }} user={user} />;
            case 'questions': return <QuestionsView questions={myQuestions} onAnswerQuestion={onAnswerQuestion} />;
            case 'schedule': return <ScheduleView schedule={mySchedule} onAddSlot={onAddScheduleSlot} lecturerId={user.idNumber} onMarkAsCompleted={onMarkAsCompleted} />;
            case 'students': return <StudentsView students={mentoredStudents} />;
            case 'profile': return <div className="h-full"><ProfilePage user={user} onUpdateUser={onUpdateUser} allUsers={allUsers} /></div>;
            default: return null;
        }
    };
    
    const navItems = [
        { id: 'dashboard', label: 'Ringkasan', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
        { id: 'questions', label: 'Kotak Masuk Konsultasi', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.03-3.268A8.965 8.965 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L7 12.586l-1.293-1.293z" clipRule="evenodd" /></svg> },
        { id: 'schedule', label: 'Manajemen Jadwal', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg> },
        { id: 'students', label: 'Mahasiswa Bimbingan', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.558 5.422a.94.94 0 01.013.013l.014.012a4.01 4.01 0 01.624.536 4.008 4.008 0 011.83 2.37.25.25 0 01-.188.32l-3.012.603a.25.25 0 01-.31-.188 4.008 4.008 0 012.457-2.898.938.938 0 01.013-.013zM12.5 8a3 3 0 100-6 3 3 0 000 6zM14 9a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
        { id: 'profile', label: 'Pengaturan Akun', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> },
    ];
    
    const viewTitles: Record<LecturerView, string> = {
        dashboard: 'Ringkasan',
        questions: 'Kotak Masuk Konsultasi',
        schedule: 'Manajemen Jadwal',
        students: 'Mahasiswa Bimbingan',
        profile: 'Pengaturan Akun'
    };
    
    const LogoutIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;


    return (
        <div className="flex flex-col h-screen">
             <header className="flex-shrink-0 flex items-center justify-between p-4 bg-accent z-30">
                <h1 className="text-xl font-bold text-primary">{viewTitles[activeView]}</h1>
                 <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <div className="relative">
                        <button ref={notificationButtonRef} onClick={handleNotificationClick} className="relative p-2 rounded-full text-primary hover:bg-black/10 transition-colors" aria-label="Notifikasi">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            {hasUnread && <span className="absolute top-1 right-1 block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-accent"></span>}
                        </button>
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-slate-50 dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-20 flex flex-col">
                               <div className="p-3 font-semibold text-sm border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">Notifikasi</div>
                               <ul className="flex-1 py-1 max-h-64 overflow-y-auto">
                                   {notifications.length > 0 ? (
                                       notifications.map((notif) => (
                                           <li key={notif.id} className="group flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                               <span className="flex-1">{notif.message}</span>
                                               <button onClick={() => onDeleteNotification(notif.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full flex-shrink-0" aria-label="Hapus notifikasi">
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

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
                    <div className="h-16 flex items-center justify-center gap-3 px-4 border-b dark:border-gray-700">
                        <svg className="w-8 h-8 text-primary dark:text-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3L22 8L12 13L2 8L12 3Z" />
                            <path d="M4 11.5V15.5C4 15.7761 4.22386 16 4.5 16H19.5C19.7761 16 20 15.7761 20 15.5V11.5L12 15L4 11.5Z" />
                        </svg>
                        <span className="font-bold text-gray-800 dark:text-gray-200">Dashboard Dosen</span>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map(item => (
                            <NavItem key={item.id} {...item} isActive={activeView === item.id} onClick={() => setActiveView(item.id as LecturerView)}/>
                        ))}
                    </nav>
                     <div className="p-4 border-t dark:border-gray-700">
                         <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user.fullName}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400">Dosen Pembimbing Akademik</p>
                     </div>
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-content-background dark:bg-gray-900">
                    <div className="p-4 sm:p-6 lg:p-8 h-full">
                         {renderContent()}
                    </div>
                </main>

                <ConfirmationModal
                    isOpen={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={confirmLogout}
                    title="Konfirmasi Logout"
                    message="Apakah Anda yakin ingin logout?"
                />
            </div>
        </div>
    );
};


const SummaryView: React.FC<{ stats: { newQuestions: number, totalBookings: number, totalStudents: number }; user: User }> = ({ stats, user }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <StatCard title="Pertanyaan Baru" value={stats.newQuestions} color="var(--color-accent)" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} />
             <StatCard title="Booking Aktif" value={stats.totalBookings} color="#3B82F6" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
             {/* FIX: Corrected a typo in the xmlns attribute of the SVG element. The original `xmlns="http="http...` was invalid syntax. */}
             <StatCard title="Mahasiswa Bimbingan" value={stats.totalStudents} color="var(--color-primary)" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-primary dark:text-blue-400 mb-4">Dashboard Dosen Pembimbing Akademik</h2>
            <p className="text-gray-600 dark:text-gray-300">
                Gunakan menu di samping untuk mengelola jadwal konsultasi, menjawab pertanyaan dari mahasiswa bimbingan Anda, melihat daftar mahasiswa, dan mengatur profil Anda.
            </p>
        </div>
    </div>
);


const QuestionsView: React.FC<{ questions: Question[], onAnswerQuestion: (id: string, text: string) => void }> = ({ questions, onAnswerQuestion }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [answer, setAnswer] = useState('');
    const [historyExpandedId, setHistoryExpandedId] = useState<string | null>(null);
    const [viewingAttachment, setViewingAttachment] = useState<Question['attachment'] | null>(null);

    const filteredQuestions = useMemo(() => questions.filter(q => q.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || q.title.toLowerCase().includes(searchTerm.toLowerCase())), [questions, searchTerm]);
    const newQuestions = useMemo(() => filteredQuestions.filter(q => q.status === 'new').sort((a, b) => b.submissionTime - a.submissionTime), [filteredQuestions]);
    const answeredQuestions = useMemo(() => filteredQuestions.filter(q => q.status === 'answered').sort((a, b) => b.submissionTime - a.submissionTime), [filteredQuestions]);

    const handleAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuestion || !answer.trim()) return;
        onAnswerQuestion(selectedQuestion.id, answer);
        setAnswer('');
        setSelectedQuestion(null);
    };
    
    const formatTime = (timestamp: number) => new Date(timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const PaperclipIcon: React.FC = () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 10-6 0v4a1 1 0 102 0V7a1 1 0 10-2 0v4a3 3 0 11-6 0V7a5 5 0 0110 0v4a7 7 0 11-14 0V7a5 5 0 015-5z" clipRule="evenodd" />
      </svg>
    );

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-primary dark:text-blue-400">Kotak Masuk Pertanyaan</h2>
                <div className="relative w-full md:w-1/3">
                    <input type="text" placeholder="Cari nama atau judul..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"/>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg></div>
                </div>
            </div>
            {/* New Questions Section */}
            <div className="space-y-4">
                 <h3 className="font-semibold text-lg border-b-2 border-accent pb-2">Pertanyaan Baru</h3>
                 {newQuestions.length > 0 ? newQuestions.map(q => (
                     <div key={q.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-accent">
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                             <div>
                                 <p className="font-bold text-gray-800 dark:text-gray-100 flex items-center">{q.title} {q.attachment && <PaperclipIcon />}</p>
                                 <p className="text-sm text-gray-600 dark:text-gray-300">{q.studentName} ({q.studentId})</p>
                                 <p className="text-xs text-gray-500 mt-1">{formatTime(q.submissionTime)}</p>
                             </div>
                             <button onClick={() => setSelectedQuestion(q)} className="mt-3 sm:mt-0 px-4 py-2 text-sm font-semibold text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark transition-colors self-start sm:self-center">Jawab</button>
                         </div>
                     </div>
                 )) : <p className="text-sm text-gray-500 italic">Tidak ada pertanyaan baru.</p>}
            </div>
            {/* History Section */}
            <div className="mt-8 space-y-4">
                 <h3 className="font-semibold text-lg border-b-2 border-gray-300 dark:border-gray-600 pb-2">Riwayat Konsultasi</h3>
                 {answeredQuestions.length > 0 ? answeredQuestions.map(q => (
                    <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-gray-300 dark:border-gray-600">
                        <div onClick={() => setHistoryExpandedId(historyExpandedId === q.id ? null : q.id)} className="flex justify-between items-center cursor-pointer">
                            <div>
                                <p className="font-semibold flex items-center">{q.title} {q.attachment && <PaperclipIcon />}</p>
                                <p className="text-sm text-gray-500">{q.studentName} ({q.studentId})</p>
                            </div>
                             <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform ${historyExpandedId === q.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                        {historyExpandedId === q.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Pertanyaan:</h4>
                                    <p className="text-sm whitespace-pre-wrap">{q.questionText}</p>
                                </div>
                                {q.attachment && (
                                     <div>
                                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Lampiran:</h4>
                                        <div className="mt-1 p-2 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-between text-sm">
                                            <span>{q.attachment.name} ({(q.attachment.size / 1024).toFixed(2)} KB)</span>
                                             <button onClick={() => q.attachment && setViewingAttachment(q.attachment)} className="px-3 py-1 text-xs font-medium text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark">Lihat</button>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-sm text-primary dark:text-blue-400">Jawaban Anda:</h4>
                                    <p className="text-sm whitespace-pre-wrap">{q.answerText}</p>
                                </div>
                            </div>
                        )}
                    </div>
                 )) : <p className="text-sm text-gray-500 italic">Belum ada riwayat konsultasi.</p>}
            </div>
            {/* Answer Modal */}
            {selectedQuestion && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                         <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center"><h3 className="text-lg font-bold text-primary dark:text-blue-400">{selectedQuestion.title}</h3><button onClick={() => setSelectedQuestion(null)} className="text-2xl font-bold hover:text-red-500">&times;</button></div>
                        <div className="p-5 overflow-y-auto space-y-4">
                            <p className="text-sm text-gray-500">Dari: {selectedQuestion.studentName}</p>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Detail Pertanyaan:</h4>
                                <p className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm whitespace-pre-wrap">{selectedQuestion.questionText}</p>
                            </div>
                            {selectedQuestion.attachment && (
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">Lampiran:</h4>
                                    <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedQuestion.attachment.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedQuestion.attachment.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                        <button onClick={() => selectedQuestion.attachment && setViewingAttachment(selectedQuestion.attachment)} className="px-3 py-1 text-xs font-medium text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark">
                                            Lihat Lampiran
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleAnswerSubmit} className="p-5 border-t dark:border-gray-700">
                            <label htmlFor="answer" className="block text-sm font-semibold mb-2">Tulis Jawaban Anda:</label>
                            <textarea id="answer" value={answer} onChange={e => setAnswer(e.target.value)} rows={5} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none" required></textarea>
                            <div className="mt-4 flex justify-end gap-3"><button type="button" onClick={() => setSelectedQuestion(null)} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Batal</button><button type="submit" className="px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark">Kirim Jawaban</button></div>
                        </form>
                    </div>
                </div>
            )}
             {viewingAttachment && (
                <AttachmentPreviewModal 
                    attachment={viewingAttachment} 
                    onClose={() => setViewingAttachment(null)}
                />
            )}
        </div>
    );
};

const ScheduleView: React.FC<{ 
    schedule: ScheduleSlot[], 
    lecturerId: string, 
    onAddSlot: (slot: Omit<ScheduleSlot, 'id' | 'bookedStudents'>) => void,
    onMarkAsCompleted: (slotId: string, studentId: string) => void;
}> = ({ schedule, lecturerId, onAddSlot, onMarkAsCompleted }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [capacity, setCapacity] = useState<number>(10);

    const handleAddSlot = (e: React.FormEvent) => {
        e.preventDefault();
        if(!date || !time || capacity < 1) return;
        onAddSlot({
            lecturerId,
            date,
            time,
            capacity
        });
        setDate('');
        setTime('');
        setCapacity(10);
    };

    const minDate = new Date().toLocaleDateString('en-CA');
    
    const upcomingSchedule = schedule.filter(s => new Date(`${s.date}T00:00:00`) >= new Date(new Date().setHours(0, 0, 0, 0)));
    
    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-primary dark:text-blue-400 mb-4">Tambah Jadwal Tersedia</h2>
                <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-end">
                    <div className="sm:col-span-1 md:col-span-1"><label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label><input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full p-2 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required min={minDate} /></div>
                    <div className="sm:col-span-1 md:col-span-1"><label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Waktu</label><input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full p-2 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required /></div>
                    <div className="sm:col-span-1 md:col-span-1"><label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kapasitas</label><input type="number" id="capacity" min="1" value={capacity} onChange={e => setCapacity(parseInt(e.target.value))} className="mt-1 w-full p-2 rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required /></div>
                    <button type="submit" className="w-full sm:w-auto md:col-span-1 px-4 py-2 text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark">Tambah</button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-primary dark:text-blue-400 mb-4">Kalender Konsultasi</h2>
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {upcomingSchedule.length > 0 ? upcomingSchedule.map(s => {
                        const isFull = s.bookedStudents.length >= s.capacity;
                        return (
                         <li key={s.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{new Date(s.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {s.time}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                       Terisi: {s.bookedStudents.length}/{s.capacity}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${isFull ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                    {isFull ? 'Penuh' : 'Tersedia'}
                                </span>
                            </div>
                            {s.bookedStudents.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs font-semibold text-gray-500">Mahasiswa terdaftar:</p>
                                    <ul className="text-xs text-gray-500 list-inside space-y-1">
                                        {s.bookedStudents.map(student => (
                                            <li key={student.studentId} className="flex justify-between items-center mt-1">
                                                <span>- {student.studentName}</span>
                                                {student.status === 'booked' ? (
                                                    <button
                                                        onClick={() => onMarkAsCompleted(s.id, student.studentId)}
                                                        className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Tandai Selesai
                                                    </button>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:text-green-200 dark:bg-green-900">
                                                        Selesai
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                         </li>
                        )
                    }): <p className="text-sm text-gray-500 italic">Tidak ada jadwal yang akan datang.</p>}
                </ul>
            </div>
        </div>
    );
}

const StudentDetailModal: React.FC<{ student: User; onClose: () => void }> = ({ student, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Detail Mahasiswa</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-2xl font-bold" aria-label="Tutup">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow space-y-4">
                    <div className="flex items-center gap-4">
                        {student.profilePicture ? (
                            <img src={student.profilePicture} alt="Foto Profil" className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-800" />
                        ) : (
                            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-text-on-primary text-3xl font-bold ring-4 ring-white dark:ring-gray-800">
                                {student.fullName ? student.fullName.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                        <div>
                            <h4 className="text-xl font-bold">{student.fullName}</h4>
                            <p className="text-sm text-gray-500">{student.idNumber}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <dt className="font-medium text-gray-500">Program Studi</dt>
                            <dd className="text-gray-800 dark:text-gray-200">{student.programStudi}</dd>
                            <dt className="font-medium text-gray-500">Tahun Masuk</dt>
                            <dd className="text-gray-800 dark:text-gray-200">{student.tahunMasuk}</dd>
                             <dt className="font-medium text-gray-500">Nomor HP</dt>
                            <dd className="text-gray-800 dark:text-gray-200">{student.nomorHP || '-'}</dd>
                             <dt className="font-medium text-gray-500">Email</dt>
                            <dd className="text-gray-800 dark:text-gray-200">{student.emailAlternatif || '-'}</dd>
                        </dl>
                    </div>
                     <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                         <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Minat Jurusan</h5>
                         {(student.interests && student.interests.length > 0) || student.otherInterest ? (
                             <>
                                {student.interests && student.interests.length > 0 && (
                                     <ul className="list-disc list-inside space-y-1">
                                        {student.interests.map((interest, index) => <li key={index} className="text-sm text-gray-600 dark:text-gray-300">{interest}</li>)}
                                     </ul>
                                )}
                                {student.otherInterest && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-500">Lainnya:</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 pl-2 border-l-2 border-gray-300 dark:border-gray-600">{student.otherInterest}</p>
                                    </div>
                                )}
                             </>
                         ) : (
                            <p className="text-sm text-gray-500 italic">Mahasiswa belum menentukan minat.</p>
                         )}
                     </div>
                </div>
                 <div className="p-4 border-t dark:border-gray-700 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Tutup</button>
                </div>
            </div>
        </div>
    );
};

const StudentsView: React.FC<{ students: User[] }> = ({ students }) => {
    
    const formatInterests = (student: User) => {
        const allInterests = [...(student.interests || [])];
        if (student.otherInterest) {
            allInterests.push(student.otherInterest);
        }
        return allInterests.length > 0 ? allInterests.join(', ') : '-';
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
            <h2 className="text-xl font-bold text-primary dark:text-blue-400 mb-4">Daftar Mahasiswa Bimbingan</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">NIM</th>
                            <th className="px-6 py-3">Program Studi</th>
                            <th className="px-6 py-3">Angkatan</th>
                            <th className="px-6 py-3">Nomor HP</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Minat Jurusan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s.idNumber} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{s.fullName}</td>
                                <td className="px-6 py-4">{s.idNumber}</td>
                                <td className="px-6 py-4">{s.programStudi}</td>
                                <td className="px-6 py-4">{s.tahunMasuk}</td>
                                <td className="px-6 py-4">{s.nomorHP || '-'}</td>
                                <td className="px-6 py-4">{s.emailAlternatif || '-'}</td>
                                <td className="px-6 py-4">{formatInterests(s)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {students.length === 0 && <p className="text-center p-4 text-gray-500 italic">Daftar ini hanya akan menampilkan mahasiswa setelah mereka memesan jadwal konsultasi.</p>}
            </div>
        </div>
    );
};

export default LecturerDashboard;