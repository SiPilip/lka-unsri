
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import ProfilePage from './components/ProfilePage';
import AskQuestionPage from './components/AskQuestionPage';
import SchedulePage from './components/SchedulePage';
import SignUpPage from './components/SignUpPage';
import HistoryPage from './components/HistoryPage';
import InterestPage from './components/InterestPage';
import Footer from './components/Footer';
import { User, ScheduleSlot, Question, BookedStudent, Notification } from './types';
import { onAuthStateChanged, signOut as signOutUser } from './services/authService';
import { updateUserProfile, onUsersSnapshot } from './services/firestoreService';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading awal
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [view, setView] = useState<'dashboard' | 'profile' | 'ask' | 'schedule' | 'history' | 'interests'>('dashboard');
  
  // State sementara untuk data non-user, akan dimigrasi ke Firestore nanti
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Sekarang diisi dari Firestore

  useEffect(() => {
    // Listener untuk status otentikasi
    const unsubscribeAuth = onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    // Listener untuk semua data pengguna
    const unsubscribeUsers = onUsersSnapshot((users) => {
      setAllUsers(users);
    });

    // Cleanup listeners saat komponen di-unmount
    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, []);

  const handleUpdateUser = async (updatedUser: User) => {
    if (!currentUser) return;
    try {
        await updateUserProfile(currentUser.idNumber, updatedUser);
        setCurrentUser(updatedUser); // Optimistic update
        // Tambahkan notifikasi jika perlu
    } catch (error) {
        console.error("Failed to update user:", error);
        // Tampilkan error ke pengguna jika perlu
    }
  };
  
  const handleUpdateInterests = (interests: string[], otherInterest: string) => {
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, interests, otherInterest };
    handleUpdateUser(updatedUser);
    addNotification(currentUser.idNumber, "Minat jurusan Anda berhasil diperbarui.");
  };

  const navigateTo = (target: 'dashboard' | 'profile' | 'ask' | 'schedule' | 'history' | 'interests') => {
    setView(target);
  }
  
  const addNotification = (recipientId: string, message: string) => {
    const newNotification: Notification = {
        id: Date.now().toString(),
        recipientId,
        message,
        timestamp: Date.now(),
        isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleAskQuestion = (question: Omit<Question, 'id' | 'submissionTime'>) => {
    if(!currentUser) return;
    const newQuestion = { 
      ...question, 
      id: Date.now().toString(), 
      submissionTime: Date.now() 
    };
    setQuestions(prev => [...prev, newQuestion]);
    addNotification(currentUser.idNumber, `Pertanyaan "${question.title}" telah terkirim ke dosen PA.`);
    addNotification(question.lecturerId, `Pertanyaan baru dari ${currentUser.fullName}: "${question.title}"`);
    setView('history');
  };

  const handleBookSlot = (slotId: string) => {
    if (!currentUser) return;

    let bookedSlotInfo: ScheduleSlot | null = null;
    
    setSchedule(prev => prev.map(slot => {
        if (slot.id === slotId) {
            const alreadyBooked = slot.bookedStudents.some(s => s.studentId === currentUser.idNumber);
            if (slot.bookedStudents.length < slot.capacity && !alreadyBooked) {
                const newBooking: BookedStudent = { 
                    studentId: currentUser.idNumber, 
                    studentName: currentUser.fullName,
                    status: 'booked'
                };
                const updatedSlot = { ...slot, bookedStudents: [...slot.bookedStudents, newBooking] };
                bookedSlotInfo = updatedSlot; // Store info for notification
                return updatedSlot;
            }
        }
        return slot;
    }));

    if (bookedSlotInfo) {
        addNotification(currentUser.idNumber, `Anda berhasil memesan jadwal pada ${bookedSlotInfo.date} jam ${bookedSlotInfo.time}.`);
        addNotification(bookedSlotInfo.lecturerId, `${currentUser.fullName} telah memesan jadwal Anda pada ${bookedSlotInfo.date} jam ${bookedSlotInfo.time}.`);
    }
  };
  
  const handleAddScheduleSlot = (slot: Omit<ScheduleSlot, 'id' | 'bookedStudents'>) => {
      const newSlot = { ...slot, id: Date.now().toString(), bookedStudents: [] };
      setSchedule(prev => [...prev, newSlot].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      
      const studentsToNotify = allUsers.filter(u => u.role === 'student' && u.dosenPA === slot.lecturerId);
      studentsToNotify.forEach(student => {
        addNotification(student.idNumber, `Dosen PA Anda menambahkan jadwal baru pada ${newSlot.date} jam ${newSlot.time}.`);
      });
  };
  
  const handleAnswerQuestion = (questionId: string, answerText: string) => {
    let answeredQuestion: Question | undefined;
    setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
            answeredQuestion = { ...q, status: 'answered', answerText };
            return answeredQuestion;
        }
        return q;
    }));
     if (answeredQuestion) {
        addNotification(answeredQuestion.studentId, `Pertanyaan "${answeredQuestion.title}" telah dijawab.`);
    }
  };
  
  const handleMarkAsCompleted = (slotId: string, studentId: string) => {
    let targetSlot: ScheduleSlot | undefined;
    setSchedule(prev => prev.map(slot => {
        if (slot.id === slotId) {
            const updatedSlot = {
                ...slot,
                bookedStudents: slot.bookedStudents.map(student => 
                    student.studentId === studentId 
                        ? { ...student, status: 'completed' as const } 
                        : student
                )
            };
            targetSlot = updatedSlot;
            return updatedSlot;
        }
        return slot;
    }));

    if (targetSlot) {
        addNotification(
            studentId,
            `Konsultasi pada ${targetSlot.date} jam ${targetSlot.time} telah selesai.`
        );
    }
};

  const handleLogout = async () => {
    try {
        await signOutUser();
        // currentUser akan di-set ke null oleh onAuthStateChanged listener
    } catch (error) {
        console.error("Logout error:", error);
    }
  };

  const handleMarkNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => 
        n.recipientId === currentUser.idNumber ? { ...n, isRead: true } : n
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const handleClearAllNotifications = () => {
     if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.recipientId !== currentUser.idNumber));
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background dark:bg-slate-900">
            <LoadingSpinner />
        </div>
    );
  }
  
  if (!currentUser) {
    return (
        <div className="relative flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-background dark:bg-slate-900">
            <main className="relative z-10 flex flex-col flex-grow items-center justify-center">
                {authView === 'login' ? (
                    <LoginPage 
                        onSwitchToSignUp={() => setAuthView('signup')}
                    />
                ) : (
                    <SignUpPage 
                        onSwitchToLogin={() => setAuthView('login')}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
  }

  const renderStudentView = () => {
    const userNotifications = notifications.filter(n => n.recipientId === currentUser.idNumber);
    const hasUnread = userNotifications.some(n => !n.isRead);

    const upcomingAppointments = schedule
        .filter(slot => slot.bookedStudents.some(s => s.studentId === currentUser.idNumber && s.status === 'booked'))
        .filter(slot => new Date(`${slot.date}T00:00:00`) >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 2);

    const recentQuestion = questions
        .filter(q => q.studentId === currentUser.idNumber)
        .sort((a, b) => b.submissionTime - a.submissionTime)[0];


    const pageContent = () => {
        switch(view) {
            case 'profile':
                return <ProfilePage user={currentUser} onUpdateUser={handleUpdateUser} allUsers={allUsers} />;
            case 'ask':
                return <AskQuestionPage user={currentUser} onSubmit={handleAskQuestion} />;
            case 'schedule': {
                const hasDosenPA = !!currentUser.dosenPA;
                const lecturer = hasDosenPA 
                    ? allUsers.find(u => u.idNumber === currentUser.dosenPA) 
                    : undefined;
                
                const schedulesToShow = hasDosenPA 
                    ? schedule.filter(s => s.lecturerId === currentUser.dosenPA)
                    : schedule;

                const allLecturers = allUsers.filter(u => u.role === 'lecturer');

                return (
                    <SchedulePage 
                        schedule={schedulesToShow} 
                        lecturer={lecturer} 
                        allLecturers={allLecturers}
                        onBookSlot={handleBookSlot} 
                        currentUser={currentUser}
                    />
                );
            }
            case 'history':
                return <HistoryPage questions={questions.filter(q => q.studentId === currentUser.idNumber)}/>;
            case 'interests':
                return <InterestPage user={currentUser} onUpdateInterests={handleUpdateInterests} />;
            case 'dashboard':
            default:
                return (
                     <div className="p-4 sm:p-6 lg:p-8 text-white">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-2xl sm:text-3xl font-bold text-accent">Selamat Datang, {currentUser.fullName}!</h1>
                            <p className="mt-2 text-gray-200">
                                Ini adalah dasbor konsultasi akademik Anda. Lihat ringkasan aktivitas Anda di bawah ini.
                            </p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Upcoming Schedule Card */}
                                <div className="bg-slate-50/10 backdrop-blur-sm shadow-lg rounded-xl p-6 flex flex-col">
                                    <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Jadwal Konsultasi Mendatang
                                    </h2>
                                    <div className="flex-grow">
                                        {upcomingAppointments.length > 0 ? (
                                            <ul className="mt-4 space-y-3">
                                                {upcomingAppointments.map(slot => {
                                                    const lecturer = allUsers.find(u => u.idNumber === slot.lecturerId);
                                                    return (
                                                        <li key={slot.id} className="text-sm p-3 bg-white/10 rounded-lg">
                                                            <p className="font-bold">{new Date(slot.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                                            <p>Waktu: {slot.time}</p>
                                                            <p>Dosen: {lecturer?.fullName || 'N/A'}</p>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p className="mt-4 text-sm text-gray-300 italic">Tidak ada jadwal konsultasi yang akan datang.</p>
                                        )}
                                    </div>
                                    <button onClick={() => navigateTo('schedule')} className="mt-4 w-full px-4 py-2 text-sm font-semibold text-text-on-accent bg-accent rounded-lg hover:bg-accent-dark transition-colors">
                                        Lihat Semua Jadwal
                                    </button>
                                </div>

                                {/* Recent Question Card */}
                                <div className="bg-slate-50/10 backdrop-blur-sm shadow-lg rounded-xl p-6 flex flex-col">
                                    <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Status Pertanyaan Terakhir
                                    </h2>
                                    <div className="flex-grow">
                                    {recentQuestion ? (
                                        <div className="mt-4 text-sm p-3 bg-white/10 rounded-lg">
                                            <p className="font-bold truncate">{recentQuestion.title}</p>
                                            <p className="mt-1">Status:
                                                <span className={`ml-2 font-semibold ${recentQuestion.status === 'answered' ? 'text-green-300' : 'text-yellow-300'}`}>
                                                    {recentQuestion.status === 'answered' ? 'Sudah Dijawab' : 'Menunggu Jawaban'}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-sm text-gray-300 italic">Anda belum pernah mengajukan pertanyaan.</p>
                                    )}
                                    </div>
                                    <button onClick={() => navigateTo('history')} className="mt-4 w-full px-4 py-2 text-sm font-semibold text-text-on-accent bg-accent rounded-lg hover:bg-accent-dark transition-colors">
                                        Lihat Riwayat Pertanyaan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <StudentDashboard
            activeView={view}
            userName={currentUser.fullName}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            notifications={userNotifications}
            hasUnread={hasUnread}
            onMarkAsRead={handleMarkNotificationsAsRead}
            onDeleteNotification={handleDeleteNotification}
            onClearAllNotifications={handleClearAllNotifications}
        >
            {pageContent()}
        </StudentDashboard>
    );
  }
  
  const renderLecturerView = () => {
      const userNotifications = notifications.filter(n => n.recipientId === currentUser.idNumber);
      const hasUnread = userNotifications.some(n => !n.isRead);

      return <LecturerDashboard 
        user={currentUser} 
        allUsers={allUsers}
        questions={questions}
        schedule={schedule}
        onLogout={handleLogout}
        onAnswerQuestion={handleAnswerQuestion}
        onUpdateUser={handleUpdateUser}
        onAddScheduleSlot={handleAddScheduleSlot}
        onMarkAsCompleted={handleMarkAsCompleted}
        notifications={userNotifications}
        hasUnread={hasUnread}
        onMarkAsRead={handleMarkNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAllNotifications={handleClearAllNotifications}
      />;
  }

  return (
    <div className="relative flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-background dark:bg-slate-900">
      <div className="relative z-10 flex flex-col flex-grow">
        {currentUser.role === 'student' ? renderStudentView() : renderLecturerView()}
      </div>
      <Footer />
    </div>
  );
};

export default App;