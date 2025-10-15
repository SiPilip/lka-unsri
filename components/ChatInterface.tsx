import React, { useEffect, useRef } from 'react';
import { Message as MessageType, User } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';

interface ChatInterfaceProps {
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, isLoading, setIsLoading, currentUser }) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
        const aiResponseText = await sendMessageToAI(trimmedInput);
        const aiMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'ai',
        };
        setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
         const errorMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          text: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
          sender: 'ai',
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} user={msg.sender === 'user' ? currentUser : undefined} />
          ))}
          {isLoading && (
             <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="p-3 rounded-lg rounded-tl-none bg-white dark:bg-gray-700 shadow-md">
                    <LoadingSpinner />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pertanyaan Anda di sini..."
            className="flex-1 w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
            disabled={isLoading}
            aria-label="Input pesan"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center w-10 h-10 text-white bg-primary rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed dark:disabled:bg-blue-900 transition-colors"
            aria-label="Kirim pesan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;