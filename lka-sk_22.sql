-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 13 Okt 2025 pada 11.15
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbbimbingan pa`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `lka-sk'22`
--

CREATE TABLE `lka-sk'22` (
  `Nama Mahasiswa` varchar(100) NOT NULL,
  `NIM` varchar(15) NOT NULL,
  `Dosen Pembimbing Akademik` varchar(100) NOT NULL,
  `NIP Pembimbing Akademik` varchar(20) NOT NULL,
  `Program Studi` varchar(50) NOT NULL,
  `Tahun Masuk` year(4) NOT NULL,
  `Email` varchar(200) NOT NULL,
  `Email Institusi Daftar` varchar(50) NOT NULL,
  `Password Mahasiswa Daftar` varchar(10) NOT NULL,
  `Konfirmasi Password Mahasiswa Daftar` varchar(10) NOT NULL,
  `Nama Lengkap Dosen Daftar` varchar(50) NOT NULL,
  `Password Dosen Daftar` varchar(50) NOT NULL,
  `Konfirmasi Password Dosen Daftar` varchar(50) NOT NULL,
  `Email Student Login` varchar(50) NOT NULL,
  `Password Login Mahasiswa` varchar(50) NOT NULL,
  `Nama Lengkap Dosen Login` varchar(50) NOT NULL,
  `Password Dosen Login` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `lka-sk'22`
--

INSERT INTO `lka-sk'22` (`Nama Mahasiswa`, `NIM`, `Dosen Pembimbing Akademik`, `NIP Pembimbing Akademik`, `Program Studi`, `Tahun Masuk`, `Email`, `Email Institusi Daftar`, `Password Mahasiswa Daftar`, `Konfirmasi Password Mahasiswa Daftar`, `Nama Lengkap Dosen Daftar`, `Password Dosen Daftar`, `Konfirmasi Password Dosen Daftar`, `Email Student Login`, `Password Login Mahasiswa`, `Nama Lengkap Dosen Login`, `Password Dosen Login`) VALUES
('PRATAMA ARJAN RANGKUTI', '09011182227006', 'MUHAMMAD ALIBUCHARI, M.T.', '198803302019031007', 'SISTEM KOMPUTER', '2022', '09011182227006@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('AULIA NASUHA ', '09011182227009', 'MUHAMMAD ALIBUCHARI, M.T. \r\n', '198803302019031007', 'SISTEM KOMPUTER', '2022', '09011182227009@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('PANDU AKBAR MANJARING', '09011182227012', 'PROF.IR.SITI NURMAINI, M.T.PH.D.', '196908021994012001', 'SISTEM KOMPUTER', '2022', '09011182227012@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('TIARA PUTRI AMANDA', '09011182227015', 'PROF.IR.SITI NURMAINI, M.T.PH.D.', '196908021994012001', 'SISTEM KOMPUTER', '2022', '09011182227015@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('NABILA SUCI FEBRIANI', '09011182227018', 'PROF.IR.SITI NURMAINI, M.T.PH.D.', '196908021994012001', 'SISTEM KOMPUTER', '2022', '09011182227018@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('IBNU HIBAN AL BAQHOWI', '09011182227024', 'PROF.DR IR.BAMBANG TUTOKO, M.T.', '19196001121989031002', 'SISTEM KOMPUTER', '2022', '09011182227024@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('MUHTADIN', '09011182227102', 'SUTARNO,S.T., M.T.', '197811012010121003', 'SISTEM KOMPUTER', '2022', '09011182227102@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('BERTI AYUZAHARA', '09011182227120', 'AHMAD HERYANTO, S.KOM, M.T.\r\n', '1987012220150410002', 'SISTEM KOMPUTER', '2022', '09011182227120@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('SIGIT SULISTYO', '09011282227027', 'PROF.DR IR.BAMBANG TUTOKO, M.T.', '19196001121989031002', 'SISTEM KOMPUTER', '2022', '09011282227027@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('FUAD ALMADILA MUHAMAD', '09011282227030', 'PROF.DR IR.BAMBANG TUTOKO, M.T.\r\n', '19196001121989031002', 'SISTEM KOMPUTER', '2022', '09011282227030@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('TSANIATU ZAHRAH AZIZAH', '09011282227033', 'PROF. DR. ERWIN, S.SI, M.SI', '197101291994121001', 'SISTEM KOMPUTER', '2022', '09011282227033@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('FELIANA YUNITA', '09011282227039', 'PROF. DR. ERWIN, S.SI, M.SI', '197101291994121001', 'SISTEM KOMPUTER', '2022', '09011282227039@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('DEZKY PUTRA SATRIO', '09011282227042', 'PROF. DERIS STIAWAN, M.T., PH.D., IPU., ASEAN ENG., CPENT.', '197806172006041002', 'SISTEM KOMPUTER', '2022', '09011282227042@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('EKARATNA ANINDITA', '09011282227045', 'PROF. DERIS STIAWAN, M.T., PH.D., IPU., ASEAN ENG., CPENT.', '197806172006041002', 'SISTEM KOMPUTER', '2022', '09011282227045@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('TASYA HARWANI BARUS ', '09011282227048', 'PROF. DERIS STIAWAN, M.T., PH.D., IPU., ASEAN ENG., CPENT.', '197806172006041002', 'SISTEM KOMPUTER', '2022', '09011282227048@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('REVIDYA APRILLA SANDIVA', '09011282227054', 'DR. FIRDAUS, M.KOM.', '197801212008121003', 'SISTEM KOMPUTER', '2022', '09011282227054@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('MUHAMMAD ALZIDAN PRATAMA', '09011282227057', 'DR. FIRDAUS, M.KOM.', '197801212008121003', 'SISTEM KOMPUTER', '2022', '09011282227057@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('M.NAUVAL PERDANA', '09011282227060', 'AHMAD FALI OKLILAS, M.T.', '197210151999031001', 'SISTEM KOMPUTER', '2022', '09011282227060@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('MUHAMMAD DAFFA MAULANA', '09011282227063', 'AHMAD FALI OKLILAS, M.T.', '197210151999031001', 'SISTEM KOMPUTER', '2022', '09011282227063@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('M.ATHALLAH RAFIF ALDERA', '09011282227066', 'IMAN SALADIN B. AZHAR S.KOM., M.MSI.', '198710222019031008', 'SISTEM KOMPUTER', '2022', '09011282227066@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('NUR RAMADHANI DWI PUTRI', '09011282227069', 'MUHAMMAD ALIBUCHARI, M.T. \r\n', '198803302019031007', 'SISTEM KOMPUTER', '2022', '09011282227069@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('KHAIRUNNISA JUNAIDI', '09011282227072', 'MUHAMMAD ALIBUCHARI, M.T. \r\n', '198803302019031007', 'SISTEM KOMPUTER ', '2022', '09011282227072@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('SYAFAAT MUHAMMAD BAHRIL HUDA', '09011282227075', 'ADITYA PUTRA PERDANA P, S.KOM., M.T.', '198810202023211018', 'SISTEM KOMPUTER', '2022', '09011282227075@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('IREN VERONIKA SIRAIT', '09011282227078', 'DR. IR. SUKEMI, M.T.\r\n', '196612032006041001', 'SISTEM KOMPUTER', '2022', '09011282227078@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('SANVIC DICAPRIO', '09011282227081', 'DR. IR. SUKEMI, M.T.\r\n', '196612032006041001', 'SISTEM KOMPUTER', '2022', '09011282227081@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('MUHAMMAD ZIHNI ATHALLAH', '09011282227084', ' DR. IR. SUKEMI, M.T.', '196612032006041001', 'SISTEM KOMPUTER', '2022', '09011282227084@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('RIZKY RAMADHAN', '09011282227087', 'DR. ROSSI PASSARELA, M.ENG.', '197806112010121004', 'SISTEM KOMPUTER', '2022', '09011282227087@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('ALMIRAH CALLYSTA AURELIE', '09011282227090', 'DR. ROSSI PASSARELA, M.ENG.', '197806112010121004', 'SISTEM KOMPUTER', '2022', '09011282227090@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('MUHAMMAD RIZKI FEBIAN', '09011282227093', 'DR. ROSSI PASSARELA, M.ENG.', '197806112010121004', 'SISTEM KOMPUTER', '2022', '09011282227093@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('NANDA AUSIL JANNATI', '09011282227096', 'SUTARNO, S.T,. M.T.', '197811012010121003', 'SISTEM KOMPUTER', '2022', '09011282227096@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('SISKIA ISRAWANA', '09011282227099', 'SUTARNO, S.T,. M.T.', '197811012010121003', 'SISTEM KOMPUTER', '2022', '09011282227099@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('ZAHRA MAHARANI PUTRI', '09011282227105', 'SARMAYANTA SEMBIRING, M.T.', '1978012720232111006', 'SISTEM KOMPUTER', '2022', '09011282227105@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('FAKHRI NAUFAL DHAIFULLAH', '09011282227108', 'ABDURAHMAN, S. KOM., M. HAN.', '199410222024211018', 'SISTEM KOMPUTER', '2022', '09011282227108@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('DIKI RISKIYANTO', '09011282227111', 'ABDURAHMAN, S. KOM., M. HAN.', '199410222024211018', 'SISTEM KOMPUTER', '0000', '09011282227111@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('ALAMSYAH PUTRA ', '09011282227114', 'AHMAD HERYANTO, S.KOM, M.T.\r\n', '1987012220150410002', 'SISTEM KOMPUTER', '2022', '09011282227114@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('RAIHAN PUTRA ERSANANDA', '09011282227117', 'AHMAD HERYANTO, S.KOM, M.T.\r\n', '1987012220150410002', 'SISTEM KOMPUTER', '2022', '09011282227117@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0'),
('DAZAKI ARYO AL-IKRAM', '09011282227125', 'PROF.DR IR.BAMBANG TUTOKO, M.T.\r\n', '19196001121989031002', 'SISTEM KOMPUTER', '2022', '09011282227125@student.unsri.ac.id', '', '', '', '', '', '', '0', '0', '0', '0');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
