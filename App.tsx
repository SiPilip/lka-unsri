






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







import { User, ScheduleSlot, Question, Notification } from './types';







import { onAuthStateChanged, signOut as signOutUser } from './services/authService';







import { 







    updateUserProfile, 







    onUsersSnapshot, 







    onScheduleSnapshot, 







    addSchedule, 







    bookScheduleSlot, 







    updateStudentStatusInSlot,







    onQuestionsSnapshot,







    addQuestion,







    answerQuestion,







    onNotificationsSnapshot,







    addNotification as addNotificationToDb,







    deleteNotification as deleteNotificationFromDb,







    clearAllNotifications as clearAllNotificationsFromDb,







    markAllNotificationsAsRead as markAllNotificationsAsReadInDb







} from './services/firestoreService';







import LoadingSpinner from './components/LoadingSpinner';















const App: React.FC = () => {







  const [currentUser, setCurrentUser] = useState<User | null>(null);







  const [isLoading, setIsLoading] = useState(true);







  const [authView, setAuthView] = useState<'login' | 'signup'>('login');







  const [view, setView] = useState<'dashboard' | 'profile' | 'ask' | 'schedule' | 'history' | 'interests'>('dashboard');







  







  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);







  const [questions, setQuestions] = useState<Question[]>([]);







  const [notifications, setNotifications] = useState<Notification[]>([]);







  const [allUsers, setAllUsers] = useState<User[]>([]);















  // Listener untuk data global (users, schedule, questions)







  useEffect(() => {







    const unsubscribeAuth = onAuthStateChanged((user) => {







      setCurrentUser(user);







      setIsLoading(false);







    });















    const unsubscribeUsers = onUsersSnapshot((users) => setAllUsers(users));







    const unsubscribeSchedule = onScheduleSnapshot((schedules) => setSchedule(schedules));







    const unsubscribeQuestions = onQuestionsSnapshot((questions) => setQuestions(questions));















    return () => {







      unsubscribeAuth();







      unsubscribeUsers();







      unsubscribeSchedule();







      unsubscribeQuestions();







    };







  }, []);















  // Listener untuk data spesifik pengguna (notifikasi)







  useEffect(() => {







    if (currentUser) {







      const unsubscribeNotifications = onNotificationsSnapshot(currentUser.idNumber, (notifs) => {







        setNotifications(notifs);







      });







      return () => unsubscribeNotifications();







    }







  }, [currentUser]);















  const handleUpdateUser = async (updatedUser: User) => {







    if (!currentUser) return;







        try {







            await updateUserProfile(currentUser.uid, updatedUser);







        setCurrentUser(updatedUser);







    } catch (error) {







        console.error("Failed to update user:", error);







    }







  };















  const addNotification = async (recipientId: string, message: string) => {







    const newNotification: Omit<Notification, 'id'> = {







        recipientId,







        message,







        timestamp: Date.now(),







        isRead: false,







    };







    try {







        await addNotificationToDb(newNotification);







    } catch (error) {







        console.error("Failed to add notification:", error);







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















  const handleAskQuestion = async (question: Omit<Question, 'id' | 'submissionTime'>) => {







    if(!currentUser) return;







    try {







        await addQuestion({ ...question, submissionTime: Date.now() });







        addNotification(currentUser.idNumber, `Pertanyaan "${question.title}" telah terkirim.`);







        addNotification(question.lecturerId, `Pertanyaan baru dari ${currentUser.fullName}.`);







        setView('history');







    } catch (error) {







        console.error("Failed to ask question:", error);







    }







  };















  const handleBookSlot = async (slotId: string) => {







    if (!currentUser) return;







    try {







        await bookScheduleSlot(slotId, { studentId: currentUser.idNumber, studentName: currentUser.fullName });







        const bookedSlotInfo = schedule.find(s => s.id === slotId);







        if (bookedSlotInfo) {







            addNotification(currentUser.idNumber, `Anda berhasil memesan jadwal pada ${bookedSlotInfo.date} jam ${bookedSlotInfo.time}.`);







            addNotification(bookedSlotInfo.lecturerId, `${currentUser.fullName} telah memesan jadwal Anda.`);







        }







    } catch (error) {







        console.error("Booking failed:", error);







        alert(error);







    }







  };







  







  const handleAddScheduleSlot = async (slot: Omit<ScheduleSlot, 'id' | 'bookedStudents'>) => {







      try {







        await addSchedule(slot);







        const studentsToNotify = allUsers.filter(u => u.role === 'student' && u.dosenPA === slot.lecturerId);







        studentsToNotify.forEach(student => {







            addNotification(student.idNumber, `Dosen PA Anda menambahkan jadwal baru pada ${slot.date} jam ${slot.time}.`);







        });







      } catch (error) {







          console.error("Failed to add schedule:", error);







      }







  };







  







  const handleAnswerQuestion = async (questionId: string, answerText: string) => {







    try {







        await answerQuestion(questionId, answerText);







        const answeredQuestion = questions.find(q => q.id === questionId);







        if (answeredQuestion) {







            addNotification(answeredQuestion.studentId, `Pertanyaan "${answeredQuestion.title}" telah dijawab.`);







        }







    } catch (error) {







        console.error("Failed to answer question:", error);







    }







  };







  







  const handleMarkAsCompleted = async (slotId: string, studentId: string) => {







    try {







        await updateStudentStatusInSlot(slotId, studentId, 'completed');







        const targetSlot = schedule.find(s => s.id === slotId);







        if (targetSlot) {







             addNotification(







                studentId,







                `Konsultasi pada ${targetSlot.date} jam ${targetSlot.time} telah selesai.`







            );







        }







    } catch (error) {







        console.error("Failed to mark as completed:", error);







    }







};















  const handleLogout = async () => {







    try {







        await signOutUser();







    } catch (error) {







        console.error("Logout error:", error);







    }







  };















  const handleMarkNotificationsAsRead = async () => {







    if (!currentUser) return;







    try {







        await markAllNotificationsAsReadInDb(currentUser.idNumber);







    } catch (error) {







        console.error("Failed to mark notifications as read:", error);







    }







  };















  const handleDeleteNotification = async (id: string) => {







    try {







        await deleteNotificationFromDb(id);







    } catch (error) {







        console.error("Failed to delete notification:", error);







    }







  };







  







  const handleClearAllNotifications = async () => {







     if (!currentUser) return;







     try {







        await clearAllNotificationsFromDb(currentUser.idNumber);







    } catch (error) {







        console.error("Failed to clear notifications:", error);







    }







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




