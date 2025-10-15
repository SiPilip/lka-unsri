import React from 'react';
import { Message as MessageType, User } from '../types';

interface MessageProps {
  message: MessageType;
  user?: User;
}

const Message: React.FC<MessageProps> = ({ message, user }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg p-3 rounded-lg shadow-md whitespace-pre-wrap ${
          isUser
            ? 'bg-primary text-text-on-primary rounded-br-none'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
        }`}
      >
        {message.text}
      </div>
       {isUser && user && (
         user.profilePicture ? (
            <img src={user.profilePicture} alt="Foto Profil" className="flex-shrink-0 w-10 h-10 rounded-full object-cover"/>
         ) : (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-text-on-primary font-bold">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
            </div>
         )
       )}
    </div>
  );
};

export default Message;