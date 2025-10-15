import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User } from '../types';

const ProfileItem: React.FC<{ label: string; value: string | number; isEditable?: boolean; isEditing?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; inputType?: string }> = 
({ label, value, isEditable = false, isEditing = false, onChange, inputType = 'text' }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
            {isEditable && isEditing ? (
                <input
                    type={inputType}
                    value={value as string}
                    onChange={onChange}
                    className="w-full px-3 py-1 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
                />
            ) : (
                value
            )}
        </dd>
    </div>
);

interface ProfilePageProps {
    user: User;
    allUsers: User[];
    onUpdateUser: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, allUsers, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<User>(user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const lecturers = useMemo(() => allUsers.filter(u => u.role === 'lecturer'), [allUsers]);

    const lecturerName = useMemo(() => {
        if (user.role !== 'student' || !user.dosenPA) {
            return 'N/A';
        }
        const lecturer = lecturers.find(u => u.idNumber === user.dosenPA);
        return lecturer ? lecturer.fullName : 'N/A';
    }, [user, lecturers]);

    useEffect(() => {
        setProfile(user);
    }, [user]);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof User) => {
        setProfile(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("Ukuran file terlalu besar. Maksimal 2MB.");
            return;
        }
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert("Format file tidak didukung. Gunakan JPG, PNG, atau GIF.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setProfile(prev => ({ ...prev, profilePicture: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const toggleEdit = () => {
        if (isEditing) {
            onUpdateUser(profile);
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full">
            <div className="bg-slate-50/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Profil Pengguna</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Detail informasi akademik dan personal.</p>
                    </div>
                    <button
                        onClick={toggleEdit}
                        className="flex items-center px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                        {isEditing ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 12.586l-2.293-2.293z" /></svg>
                                Simpan
                            </>
                        ) : (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                Edit Profil
                            </>
                        )}
                    </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                    <dl>
                        <div className="bg-gray-50/50 dark:bg-gray-900/30 px-4 py-5 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                             <div className="sm:col-span-2 text-center">
                                <div className="relative mx-auto w-24 h-24 mb-2">
                                     {profile.profilePicture ? (
                                        <img src={profile.profilePicture} alt="Foto Profil" className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-800" />
                                    ) : (
                                        <div className="flex-shrink-0 w-24 h-24 rounded-full bg-primary flex items-center justify-center text-text-on-primary text-4xl font-bold ring-4 ring-white dark:ring-gray-800">
                                            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'M'}
                                        </div>
                                    )}
                                    {isEditing && (
                                        <>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/png, image/jpeg, image/gif"
                                                aria-label="Pilih foto profil"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleImageUploadClick}
                                                className="absolute bottom-0 right-0 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                                                aria-label="Ubah foto profil"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-1.707-1.707A2 2 0 0011.121 2H8.879a2 2 0 00-1.414.586L5.586 5H4zm6 8a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                                 {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) => handleFieldChange(e, 'fullName')}
                                        className="text-2xl text-center font-bold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                 ) : (
                                     <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile.fullName}</h2>
                                 )}
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            <ProfileItem 
                                label={user.role === 'student' ? 'NIM' : 'NIP'} 
                                value={profile.idNumber} 
                                isEditable={user.role === 'student'} 
                                isEditing={isEditing}
                                onChange={(e) => handleFieldChange(e, 'idNumber')}
                            />
                             {user.role === 'student' && (
                                <>
                                    <ProfileItem 
                                        label="Program Studi" 
                                        value={profile.programStudi || ''}
                                        isEditable
                                        isEditing={isEditing}
                                        onChange={(e) => handleFieldChange(e, 'programStudi')}
                                    />
                                    <ProfileItem 
                                        label="Tahun Masuk" 
                                        value={profile.tahunMasuk || ''}
                                        isEditable
                                        isEditing={isEditing}
                                        inputType="number"
                                        onChange={(e) => handleFieldChange(e, 'tahunMasuk')}
                                    />
                                     <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dosen Pembimbing Akademik</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                                            {isEditing ? (
                                                <select
                                                    value={profile.dosenPA || ''}
                                                    onChange={(e) => handleFieldChange(e, 'dosenPA')}
                                                    className="w-full px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
                                                >
                                                    <option value="">Belum Ditentukan</option>
                                                    {lecturers.map(lecturer => (
                                                        <option key={lecturer.idNumber} value={lecturer.idNumber}>
                                                            {lecturer.fullName}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                lecturerName
                                            )}
                                        </dd>
                                    </div>
                                </>
                             )}
                             <ProfileItem 
                                label="Nomor HP" 
                                value={profile.nomorHP || ''} 
                                isEditable 
                                isEditing={isEditing}
                                inputType="tel"
                                onChange={(e) => handleFieldChange(e, 'nomorHP')}
                            />
                             <ProfileItem 
                                label="Email Alternatif" 
                                value={profile.emailAlternatif || ''} 
                                isEditable
                                isEditing={isEditing}
                                inputType="email"
                                onChange={(e) => handleFieldChange(e, 'emailAlternatif')}
                            />
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;