import React, { useState } from 'react';
import { generateProjectDescription } from '../services/geminiService';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { ServiceType } from '../types';

interface AIAssistantProps {
  onDescriptionGenerated?: (desc: string) => void;
  selectedService?: ServiceType;
  mode?: 'client' | 'vendor';
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onDescriptionGenerated, 
  selectedService,
  mode = 'client'
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    if (mode === 'client' && onDescriptionGenerated) {
      const result = await generateProjectDescription(input, selectedService!);
      onDescriptionGenerated(result);
      setIsOpen(false);
      setInput('');
    } else {
      // Vendor mode: Chat interaction
      const userMessage = { role: 'user' as const, text: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Simulate/Trigger AI response for vendor faq
      setTimeout(() => {
        const botReply = { 
          role: 'bot' as const, 
          text: `As a Construction Mart vendor, you can manage regional rates, labor strength, and generate estimations. To get started, navigate to your 'Vendor Profile' and fill in your regional details. Our 10% platform fee is applied to completed projects.`
        };
        setMessages(prev => [...prev, botReply]);
      }, 1000);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
      >
        <Sparkles size={16} />
        Use AI Assistant to write description
      </button>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-100 rounded-lg p-4 mt-2 mb-4 ${mode === 'vendor' ? 'max-w-xl' : ''}`}>
      <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold">
        <Bot size={18} />
        <span>{mode === 'client' ? 'AI Project Helper' : 'Vendor Onboarding Assistant'}</span>
      </div>
      
      {mode === 'vendor' && messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto p-2 bg-white/50 rounded-md">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-2 text-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-600 mb-3">
        {mode === 'client' 
          ? 'Briefly describe what you want (e.g., "I need a modern kitchen with an island"), and I\'ll write a professional spec for you.'
          : 'Ask any questions about becoming a vendor, fees, regional rates, or platform guidelines.'}
      </p>

      <div className="relative">
        <textarea
          className="w-full p-2 pr-10 border border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
          rows={mode === 'client' ? 3 : 2}
          placeholder={mode === 'client' ? "Enter your rough ideas here..." : "Ask your question here..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAction())}
        />
        <button
          onClick={handleAction}
          disabled={loading || !input.trim()}
          className="absolute right-2 bottom-4 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        </button>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setIsOpen(false)}
          className="px-3 py-1 text-[10px] text-gray-500 hover:text-gray-700"
        >
          Close {mode === 'vendor' ? 'Chat' : 'Assistant'}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;