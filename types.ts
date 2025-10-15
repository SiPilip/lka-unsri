export type UserRole = 'student' | 'lecturer';

export interface User {
  fullName: string;
  idNumber: string; // NIM for student, NIP for lecturer
  password: string;
  role: UserRole;
  profilePicture?: string; // Stores base64 data URL of the profile picture
  programStudi?: string;
  tahunMasuk?: string;
  dosenPA?: string; // Stores the lecturer's idNumber
  nomorHP?: string;
  emailAlternatif?: string;
  interests?: string[];
  otherInterest?: string;
}

// FIX: Add missing Message type
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface BookedStudent {
  studentId: string;
  studentName: string;
  status: 'booked' | 'completed';
}

export interface ScheduleSlot {
  id: string;
  lecturerId: string;
  date: string;
  time: string;
  capacity: number;
  bookedStudents: BookedStudent[];
}

export type QuestionStatus = 'new' | 'answered';

export interface Question {
  id: string;
  studentId: string;
  studentName: string;
  lecturerId: string;
  title: string;
  questionText: string;
  answerText?: string;
  status: QuestionStatus;
  submissionTime: number; // Added to track when the question was submitted
  attachment?: {
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  };
}

export interface Notification {
    id: string;
    recipientId: string;
    message: string;
    timestamp: number;
    isRead: boolean;
}