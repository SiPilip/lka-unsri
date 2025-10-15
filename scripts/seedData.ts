

// scripts/seedData.ts
/**
 * =========================================================================================
 * SCRIPT UNTUK SEEDING (MEMASUKKAN) DATA AWAL KE FIREBASE
 * =========================================================================================
 * 
 * PERHATIAN:
 * 1. Script ini hanya untuk dijalankan SATU KALI.
 * 2. Pastikan file .env.local di root proyek sudah terisi dengan konfigurasi Firebase Anda.
 * 3. Script ini akan membuat user di Firebase Authentication DAN dokumen di Cloud Firestore.
 * 4. Password default untuk MAHASISWA adalah NIM mereka.
 * 5. Password default untuk DOSEN adalah NIP mereka.
 * 
 * CARA MENJALANKAN:
 * 1. Pastikan Anda sudah menginstal ts-node: `npm install -g ts-node`
 * 2. Dari terminal di root proyek, jalankan perintah: `npx ts-node scripts/seedData.ts`
 * =========================================================================================
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

// Memuat environment variables dari Vite
// Perlu sedikit trik untuk memuatnya di environment Node.js
import { config } from 'dotenv';
config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase Initialized for Seeding...');

// --- DATA DARI SQL YANG SUDAH DI-TRANSFORMASI ---

const lecturersToSeed = [
    { fullName: 'MUHAMMAD ALIBUCHARI, M.T.', nip: '198803302019031007' },
    { fullName: 'PROF.IR.SITI NURMAINI, M.T.PH.D.', nip: '196908021994012001' },
    { fullName: 'PROF.DR IR.BAMBANG TUTOKO, M.T.', nip: '19196001121989031002' },
    { fullName: 'SUTARNO,S.T., M.T.', nip: '197811012010121003' },
    { fullName: 'AHMAD HERYANTO, S.KOM, M.T.', nip: '1987012220150410002' },
    { fullName: 'PROF. DR. ERWIN, S.SI, M.SI', nip: '197101291994121001' },
    { fullName: 'PROF. DERIS STIAWAN, M.T., PH.D., IPU., ASEAN ENG., CPENT.', nip: '197806172006041002' },
    { fullName: 'DR. FIRDAUS, M.KOM.', nip: '197801212008121003' },
    { fullName: 'AHMAD FALI OKLILAS, M.T.', nip: '197210151999031001' },
    { fullName: 'IMAN SALADIN B. AZHAR S.KOM., M.MSI.', nip: '198710222019031008' },
    { fullName: 'ADITYA PUTRA PERDANA P, S.KOM., M.T.', nip: '198810202023211018' },
    { fullName: 'DR. IR. SUKEMI, M.T.', nip: '196612032006041001' },
    { fullName: 'DR. ROSSI PASSARELA, M.ENG.', nip: '197806112010121004' },
    { fullName: 'SARMAYANTA SEMBIRING, M.T.', nip: '1978012720232111006' },
    { fullName: 'ABDURAHMAN, S. KOM., M. HAN.', nip: '199410222024211018' },
];

const studentsToSeed = [
    { fullName: 'PRATAMA ARJAN RANGKUTI', nim: '09011182227006', dosenPANip: '198803302019031007', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227006@student.unsri.ac.id' },
    { fullName: 'AULIA NASUHA', nim: '09011182227009', dosenPANip: '198803302019031007', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227009@student.unsri.ac.id' },
    { fullName: 'PANDU AKBAR MANJARING', nim: '09011182227012', dosenPANip: '196908021994012001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227012@student.unsri.ac.id' },
    { fullName: 'TIARA PUTRI AMANDA', nim: '09011182227015', dosenPANip: '196908021994012001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227015@student.unsri.ac.id' },
    { fullName: 'NABILA SUCI FEBRIANI', nim: '09011182227018', dosenPANip: '196908021994012001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227018@student.unsri.ac.id' },
    { fullName: 'IBNU HIBAN AL BAQHOWI', nim: '09011182227024', dosenPANip: '19196001121989031002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227024@student.unsri.ac.id' },
    { fullName: 'MUHTADIN', nim: '09011182227102', dosenPANip: '197811012010121003', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227102@student.unsri.ac.id' },
    { fullName: 'BERTI AYUZAHARA', nim: '09011182227120', dosenPANip: '1987012220150410002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011182227120@student.unsri.ac.id' },
    { fullName: 'SIGIT SULISTYO', nim: '09011282227027', dosenPANip: '19196001121989031002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227027@student.unsri.ac.id' },
    { fullName: 'FUAD ALMADILA MUHAMAD', nim: '09011282227030', dosenPANip: '19196001121989031002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227030@student.unsri.ac.id' },
    { fullName: 'TSANIATU ZAHRAH AZIZAH', nim: '09011282227033', dosenPANip: '197101291994121001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227033@student.unsri.ac.id' },
    { fullName: 'FELIANA YUNITA', nim: '09011282227039', dosenPANip: '197101291994121001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227039@student.unsri.ac.id' },
    { fullName: 'DEZKY PUTRA SATRIO', nim: '09011282227042', dosenPANip: '197806172006041002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227042@student.unsri.ac.id' },
    { fullName: 'EKARATNA ANINDITA', nim: '09011282227045', dosenPANip: '197806172006041002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227045@student.unsri.ac.id' },
    { fullName: 'TASYA HARWANI BARUS', nim: '09011282227048', dosenPANip: '197806172006041002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227048@student.unsri.ac.id' },
    { fullName: 'REVIDYA APRILLA SANDIVA', nim: '09011282227054', dosenPANip: '197801212008121003', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227054@student.unsri.ac.id' },
    { fullName: 'MUHAMMAD ALZIDAN PRATAMA', nim: '09011282227057', dosenPANip: '197801212008121003', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227057@student.unsri.ac.id' },
    { fullName: 'M.NAUVAL PERDANA', nim: '09011282227060', dosenPANip: '197210151999031001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227060@student.unsri.ac.id' },
    { fullName: 'MUHAMMAD DAFFA MAULANA', nim: '09011282227063', dosenPANip: '197210151999031001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227063@student.unsri.ac.id' },
    { fullName: 'M.ATHALLAH RAFIF ALDERA', nim: '09011282227066', dosenPANip: '198710222019031008', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227066@student.unsri.ac.id' },
    { fullName: 'NUR RAMADHANI DWI PUTRI', nim: '09011282227069', dosenPANip: '198803302019031007', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227069@student.unsri.ac.id' },
    { fullName: 'KHAIRUNNISA JUNAIDI', nim: '09011282227072', dosenPANip: '198803302019031007', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227072@student.unsri.ac.id' },
    { fullName: 'SYAFAAT MUHAMMAD BAHRIL HUDA', nim: '09011282227075', dosenPANip: '198810202023211018', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227075@student.unsri.ac.id' },
    { fullName: 'IREN VERONIKA SIRAIT', nim: '09011282227078', dosenPANip: '196612032006041001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227078@student.unsri.ac.id' },
    { fullName: 'SANVIC DICAPRIO', nim: '09011282227081', dosenPANip: '196612032006041001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227081@student.unsri.ac.id' },
    { fullName: 'MUHAMMAD ZIHNI ATHALLAH', nim: '09011282227084', dosenPANip: '196612032006041001', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227084@student.unsri.ac.id' },
    { fullName: 'RIZKY RAMADHAN', nim: '09011282227087', dosenPANip: '197806112010121004', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227087@student.unsri.ac.id' },
    { fullName: 'ALMIRAH CALLYSTA AURELIE', nim: '09011282227090', dosenPANip: '197806112010121004', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227090@student.unsri.ac.id' },
    { fullName: 'MUHAMMAD RIZKI FEBIAN', nim: '09011282227093', dosenPANip: '197806112010121004', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227093@student.unsri.ac.id' },
    { fullName: 'NANDA AUSIL JANNATI', nim: '09011282227096', dosenPANip: '197811012010121003', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227096@student.unsri.ac.id' },
    { fullName: 'SISKIA ISRAWANA', nim: '09011282227099', dosenPANip: '197811012010121003', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227099@student.unsri.ac.id' },
    { fullName: 'ZAHRA MAHARANI PUTRI', nim: '09011282227105', dosenPANip: '1978012720232111006', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227105@student.unsri.ac.id' },
    { fullName: 'FAKHRI NAUFAL DHAIFULLAH', nim: '09011282227108', dosenPANip: '199410222024211018', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227108@student.unsri.ac.id' },
    { fullName: 'DIKI RISKIYANTO', nim: '09011282227111', dosenPANip: '199410222024211018', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227111@student.unsri.ac.id' },
    { fullName: 'ALAMSYAH PUTRA', nim: '09011282227114', dosenPANip: '1987012220150410002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227114@student.unsri.ac.id' },
    { fullName: 'RAIHAN PUTRA ERSANANDA', nim: '09011282227117', dosenPANip: '1987012220150410002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227117@student.unsri.ac.id' },
    { fullName: 'DAZAKI ARYO AL-IKRAM', nim: '09011282227125', dosenPANip: '19196001121989031002', programStudi: 'SISTEM KOMPUTER', tahunMasuk: '2022', email: '09011282227125@student.unsri.ac.id' },
];

// --- FUNGSI UNTUK SEEDING ---

const seedDatabase = async () => {
    console.log('Starting database seeding...');

    // Seed Dosen
    console.log('\n--- Seeding Lecturers ---');
    for (const lecturer of lecturersToSeed) {
        // Membuat email placeholder untuk dosen
        const email = `${lecturer.fullName.toLowerCase().replace(/[^a-z0-9]/g, '.').split('.').filter(p=>p).slice(0,2).join('.')}@unsri.ac.id`;
        const password = lecturer.nip; // Password default adalah NIP

        try {
            console.log(`Creating auth user for ${lecturer.fullName} (${email})...`);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userProfile = {
                fullName: lecturer.fullName.replace(/\r\n/g, '').trim(),
                idNumber: lecturer.nip,
                role: 'lecturer',
            };

            console.log(`Creating Firestore document for ${lecturer.fullName} with UID ${uid}...`);
            await setDoc(doc(db, "users", uid), userProfile);
            console.log(`✅ Successfully created lecturer: ${lecturer.fullName}`);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.warn(`⚠️ Lecturer with email ${email} already exists. Skipping.`);
            } else {
                console.error(`❌ Failed to create lecturer ${lecturer.fullName}:`, error.message);
            }
        }
    }

    // Seed Mahasiswa
    console.log('\n--- Seeding Students ---');
    for (const student of studentsToSeed) {
        const email = student.email;
        const password = student.nim; // Password default adalah NIM

        try {
            console.log(`Creating auth user for ${student.fullName} (${email})...`);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userProfile = {
                fullName: student.fullName.trim(),
                idNumber: student.nim,
                role: 'student',
                programStudi: student.programStudi.trim(),
                tahunMasuk: student.tahunMasuk,
                dosenPA: student.dosenPANip.trim(), // Simpan NIP dosen PA
            };

            console.log(`Creating Firestore document for ${student.fullName} with UID ${uid}...`);
            await setDoc(doc(db, "users", uid), userProfile);
            console.log(`✅ Successfully created student: ${student.fullName}`);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.warn(`⚠️ Student with email ${email} already exists. Skipping.`);
            } else {
                console.error(`❌ Failed to create student ${student.fullName}:`, error.message);
            }
        }
    }

    console.log('\nDatabase seeding finished!');
};

seedDatabase().catch(console.error);
