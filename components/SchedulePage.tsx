import React, { useState } from 'react';
import { ScheduleSlot, User } from '../types';

interface SchedulePageProps {
    schedule: ScheduleSlot[];
    lecturer?: User;
    allLecturers: User[];
    onBookSlot: (slotId: string) => void;
    currentUser: User;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ schedule, lecturer, allLecturers, onBookSlot, currentUser }) => {
    const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

    const handleBooking = (slotId: string) => {
        onBookSlot(slotId);
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 5000);
    };

    const generateGoogleCalendarLink = (slot: ScheduleSlot) => {
        const slotLecturer = allLecturers.find(l => l.idNumber === slot.lecturerId);
        if (!slotLecturer) return;

        const startDate = new Date(`${slot.date}T${slot.time}:00`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

        const toGoogleISO = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, "");
        };

        const startTime = toGoogleISO(startDate);
        const endTime = toGoogleISO(endDate);

        const title = encodeURIComponent(`Konsultasi Akademik dengan ${slotLecturer.fullName}`);
        const details = encodeURIComponent(`Jadwal konsultasi akademik.\n\nMahasiswa: ${currentUser.fullName}\nDosen: ${slotLecturer.fullName}`);
        
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}`;
        window.open(url, '_blank');
    };
    
    const hasSchedules = schedule.length > 0;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full">
            <div className="bg-slate-50/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        {lecturer ? 'Jadwal Konsultasi Dosen PA' : 'Jadwal Konsultasi Dosen'}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        {lecturer 
                            ? `Dosen PA: ${lecturer.fullName}` 
                            : 'Anda belum memiliki Dosen PA. Silakan pilih jadwal yang tersedia dari dosen di bawah ini.'}
                    </p>
                </div>

                {bookingSuccess && (
                    <div className="m-4 p-4 text-sm text-blue-800 bg-blue-100 border border-blue-200 rounded-lg dark:bg-blue-900/[0.3] dark:text-blue-200 dark:border-blue-500/50" role="alert">
                       Pemesanan jadwal berhasil! Notifikasi telah ditambahkan ke dasbor Anda.
                    </div>
                )}
                
                <div className="p-4 sm:p-6">
                    {hasSchedules ? (
                        <ul className="space-y-4">
                            {schedule.map(slot => {
                                const userBooking = slot.bookedStudents.find(s => s.studentId === currentUser.idNumber);
                                const alreadyBooked = !!userBooking;
                                const isFull = slot.bookedStudents.length >= slot.capacity;
                                const slotLecturer = allLecturers.find(l => l.idNumber === slot.lecturerId);

                                return (
                                    <li
                                        key={slot.id}
                                        className={`p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between transition-colors ${
                                            isFull && !alreadyBooked
                                                ? 'bg-gray-100 dark:bg-gray-700/50' 
                                                : 'bg-slate-100/80 dark:bg-gray-700/80 shadow'
                                        }`}
                                    >
                                        <div className="mb-3 sm:mb-0">
                                            <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(slot.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{slot.time}</p>
                                            {!lecturer && slotLecturer && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dosen: {slotLecturer.fullName}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                                           <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} dark:bg-opacity-30`}>
                                                {slot.bookedStudents.length}/{slot.capacity} terisi
                                           </span>
                                           
                                           {alreadyBooked && userBooking ? (
                                                <div className="flex items-center gap-4">
                                                    {userBooking.status === 'completed' ? (
                                                        <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:text-green-200 dark:bg-green-900">
                                                            Selesai
                                                        </span>
                                                     ) : (
                                                        <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full dark:text-yellow-200 dark:bg-yellow-900">
                                                            Belum Selesai
                                                        </span>
                                                     )}
                                                    <button
                                                        onClick={() => generateGoogleCalendarLink(slot)}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                                                        Kalender
                                                    </button>
                                                </div>
                                           ) : isFull ? (
                                                <p className="text-sm font-medium text-red-600 dark:text-red-400 w-full sm:w-auto text-right">
                                                    Slot Penuh
                                                </p>
                                           ) : (
                                               <button
                                                   onClick={() => handleBooking(slot.id)}
                                                   className="px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors w-full sm:w-auto"
                                               >
                                                   Booking
                                               </button>
                                           )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                         <p className="text-center text-gray-500 dark:text-gray-400 italic">
                            Saat ini belum ada jadwal konsultasi yang tersedia.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;