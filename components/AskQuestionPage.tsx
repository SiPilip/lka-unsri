


import React, { useState } from 'react';

import { User, Question } from '../types';

import LoadingSpinner from './LoadingSpinner';



interface AskQuestionPageProps {

    user: User;

    onSubmit: (question: Omit<Question, 'id' | 'submissionTime'>) => void;

}



const readFileAsDataURL = (file: File): Promise<string> => {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result as string);

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);

    });

};



const AskQuestionPage: React.FC<AskQuestionPageProps> = ({ user, onSubmit }) => {

    const [title, setTitle] = useState('');

    const [question, setQuestion] = useState('');

    const [attachment, setAttachment] = useState<File | null>(null);

    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {

            if (e.target.files[0].size > 5 * 1024 * 1024) { // 5MB limit

                setError('Ukuran file tidak boleh lebih dari 5MB.');

                e.target.value = '';

                return;

            }

            setAttachment(e.target.files[0]);

            setError('');

        }

    };



    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!title.trim() || !question.trim()) {

            setError('Judul dan Pertanyaan tidak boleh kosong.');

            return;

        }

        if (!user.dosenPA) {

            setError('Anda tidak memiliki Dosen PA yang terdaftar.');

            return;

        }



        setError('');

        setIsLoading(true);



        let attachmentData: Question['attachment'] | undefined = undefined;

        if (attachment) {

            try {

                const dataUrl = await readFileAsDataURL(attachment);

                attachmentData = {

                    name: attachment.name,

                    type: attachment.type,

                    size: attachment.size,

                    dataUrl: dataUrl, // Kembali menggunakan base64 dataUrl

                };

            } catch (err) {

                console.error("Error reading file:", err);

                setError("Gagal memproses file lampiran. Silakan coba lagi.");

                setIsLoading(false);

                return;

            }

        }

        

        const newQuestion: Omit<Question, 'id' | 'submissionTime'> = {

            studentId: user.idNumber,

            studentName: user.fullName,

            lecturerId: user.dosenPA,

            title,

            questionText: question,

            status: 'new',

            attachment: attachmentData,

        };



        await onSubmit(newQuestion);

    };



    return (

        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full">

            <div className="bg-slate-50/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">

                 <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">

                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Tanya Dosen PA</h3>

                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Isi formulir untuk mengirim pertanyaan ke Dosen Pembimbing Akademik Anda.</p>

                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">

                    {error && (

                         <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/[0.2] dark:text-red-300 dark:border-red-500/30" role="alert">

                            {error}

                        </div>

                    )}

                    <div>

                        <label htmlFor="title" className="block text-sm font-medium text-black dark:text-gray-100">

                            Judul Pertanyaan

                        </label>

                        <input

                            type="text"

                            id="title"

                            value={title}

                            onChange={(e) => setTitle(e.target.value)}

                            className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"

                            placeholder="Contoh: Masalah pengisian KRS"

                            required

                            disabled={isLoading}

                        />

                    </div>

                     <div>

                        <label htmlFor="question" className="block text-sm font-medium text-black dark:text-gray-100">

                            Detail Pertanyaan

                        </label>

                        <textarea

                            id="question"

                            rows={6}

                            value={question}

                            onChange={(e) => setQuestion(e.target.value)}

                            className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"

                            placeholder="Jelaskan pertanyaan atau masalah Anda secara rinci di sini..."

                            required

                             disabled={isLoading}

                        />

                    </div>

                    <div>

                        <label htmlFor="attachment" className="block text-sm font-medium text-black dark:text-gray-100">

                            Lampiran (Opsional, maks. 5MB)

                        </label>

                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">

                            <div className="space-y-1 text-center">

                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>

                                <div className="flex text-sm text-gray-600 dark:text-gray-400">

                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">

                                        <span>Upload file</span>

                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isLoading} />

                                    </label>

                                    <p className="pl-1">atau tarik dan lepas</p>

                                </div>

                                {attachment ? (

                                    <p className="text-sm text-gray-500 dark:text-gray-300 truncate">File: {attachment.name}</p>

                                ) : (

                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF, DOCX hingga 5MB</p>

                                )}

                            </div>

                        </div>

                    </div>

                    <div className="flex justify-end">

                        <button

                            type="submit"

                            disabled={isLoading}

                            className="flex items-center justify-center w-full sm:w-auto px-6 py-2 font-semibold text-text-on-primary bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-blue-300 dark:disabled:bg-blue-900 transition-colors duration-300"

                        >

                            {isLoading ? <LoadingSpinner /> : 'Kirim Pertanyaan'}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};



export default AskQuestionPage;
