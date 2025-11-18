import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { BotIcon } from './components/icons/BotIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'model',
      parts: [{ text: "Hola! Sóc en Giuseppe, preparat per ajudar-te amb la teva pizza. Vols una recomanació o vols saber quina promoció tenim avui? Bon profit!" }],
      id: Date.now().toString(),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessageType = {
      role: 'user',
      parts: [{ text: userInput }],
      id: Date.now().toString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.parts,
      }));

      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, history }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: data.response }],
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Error sending message: ${errorMessage}`);
      const errorBotMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: "Oops! Sembla que tinc problemes tècnics. Si us plau, intenta-ho de nou més tard." }],
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-800 font-sans">
      <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center space-x-4">
        <div className="p-2 bg-red-600 rounded-full text-white">
          <BotIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Giuseppe</h1>
          <p className="text-sm text-green-500 dark:text-green-400">Online</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
           <div className="flex justify-start items-end space-x-3">
             <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
               <BotIcon />
             </div>
             <div className="bg-white dark:bg-gray-700 p-3 rounded-lg rounded-bl-none shadow-sm">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-center">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      <footer className="bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
        <ChatInput
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
        />
      </footer>
    </div>
  );
};

export default App;
