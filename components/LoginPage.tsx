import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { UserRole } from "../types";
import { signIn } from "../services/authService"; // Menggunakan layanan auth baru
import { FirebaseError } from "firebase/app";

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      // onLoginSuccess tidak lagi diperlukan, karena onAuthStateChanged di App.tsx akan menangani navigasi
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password" ||
          err.code === "auth/invalid-credential"
        ) {
          setError("Email atau password salah. Silakan coba lagi.");
        } else {
          setError("Terjadi kesalahan saat login. Silakan coba lagi nanti.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(
      'Fitur "Lupa Password" sedang dalam pengembangan. Silakan hubungi bagian akademik untuk bantuan.'
    );
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
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
          <h2 className="text-5xl font-extrabold text-primary text-shadow-lg text-shadow-sky-300">
            LKA-SK
          </h2>
          <p className="pt-4 text-sm text-gray-600 dark:text-gray-400">
            Silakan masuk untuk memulai sesi Anda.
          </p>
        </div>

        <div className="flex justify-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => handleRoleChange("student")}
            disabled={isLoading}
            className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 ${
              role === "student"
                ? "bg-white dark:bg-gray-900 text-primary dark:text-blue-300 shadow"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Mahasiswa
          </button>
          <button
            onClick={() => handleRoleChange("lecturer")}
            disabled={isLoading}
            className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 ${
              role === "lecturer"
                ? "bg-white dark:bg-gray-900 text-primary dark:text-blue-300 shadow"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Dosen
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/[0.2] dark:text-red-300 dark:border-red-500/30"
              role="alert"
            >
              {error}
            </div>
          )}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "student"
                    ? "Email (@student.unsri.ac.id)"
                    : "Email Dosen"
                }
                className="w-full px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 pl-10 pr-10 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.303 6.546A10.048 10.048 0 01.458 10c1.274 4.057 5.27 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.27 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <a
              href="#"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:underline dark:text-blue-400"
            >
              Lupa Password?
            </a>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-2 font-semibold text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-blue-300 dark:disabled:bg-blue-900 transition-colors duration-300"
            >
              {isLoading ? <LoadingSpinner /> : "Masuk"}
            </button>
          </div>
        </form>
        <div className="mt-6 text-sm text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="font-semibold text-primary hover:underline dark:text-blue-400 focus:outline-none"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
