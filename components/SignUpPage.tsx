import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { UserRole } from "../types";
import { signUp } from "../services/authService"; // Menggunakan layanan auth baru
import { FirebaseError } from "firebase/app";

interface SignUpPageProps {
  onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchToLogin }) => {
  const [role, setRole] = useState<UserRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (role === "student" && !email.endsWith("@student.unsri.ac.id")) {
      setError(
        "Harap gunakan email mahasiswa Unsri yang valid (@student.unsri.ac.id)."
      );
      return;
    }
    if (!fullName.trim()) {
      setError("Nama Lengkap tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, fullName, role);
      setSuccess("Pendaftaran berhasil! Anda akan diarahkan ke halaman login.");
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          setError(
            "Email ini sudah terdaftar. Silakan gunakan email lain atau login."
          );
        } else if (err.code === "auth/weak-password") {
          setError("Password terlalu lemah. Harap gunakan minimal 6 karakter.");
        } else {
          setError("Terjadi kesalahan saat pendaftaran. Silakan coba lagi.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    // Reset all fields
    setError("");
    setSuccess("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const commonInputClasses =
    "w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";

  return (
    <div className="flex items-center justify-center min-h-full p-4 overflow-y-auto">
      <div className="w-full max-w-md p-8 my-auto space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary dark:bg-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-11 h-11 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 3L22 8L12 13L2 8L12 3Z" />
                <path d="M4 11.5V15.5C4 15.7761 4.22386 16 4.5 16H19.5C19.7761 16 20 15.7761 20 15.5V11.5L12 15L4 11.5Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-accent">
            Universitas Sriwijaya
          </h1>
          <h2 className="text-5xl font-extrabold text-primary shadow-md shadow-white">
            LKA-SK
          </h2>
          <p className="pt-4 text-sm text-gray-600 dark:text-gray-400">
            Buat akun baru untuk memulai.
          </p>
        </div>

        <div className="flex justify-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => handleRoleChange("student")}
            disabled={isLoading || !!success}
            className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              role === "student"
                ? "bg-white dark:bg-gray-900 text-primary dark:text-blue-300 shadow"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Mahasiswa
          </button>
          <button
            onClick={() => handleRoleChange("lecturer")}
            disabled={isLoading || !!success}
            className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              role === "lecturer"
                ? "bg-white dark:bg-gray-900 text-primary dark:text-blue-300 shadow"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Dosen
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div
              className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/[0.2] dark:text-red-300 dark:border-red-500/30"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="p-3 text-sm text-center text-green-800 bg-green-100 border border-green-200 rounded-lg dark:bg-green-900/[0.2] dark:text-green-300 dark:border-green-500/30"
              role="alert"
            >
              {success}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama Lengkap"
              className={commonInputClasses}
              required
              disabled={isLoading}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === "student"
                  ? "Email Institusi (@student.unsri.ac.id)"
                  : "Email"
              }
              className={commonInputClasses}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 karakter)"
              className={commonInputClasses}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Password"
              className={commonInputClasses}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !!success}
              className="flex items-center justify-center w-full px-4 py-2 mt-2 font-semibold text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-blue-300 dark:disabled:bg-blue-900 transition-colors duration-300"
            >
              {isLoading ? <LoadingSpinner /> : "Daftar"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-primary hover:underline dark:text-blue-400 focus:outline-none"
              disabled={isLoading}
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
