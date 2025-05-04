'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
   SendIcon,
   ChevronDownIcon,
   BotIcon,
   UserIcon,
   PlusIcon,
   DownloadIcon,
   GlobeIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import { trackEvent, trackPageView } from '@/lib/telemetry';

type LanguageModel = 'english' | 'french' | 'swahili';

interface Message {
   id: string;
   role: 'user' | 'assistant';
   content: string;
   timestamp: Date;
}

interface ChatSession {
   id: string;
   title: string;
   messages: Message[];
   createdAt: Date;
}

const ChatPage = () => {
   const { user } = useUser();
   const [sessions, setSessions] = useState<ChatSession[]>([]);
   const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
   const [input, setInput] = useState('');
   const [isProcessing, setIsProcessing] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
   const [selectedLanguage, setSelectedLanguage] = useState<LanguageModel>('english');
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const langMenuRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (sessions.length === 0) {
         createNewSession();
      }

      trackPageView('Chat Page', { userId: user?.id });
   }, []);

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [activeSession?.messages]);

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
            setIsLangMenuOpen(false);
         }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const createNewSession = () => {
      const newSession: ChatSession = {
         id: uuidv4(),
         title: `Chat ${sessions.length + 1}`,
         messages: [],
         createdAt: new Date(),
      };

      setSessions((prev) => [...prev, newSession]);
      setActiveSession(newSession);
      setInput('');

      trackEvent('NewChatSession', {
         sessionId: newSession.id,
         userId: user?.id,
      });
   };

   const handleLanguageChange = (language: LanguageModel) => {
      setSelectedLanguage(language);
      setIsLangMenuOpen(false);

      trackEvent('LanguageChanged', {
         language,
         sessionId: activeSession?.id,
         userId: user?.id,
      });
   };

   const getLanguageLabel = (lang: LanguageModel): string => {
      const labels = {
         english: 'English',
         french: 'Français',
         swahili: 'Kiswahili',
      };
      return labels[lang];
   };

   const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim() || !activeSession || isProcessing) return;

      const messageContent = input.trim();
      const requestStartTime = Date.now();

      const userMessage = {
         id: uuidv4(),
         role: 'user' as const,
         content: messageContent,
         timestamp: new Date(),
      };

      const aiMessage = {
         id: uuidv4(),
         role: 'assistant' as const,
         content: '',
         timestamp: new Date(),
      };

      const updatedMessages = [...activeSession.messages, userMessage];

      setActiveSession((prevSession) => {
         if (!prevSession) return prevSession;
         return {
            ...prevSession,
            messages: [...prevSession.messages, userMessage],
         };
      });

      setInput('');
      setIsProcessing(true);

      let retries = 0;
      const MAX_RETRIES = 2;

      const attemptStreamRequest = async (): Promise<void> => {
         try {
            setActiveSession((prevSession) => {
               if (!prevSession) return prevSession;
               return {
                  ...prevSession,
                  messages: [...prevSession.messages, aiMessage],
               };
            });

            const response = await fetch('/api/chat', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Accept: 'text/event-stream',
                  'X-Request-ID': uuidv4(),
               },
               body: JSON.stringify({
                  messages: updatedMessages.map((msg) => ({
                     role: msg.role,
                     content: msg.content,
                  })),
                  sessionId: activeSession.id,
                  language: selectedLanguage,
               }),
            });

            if (!response.ok) {
               throw new Error(`Server responded with ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Response has no body');

            let partialResponse = '';
            const decoder = new TextDecoder();
            let buffer = ''; // Buffer for handling partial chunks

            while (true) {
               const { done, value } = await reader.read();
               if (done) break;

               const chunk = decoder.decode(value, { stream: true });
               buffer += chunk;

               const lines = buffer.split('\n\n');
               buffer = lines.pop() || '';

               for (const line of lines) {
                  if (line.trim() === '' || line.startsWith(':')) continue;

                  if (line.startsWith('data: ')) {
                     const data = line.slice(6).trim();
                     if (data === '[DONE]') continue;

                     try {
                        const parsedData = JSON.parse(data);

                        if (parsedData.content) {
                           partialResponse += parsedData.content;

                           setActiveSession((prev) => {
                              if (!prev) return prev;

                              const newMessages = [...prev.messages];
                              const lastAssistantIndex = newMessages.findIndex(
                                 (msg) => msg.id === aiMessage.id,
                              );

                              if (lastAssistantIndex >= 0) {
                                 newMessages[lastAssistantIndex] = {
                                    ...newMessages[lastAssistantIndex],
                                    content: partialResponse,
                                 };
                              }

                              return {
                                 ...prev,
                                 messages: newMessages,
                              };
                           });
                        }

                        if (parsedData.error) {
                           throw new Error(parsedData.error);
                        }
                     } catch (e) {
                        if (data !== '[DONE]') {
                           console.error('Error parsing chunk:', e, 'Raw data:', data);
                        }
                     }
                  }
               }
            }

            const responseTime = Date.now() - requestStartTime;
            console.log(`Stream complete in ${responseTime}ms`);
         } catch (error) {
            console.error('Error streaming response:', error);

            if (retries < MAX_RETRIES) {
               retries++;
               console.log(`Retrying stream (${retries}/${MAX_RETRIES})...`);
               return attemptStreamRequest();
            }

            setActiveSession((prev) => {
               if (!prev) return prev;

               const newMessages = [...prev.messages];
               const assistantMessageIndex = newMessages.findIndex(
                  (msg) => msg.id === aiMessage.id,
               );

               if (assistantMessageIndex >= 0) {
                  newMessages[assistantMessageIndex] = {
                     ...newMessages[assistantMessageIndex],
                     content:
                        'Sorry, there was an error processing your request. Please try again later.',
                  };
               } else {
                  newMessages.push({
                     ...aiMessage,
                     content:
                        'Sorry, there was an error processing your request. Please try again later.',
                  });
               }

               return {
                  ...prev,
                  messages: newMessages,
               };
            });

            console.error('Stream failed after retries:', error);
         } finally {
            setIsProcessing(false);
         }
      };

      attemptStreamRequest();
   };

   const exportChat = (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;

      trackEvent('ExportChat', {
         sessionId: session.id,
         messageCount: session.messages.length,
         userId: user?.id,
         language: selectedLanguage,
         format: 'text',
      });

      const textContent = session.messages
         .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
         .join('\n\n');

      const jsonContent = JSON.stringify(
         {
            id: session.id,
            title: session.title,
            timestamp: session.createdAt,
            messages: session.messages.map((msg) => ({
               role: msg.role,
               content: msg.content,
               timestamp: msg.timestamp,
            })),
            metadata: {
               language: selectedLanguage,
               exportDate: new Date().toISOString(),
            },
         },
         null,
         2,
      );

      const textBlob = new Blob([textContent], { type: 'text/plain' });
      const textUrl = URL.createObjectURL(textBlob);

      const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
      const jsonUrl = URL.createObjectURL(jsonBlob);

      const baseFilename = `${session.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;

      const textLink = document.createElement('a');
      textLink.href = textUrl;
      textLink.download = `${baseFilename}.txt`;
      document.body.appendChild(textLink);
      textLink.click();

      const jsonLink = document.createElement('a');
      jsonLink.href = jsonUrl;
      jsonLink.download = `${baseFilename}.json`;
      document.body.appendChild(jsonLink);

      setTimeout(() => {
         jsonLink.click();

         document.body.removeChild(textLink);
         document.body.removeChild(jsonLink);
         URL.revokeObjectURL(textUrl);
         URL.revokeObjectURL(jsonUrl);
      }, 100);
   };

   const deleteChat = (sessionId: string) => {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));

      if (activeSession?.id === sessionId) {
         const remaining = sessions.filter((session) => session.id !== sessionId);
         if (remaining.length > 0) {
            setActiveSession(remaining[0]);
         } else {
            createNewSession();
         }
      }
   };

   return (
      <div className="flex h-screen bg-gray-50">
         <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
               <button
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
                  onClick={createNewSession}
               >
                  <PlusIcon size={16} className="mr-2" />
                  New Chat
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
               {sessions.map((session) => (
                  <div
                     key={session.id}
                     className={`p-3 mb-1 rounded-md cursor-pointer flex items-center justify-between group ${
                        activeSession?.id === session.id
                           ? 'bg-blue-100 text-blue-700'
                           : 'hover:bg-gray-200'
                     }`}
                     onClick={() => setActiveSession(session)}
                  >
                     <div className="truncate flex-1">
                        <BotIcon size={14} className="inline mr-2" />
                        {session.title}
                     </div>

                     <div className="hidden group-hover:flex items-center">
                        <button
                           className="p-1 text-gray-500 hover:text-gray-700"
                           onClick={(e) => {
                              e.stopPropagation();
                              exportChat(session.id);
                           }}
                           title="Export chat"
                        >
                           <DownloadIcon size={14} />
                        </button>
                        <button
                           className="p-1 text-gray-500 hover:text-red-600"
                           onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(session.id);
                           }}
                           title="Delete chat"
                        >
                           <span className="text-lg leading-none">&times;</span>
                        </button>
                     </div>
                  </div>
               ))}
            </div>

            <div className="p-4 border-t border-gray-200">
               <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                     {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="text-sm">{user?.firstName || user?.username || 'User'}</div>
               </div>
            </div>
         </div>

         <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center bg-white">
               <h1 className="text-xl font-semibold flex-1">
                  {activeSession?.title || 'AI Assistant'}
               </h1>

               <div className="flex-1 flex justify-center relative" ref={langMenuRef}>
                  <button
                     onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                     className="px-4 py-2 flex items-center text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                     <GlobeIcon size={16} className="mr-2" />
                     <span>{getLanguageLabel(selectedLanguage)}</span>
                     <ChevronDownIcon size={16} className="ml-2" />
                  </button>

                  {isLangMenuOpen && (
                     <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                        <div className="py-1">
                           <button
                              className={`w-full text-left px-4 py-2 ${selectedLanguage === 'english' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                              onClick={() => handleLanguageChange('english')}
                           >
                              English
                           </button>
                           <button
                              className={`w-full text-left px-4 py-2 ${selectedLanguage === 'french' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                              onClick={() => handleLanguageChange('french')}
                           >
                              Français
                           </button>
                           <button
                              className={`w-full text-left px-4 py-2 ${selectedLanguage === 'swahili' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                              onClick={() => handleLanguageChange('swahili')}
                           >
                              Kiswahili
                           </button>
                        </div>
                     </div>
                  )}
               </div>

               <div className="flex-1 flex justify-end relative">
                  <button
                     className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                     <ChevronDownIcon size={20} />
                  </button>

                  {isMenuOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                           <button
                              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                 if (activeSession) exportChat(activeSession.id);
                                 setIsMenuOpen(false);
                              }}
                           >
                              Export conversation
                           </button>
                           <button
                              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                 createNewSession();
                                 setIsMenuOpen(false);
                              }}
                           >
                              New conversation
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white">
               {activeSession?.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                     <BotIcon size={48} className="mb-4" />
                     <h2 className="text-2xl font-medium mb-2">How can I help you today?</h2>
                     <p className="max-w-md">
                        {selectedLanguage === 'english' &&
                           'Ask me questions about your data, documentation, or any other information you need help with.'}
                        {selectedLanguage === 'french' &&
                           'Posez-moi des questions sur vos données, votre documentation ou toute autre information dont vous avez besoin.'}
                        {selectedLanguage === 'swahili' &&
                           'Niulize maswali kuhusu data yako, nyaraka, au taarifa nyingine yoyote unayohitaji usaidizi.'}
                     </p>
                  </div>
               ) : (
                  <AnimatePresence initial={false}>
                     {activeSession?.messages.map((message) => (
                        <motion.div
                           key={message.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.3 }}
                           className={`mb-6 ${
                              message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                           }`}
                        >
                           <div
                              className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                           >
                              <div
                                 className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                                    message.role === 'user'
                                       ? 'bg-blue-600 ml-3'
                                       : 'bg-gray-300 mr-3'
                                 }`}
                              >
                                 {message.role === 'user' ? (
                                    <UserIcon size={16} className="text-white" />
                                 ) : (
                                    <BotIcon size={16} className="text-gray-700" />
                                 )}
                              </div>
                              <div
                                 className={`rounded-2xl px-4 py-2 max-w-3xl ${
                                    message.role === 'user'
                                       ? 'bg-blue-600 text-white'
                                       : 'bg-gray-100'
                                 }`}
                              >
                                 <div className="prose prose-sm">
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                 </div>
                                 <div
                                    className={`text-xs mt-1 ${
                                       message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                                    }`}
                                 >
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                       hour: '2-digit',
                                       minute: '2-digit',
                                    })}
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                     {isProcessing && (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="flex justify-start mb-6"
                        >
                           <div className="flex flex-row">
                              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 mr-3">
                                 <BotIcon size={16} className="text-gray-700" />
                              </div>
                              <div className="rounded-2xl px-4 py-2 bg-gray-100">
                                 <div className="flex items-center space-x-1">
                                    <div
                                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                       style={{ animationDelay: '0ms' }}
                                    ></div>
                                    <div
                                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                       style={{ animationDelay: '150ms' }}
                                    ></div>
                                    <div
                                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                       style={{ animationDelay: '300ms' }}
                                    ></div>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               )}
               <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
               <form onSubmit={handleSendMessage} className="flex items-end">
                  <div className="flex-grow relative">
                     <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                           selectedLanguage === 'english'
                              ? 'Type your message...'
                              : selectedLanguage === 'french'
                                ? 'Tapez votre message...'
                                : 'Andika ujumbe wako...'
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[56px] max-h-[200px] resize-none"
                        style={{
                           height: Math.min(Math.max(56, input.split('\n').length * 24), 200),
                        }}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                           }
                        }}
                        disabled={isProcessing}
                     />
                  </div>
                  <button
                     type="submit"
                     disabled={isProcessing || !input.trim()}
                     className={`ml-2 p-3 rounded-full ${
                        isProcessing || !input.trim()
                           ? 'bg-gray-300 text-gray-500'
                           : 'bg-blue-600 text-white hover:bg-blue-700'
                     } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                     <SendIcon size={18} />
                  </button>
               </form>
               <p className="mt-2 text-xs text-gray-500 text-center">
                  {selectedLanguage === 'english' &&
                     'AI responses are generated based on available data and may not always be accurate.'}
                  {selectedLanguage === 'french' &&
                     "Les réponses de l'IA sont générées à partir des données disponibles et peuvent ne pas toujours être précises."}
                  {selectedLanguage === 'swahili' &&
                     'Majibu ya AI yanazalishwa kulingana na data zilizopo na huenda yasisihi kila wakati.'}
               </p>
            </div>
         </div>
      </div>
   );
};

export default ChatPage;
