
import { db } from './firebaseService';
import { doc, setDoc, getDoc, updateDoc, collection, onSnapshot, addDoc, runTransaction, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { User, ScheduleSlot, BookedStudent, Question } from '../types';

// ... (fungsi user dan schedule yang sudah ada)

// --- Fungsi untuk Pertanyaan (Questions) ---

/**
 * Listener untuk mendapatkan semua data pertanyaan secara real-time.
 * @param callback Fungsi yang akan menerima array data pertanyaan.
 * @returns Unsubscribe function.
 */
export const onQuestionsSnapshot = (callback: (questions: Question[]) => void) => {
    const questionsCollectionRef = collection(db, 'questions');
    const q = query(questionsCollectionRef, orderBy('submissionTime', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const questionsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Question));
        callback(questionsList);
    });
};

/**
 * Menambahkan pertanyaan baru dari mahasiswa.
 * @param questionData Data pertanyaan baru.
 */
export const addQuestion = (questionData: Omit<Question, 'id'>) => {
    const questionsCollectionRef = collection(db, 'questions');
    return addDoc(questionsCollectionRef, questionData);
};

/**
 * Menjawab sebuah pertanyaan oleh dosen.
 * @param questionId ID dari pertanyaan yang akan dijawab.
 * @param answerText Teks jawaban dari dosen.
 */
export const answerQuestion = (questionId: string, answerText: string) => {
    const questionDocRef = doc(db, 'questions', questionId);
    return updateDoc(questionDocRef, {
        answerText: answerText,
        status: 'answered',
    });
};

/**
 * Membuat profil pengguna baru di koleksi 'users' setelah registrasi berhasil.
 * @param userId - UID dari Firebase Authentication.
 * @param data - Data pengguna yang akan disimpan (misal: fullName, email, role).
 */
export const createUserProfile = async (userId: string, data: Omit<User, 'idNumber' | 'password'>) => {
    try {
        await setDoc(doc(db, 'users', userId), data);
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw new Error('Gagal membuat profil pengguna.');
    }
};

/**
 * Mengambil data profil pengguna dari Firestore.
 * @param userId - UID pengguna.
 * @returns Data profil pengguna.
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return { idNumber: userDocSnap.id, ...userDocSnap.data() } as User;
    } else {
        console.log("No such user profile!");
        return null;
    }
};

/**
 * Memperbarui data profil pengguna di Firestore.
 * @param userId - UID pengguna.
 * @param data - Data yang akan diperbarui.
 */
export const updateUserProfile = async (userId: string, data: Partial<User>) => {
    const userDocRef = doc(db, 'users', userId);
    try {
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user profile: ", error);
        throw new Error('Gagal memperbarui profil pengguna.');
    }
};

/**
 * Listener untuk mendapatkan semua data pengguna secara real-time.
 * @param callback - Fungsi yang akan menerima array data pengguna.
 * @returns Unsubscribe function.
 */
export const onUsersSnapshot = (callback: (users: User[]) => void) => {
    const usersCollectionRef = collection(db, 'users');
    return onSnapshot(usersCollectionRef, (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({
            idNumber: doc.id,
            ...doc.data(),
        } as User));
        callback(usersList);
    });
};

// --- Fungsi untuk Jadwal (Schedule) ---

/**
 * Listener untuk mendapatkan semua data jadwal secara real-time.
 * @param callback Fungsi yang akan menerima array data jadwal.
 * @returns Unsubscribe function.
 */
export const onScheduleSnapshot = (callback: (schedule: ScheduleSlot[]) => void) => {
    const scheduleCollectionRef = collection(db, 'schedule');
    return onSnapshot(scheduleCollectionRef, (snapshot) => {
        const scheduleList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as ScheduleSlot));
        // Urutkan berdasarkan tanggal
        scheduleList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        callback(scheduleList);
    });
};

/**
 * Menambahkan slot jadwal baru oleh dosen.
 * @param slotData Data jadwal baru.
 */
export const addSchedule = (slotData: Omit<ScheduleSlot, 'id' | 'bookedStudents'>) => {
    const scheduleCollectionRef = collection(db, 'schedule');
    return addDoc(scheduleCollectionRef, {
        ...slotData,
        bookedStudents: [],
        createdAt: serverTimestamp(),
    });
};

/**
 * Mem-booking slot jadwal oleh mahasiswa menggunakan transaksi.
 * @param slotId ID dari jadwal yang akan di-booking.
 * @param student Data mahasiswa yang melakukan booking.
 */
export const bookScheduleSlot = async (slotId: string, student: { studentId: string; studentName: string; }) => {
    const slotDocRef = doc(db, 'schedule', slotId);
    try {
        await runTransaction(db, async (transaction) => {
            const slotDoc = await transaction.get(slotDocRef);
            if (!slotDoc.exists()) {
                throw "Jadwal tidak ditemukan!";
            }

            const currentData = slotDoc.data() as ScheduleSlot;
            const alreadyBooked = currentData.bookedStudents.some(s => s.studentId === student.studentId);
            if (alreadyBooked) {
                throw "Anda sudah mem-booking jadwal ini.";
            }

            if (currentData.bookedStudents.length >= currentData.capacity) {
                throw "Kapasitas jadwal sudah penuh.";
            }

            const newBooking: BookedStudent = { ...student, status: 'booked' };
            const newBookedStudents = [...currentData.bookedStudents, newBooking];
            
            transaction.update(slotDocRef, { bookedStudents: newBookedStudents });
        });
    } catch (e) {
        console.error("Booking transaction failed: ", e);
        throw e; // Lemparkan error untuk ditangani UI
    }
};

/**
 * Memperbarui status mahasiswa dalam sebuah slot jadwal (misal: menandai selesai).
 * @param slotId ID dari jadwal.
 * @param studentId ID dari mahasiswa.
 * @param status Status baru.
 */
export const updateStudentStatusInSlot = async (slotId: string, studentId: string, status: 'booked' | 'completed') => {
    const slotDocRef = doc(db, 'schedule', slotId);
    try {
        await runTransaction(db, async (transaction) => {
            const slotDoc = await transaction.get(slotDocRef);
            if (!slotDoc.exists()) {
                throw "Jadwal tidak ditemukan!";
            }

            const currentData = slotDoc.data() as ScheduleSlot;
            const updatedBookedStudents = currentData.bookedStudents.map(student => {
                if (student.studentId === studentId) {
                    return { ...student, status };
                }
                return student;
            });

            transaction.update(slotDocRef, { bookedStudents: updatedBookedStudents });
        });
    } catch (e) {
        console.error("Update status transaction failed: ", e);
        throw e;
    }
};
