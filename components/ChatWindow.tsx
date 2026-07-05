import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserRole } from '../types';
import { Send, User, Shield, Hammer } from 'lucide-react';

interface ChatWindowProps {
  currentUserRole: UserRole;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUserRole, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield size={14} />;
      case 'Vendor': return <Hammer size={14} />;
      default: return <User size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-green-100 text-green-600 p-1.5 rounded-lg">
             <User size={20} />
          </span>
          Chat Window & Notifications
        </h3>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
          Role: {currentUserRole}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No messages yet.</p>
            <p className="text-xs">Notifications about your projects will appear here.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole.toUpperCase() === currentUserRole || (currentUserRole === UserRole.CLIENT && msg.senderRole === 'Client');
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${
                    msg.senderRole === 'Admin' ? 'bg-red-500' : 
                    msg.senderRole === 'Vendor' ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    {msg.senderName.charAt(0)}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}>
                    <div className={`flex items-center gap-1 text-[10px] mb-1 font-bold uppercase tracking-wider ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                      {getRoleIcon(msg.senderRole)}
                      {msg.senderName}
                    </div>
                    {msg.text}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-2">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;