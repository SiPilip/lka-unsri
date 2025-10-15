
import React, { useState, useMemo } from 'react';
import { Question } from '../types';

interface HistoryPageProps {
    questions: Question[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ questions }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };
    
    // Sort questions from newest to oldest to ensure the "Konsultasi Ke" number is correct chronologically.
    const sortedQuestions = useMemo(() => 
        [...questions].sort((a, b) => b.submissionTime - a.submissionTime), 
    [questions]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full overflow-y-auto">
            <div className="bg-slate-50/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Riwayat Konsultasi</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Lihat semua pertanyaan yang pernah Anda ajukan dan jawaban dari Dosen PA.</p>
                </div>
                
                <div className="overflow-x-auto">
                    {sortedQuestions.length === 0 ? (
                        <p className="p-6 text-center text-gray-500 dark:text-gray-400">Anda belum pernah mengajukan pertanyaan.</p>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">No.</th>
                                    <th scope="col" className="px-6 py-3">Tanggal Pengajuan</th>
                                    <th scope="col" className="px-6 py-3">Judul Pertanyaan</th>
                                    <th scope="col" className="px-6 py-3">Jawaban Dosen</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedQuestions.map((q, index) => (
                                    <React.Fragment key={q.id}>
                                        <tr 
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                            onClick={() => toggleExpand(q.id)}
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {sortedQuestions.length - index}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(q.submissionTime).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">
                                                {q.title}
                                            </td>
                                            <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                                <p className="truncate max-w-xs">{q.answerText || 'Belum ada jawaban'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    q.status === 'answered' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                }`}>
                                                    {q.status === 'answered' ? 'Sudah Dijawab' : 'Menunggu Jawaban'}
                                                </span>
                                            </td>
                                        </tr>
                                        {expandedId === q.id && (
                                            <tr className="bg-gray-50 dark:bg-gray-900/50">
                                                <td colSpan={5} className="p-4">
                                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-inner space-y-4">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-600 dark:text-gray-300">Pertanyaan Anda:</h4>
                                                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{q.questionText}</p>
                                                        </div>
                                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                            <h4 className="font-semibold text-green-600 dark:text-green-400">Jawaban Dosen:</h4>
                                                            {q.answerText ? (
                                                                <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{q.answerText}</p>
                                                            ) : (
                                                                <p className="mt-1 text-sm text-gray-500 italic">Belum ada jawaban dari dosen.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
