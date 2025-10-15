import { db } from './firebaseService';
import { 
    doc, setDoc, getDoc, updateDoc, collection, onSnapshot, 
    addDoc, runTransaction, serverTimestamp, query, orderBy, 
    where, writeBatch, deleteDoc, getDocs
} from 'firebase/firestore';
import { User, ScheduleSlot, BookedStudent, Question, Notification } from '../types';

// --- Fungsi untuk Pengguna (Users) ---

export const createUserProfile = async (userId: string, data: Omit<User, 'uid' | 'password'>) => {
    try {
        await setDoc(doc(db, 'users', userId), data);
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw new Error('Gagal membuat profil pengguna.');
    }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        return { uid: userDocSnap.id, ...userDocSnap.data() } as User;
    } else {
        return null;
    }
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
    const userDocRef = doc(db, 'users', userId);
    try {
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user profile: ", error);
        throw new Error('Gagal memperbarui profil pengguna.');
    }
};

export const onUsersSnapshot = (callback: (users: User[]) => void) => {
    const usersCollectionRef = collection(db, 'users');
    return onSnapshot(usersCollectionRef, (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
        callback(usersList);
    });
};

// --- Fungsi untuk Jadwal (Schedule) ---

export const onScheduleSnapshot = (callback: (schedule: ScheduleSlot[]) => void) => {
    const scheduleCollectionRef = collection(db, 'schedule');
    const q = query(scheduleCollectionRef, orderBy('date', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const scheduleList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleSlot));
        callback(scheduleList);
    });
};

export const addSchedule = (slotData: Omit<ScheduleSlot, 'id' | 'bookedStudents'>) => {
    const scheduleCollectionRef = collection(db, 'schedule');
    return addDoc(scheduleCollectionRef, {
        ...slotData,
        bookedStudents: [],
        createdAt: serverTimestamp(),
    });
};

export const bookScheduleSlot = async (slotId: string, student: { studentId: string; studentName: string; }) => {
    const slotDocRef = doc(db, 'schedule', slotId);
    try {
        await runTransaction(db, async (transaction) => {
            const slotDoc = await transaction.get(slotDocRef);
            if (!slotDoc.exists()) throw "Jadwal tidak ditemukan!";

            const currentData = slotDoc.data() as ScheduleSlot;
            if (currentData.bookedStudents.some(s => s.studentId === student.studentId)) throw "Anda sudah mem-booking jadwal ini.";
            if (currentData.bookedStudents.length >= currentData.capacity) throw "Kapasitas jadwal sudah penuh.";

            const newBooking: BookedStudent = { ...student, status: 'booked' };
            transaction.update(slotDocRef, { bookedStudents: [...currentData.bookedStudents, newBooking] });
        });
    } catch (e) {
        console.error("Booking transaction failed: ", e);
        throw e;
    }
};

export const updateStudentStatusInSlot = async (slotId: string, studentId: string, status: 'booked' | 'completed') => {
    const slotDocRef = doc(db, 'schedule', slotId);
    try {
        await runTransaction(db, async (transaction) => {
            const slotDoc = await transaction.get(slotDocRef);
            if (!slotDoc.exists()) throw "Jadwal tidak ditemukan!";

            const currentData = slotDoc.data() as ScheduleSlot;
            const updatedBookedStudents = currentData.bookedStudents.map(s => s.studentId === studentId ? { ...s, status } : s);
            transaction.update(slotDocRef, { bookedStudents: updatedBookedStudents });
        });
    } catch (e) {
        console.error("Update status transaction failed: ", e);
        throw e;
    }
};

// --- Fungsi untuk Pertanyaan (Questions) ---

export const onQuestionsSnapshot = (callback: (questions: Question[]) => void) => {
    const q = query(collection(db, 'questions'), orderBy('submissionTime', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
        callback(list);
    });
};

export const addQuestion = (questionData: Omit<Question, 'id'>) => {
    return addDoc(collection(db, 'questions'), questionData);
};

export const answerQuestion = (questionId: string, answerText: string) => {
    const questionDocRef = doc(db, 'questions', questionId);
    return updateDoc(questionDocRef, {
        answerText: answerText,
        status: 'answered',
    });
};

// --- Fungsi untuk Notifikasi (Notifications) ---

export const onNotificationsSnapshot = (userId: string, callback: (notifications: Notification[]) => void) => {
    const q = query(collection(db, 'notifications'), where('recipientId', '==', userId), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        callback(list);
    });
};

export const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    return addDoc(collection(db, 'notifications'), notificationData);
};

export const deleteNotification = (notificationId: string) => {
    return deleteDoc(doc(db, 'notifications', notificationId));
};

export const markAllNotificationsAsRead = async (userId: string) => {
    const batch = writeBatch(db);
    const q = query(collection(db, 'notifications'), where('recipientId', '==', userId), where('isRead', '==', false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => batch.update(doc.ref, { isRead: true }));
    await batch.commit();
};

export const clearAllNotifications = async (userId: string) => {
    const batch = writeBatch(db);
    const q = query(collection(db, 'notifications'), where('recipientId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
};