import React from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Escriu la teva pregunta..."
        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none resize-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        rows={1}
        disabled={isLoading}
        style={{ maxHeight: '100px' }}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
};
