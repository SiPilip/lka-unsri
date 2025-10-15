import React, { useState, useEffect } from 'react';
import { User } from '../types';

const INTEREST_OPTIONS = [
    "Artificial Intelligence",
    "Jaringan Komputer",
    "Data Science",
    "Rekayasa Perangkat Lunak",
    "Sistem Cerdas",
    "Keamanan Siber",
];

interface InterestPageProps {
    user: User;
    onUpdateInterests: (interests: string[], otherInterest: string) => void;
}

const InterestPage: React.FC<InterestPageProps> = ({ user, onUpdateInterests }) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || []);
    const [otherInterest, setOtherInterest] = useState(user.otherInterest || '');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setSelectedInterests(user.interests || []);
        setOtherInterest(user.otherInterest || '');
    }, [user]);

    const handleCheckboxChange = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(item => item !== interest)
                : [...prev, interest]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateInterests(selectedInterests, otherInterest);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full">
            <div className="bg-slate-50/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Minat di Jurusan</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        Pilih bidang yang Anda minati agar Dosen PA dapat memberikan arahan yang lebih sesuai.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                    <div>
                        <fieldset>
                            <legend className="text-base font-medium text-gray-900 dark:text-gray-100">
                                Pilih Bidang Peminatan (bisa lebih dari satu)
                            </legend>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {INTEREST_OPTIONS.map(interest => (
                                    <div key={interest} className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id={interest}
                                                name="interests"
                                                type="checkbox"
                                                checked={selectedInterests.includes(interest)}
                                                onChange={() => handleCheckboxChange(interest)}
                                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={interest} className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                                {interest}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div>
                        <label htmlFor="other-interest" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Minat Lainnya (Opsional)
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="other-interest"
                                id="other-interest"
                                value={otherInterest}
                                onChange={(e) => setOtherInterest(e.target.value)}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                                placeholder="Contoh: Game Development, UI/UX Design"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end items-center gap-4">
                         {showSuccess && (
                            <div className="text-sm text-green-600 dark:text-green-400">
                                ✓ Berhasil diperbarui!
                            </div>
                        )}
                        <button
                            type="submit"
                            className="flex items-center justify-center px-6 py-2 font-semibold text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-300"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InterestPage;