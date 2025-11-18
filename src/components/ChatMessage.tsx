import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';
  const textContent = message.parts.map(part => part.text).join('');

  return (
    <div className={`flex items-end gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
          <BotIcon />
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg shadow-sm break-words ${
          isBot
            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
            : 'bg-red-500 dark:bg-red-600 text-white rounded-br-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{textContent}</p>
      </div>
      {!isBot && (
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
          <UserIcon />
        </div>
      )}
    </div>
  );
};
