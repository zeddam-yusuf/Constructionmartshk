import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChatMessage, UserRole } from '../types';
import { Send, User, Shield, Hammer, Plus, Search, ArrowLeft, X, Building2, HardHat, Briefcase, Users, Loader2, MessageSquare } from 'lucide-react';
import { dbListUsers, StoredUser, VALID_ROLES } from '../services/store';
import { useAuth } from '../services/auth';

interface ChatWindowProps {
  currentUserRole: UserRole;
  messages: ChatMessage[];
  onSendMessage: (text: string, peer?: { id: string; name: string; role: string }) => void;
}

interface Conversation {
  peerId: string;
  peerName: string;
  peerRole: string;
  lastText: string;
  lastTime: string;
  count: number;
}

const ROLE_LABELS: Record<string, string> = {
  CLIENT: 'Developer',
  VENDOR: 'Vendor / Contractor',
  PMC: 'PMC',
  CHANNEL_PARTNER: 'Channel Partner',
  LABOUR: 'Labour',
  MATERIAL_SUPPLIER: 'Material Supplier',
  JOB: 'Job Seeker',
  FREELANCER: 'Freelancer',
  BROKER: 'Broker',
};

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUserRole, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [roleUsers, setRoleUsers] = useState<StoredUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [extraPeers, setExtraPeers] = useState<{ id: string; name: string; role: string }[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user: authUser } = useAuth();

  const currentUserId = authUser?.id || 'user';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedPeerId]);

  const isMe = (msg: ChatMessage) => {
    if (msg.senderId === currentUserId || msg.senderId === 'user') return true;
    return msg.senderRole.toUpperCase() === String(currentUserRole).toUpperCase() ||
      (String(currentUserRole) === UserRole.CLIENT && msg.senderRole === 'Client');
  };

  // Only messages where current user is participant (sender or recipient). Fixes "showing chats to all users".
  const myMessages = useMemo(() => {
    return messages.filter((msg) => {
      const meSending = isMe(msg);
      if (meSending) return true;
      if (msg.recipientId === currentUserId || msg.conversationId === currentUserId) return true;
      if (!msg.recipientId && !msg.conversationId && (msg.senderRole === 'Admin' || msg.senderRole === 'System')) return true;
      return false;
    });
  }, [messages, currentUserId, currentUserRole]);

  const conversations: Conversation[] = useMemo(() => {
    const map = new Map<string, Conversation>();
    const getPeerKey = (msg: ChatMessage): { id: string; name: string; role: string } | null => {
      const me = isMe(msg);
      if (me) {
        if (msg.recipientId) return { id: msg.recipientId, name: msg.recipientName || msg.recipientId, role: msg.recipientRole || 'Unknown' };
        if (msg.conversationId) return { id: msg.conversationId, name: msg.conversationId, role: 'Unknown' };
        return null;
      } else {
        return { id: msg.senderId, name: msg.senderName, role: msg.senderRole };
      }
    };

    // seed with extra peers from New Chat (even with no messages)
    extraPeers.forEach((p) => {
      if (!map.has(p.id)) {
        map.set(p.id, { peerId: p.id, peerName: p.name, peerRole: p.role, lastText: 'No messages yet — start the conversation', lastTime: new Date().toISOString(), count: 0 });
      }
    });

    myMessages.forEach((msg) => {
      const peer = getPeerKey(msg);
      if (!peer) {
        const fallbackId = '__general__';
        const existing = map.get(fallbackId);
        const entry: Conversation = existing || { peerId: fallbackId, peerName: 'General Chat', peerRole: 'Support', lastText: '', lastTime: msg.timestamp, count: 0 };
        entry.lastText = msg.text.slice(0, 50);
        entry.lastTime = msg.timestamp;
        entry.count += 1;
        map.set(fallbackId, entry);
        return;
      }
      const key = peer.id;
      const existing = map.get(key);
      if (existing) {
        existing.lastText = msg.text.slice(0, 50);
        if (new Date(msg.timestamp).getTime() > new Date(existing.lastTime).getTime()) {
          existing.lastTime = msg.timestamp;
        }
        existing.count += 1;
        // keep latest name/role
        existing.peerName = peer.name;
        existing.peerRole = peer.role;
      } else {
        map.set(key, { peerId: peer.id, peerName: peer.name, peerRole: peer.role, lastText: msg.text.slice(0, 50), lastTime: msg.timestamp, count: 1 });
      }
    });

    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
    return list;
  }, [myMessages, extraPeers]);

  // auto-select first conversation by default
  useEffect(() => {
    if (!selectedPeerId && conversations.length > 0) {
      setSelectedPeerId(conversations[0].peerId);
    }
  }, [conversations, selectedPeerId]);

  const filteredConversations = useMemo(() => {
    if (!historySearch.trim()) return conversations;
    const q = historySearch.toLowerCase();
    return conversations.filter((c) => c.peerName.toLowerCase().includes(q) || c.peerRole.toLowerCase().includes(q) || c.lastText.toLowerCase().includes(q));
  }, [conversations, historySearch]);

  const activeConversation = useMemo(() => conversations.find((c) => c.peerId === selectedPeerId) || null, [conversations, selectedPeerId]);

  const activeMessages = useMemo(() => {
    if (!selectedPeerId) return [];
    return myMessages.filter((msg) => {
      const me = isMe(msg);
      if (me) {
        if (msg.recipientId) return msg.recipientId === selectedPeerId;
        if (msg.conversationId) return msg.conversationId === selectedPeerId;
        // legacy me-messages without recipient: assign to selected peer if it's the fallback general
        return selectedPeerId === '__general__';
      } else {
        return msg.senderId === selectedPeerId;
      }
    });
  }, [myMessages, selectedPeerId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedPeerId || !activeConversation) return;
    onSendMessage(inputText, { id: activeConversation.peerId, name: activeConversation.peerName, role: activeConversation.peerRole });
    setInputText('');
  };

  const getRoleIcon = (role: string) => {
    const r = role.toUpperCase();
    if (r === 'ADMIN') return <Shield size={14} />;
    if (r === 'VENDOR' || r === 'PMC') return <Hammer size={14} />;
    if (r === 'LABOUR' || r === 'MATERIAL_SUPPLIER') return <HardHat size={14} />;
    if (r === 'BROKER' || r === 'CHANNEL_PARTNER') return <Building2 size={14} />;
    if (r === 'CLIENT') return <Briefcase size={14} />;
    return <User size={14} />;
  };

  const openNewChat = () => {
    setSelectedRole(null);
    setRoleUsers([]);
    setShowNewChat(true);
  };

  const handleSelectRole = async (role: string) => {
    setSelectedRole(role);
    setLoadingUsers(true);
    try {
      const all = await dbListUsers();
      const filtered = all.filter((u) => u.role === role && u.id !== currentUserId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
      setRoleUsers(filtered);
    } catch (e) {
      setRoleUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handlePickUser = (u: StoredUser) => {
    const peer = { id: u.id, name: u.name, role: u.role };
    setExtraPeers((prev) => (prev.find((p) => p.id === u.id) ? prev : [...prev, peer]));
    setSelectedPeerId(u.id);
    setShowNewChat(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Left: Chat history list */}
      <div className={`${selectedPeerId ? 'hidden lg:flex' : 'flex'} w-full lg:w-[340px] flex-col border-r border-gray-100 bg-gray-50 shrink-0`}>
        <div className="p-3 border-b border-gray-100 bg-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg"><MessageSquare size={16} /></span>
              Chats
            </h3>
            <button onClick={openNewChat} className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Plus size={14} /> New Chat
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} placeholder="Search chats..." className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
              <MessageSquare size={28} className="mb-2 text-gray-300" />
              <p className="text-sm font-semibold">No chats yet</p>
              <p className="text-xs mt-1">Start a new chat to connect with users.</p>
            </div>
          ) : (
            filteredConversations.map((c) => (
              <button key={c.peerId} onClick={() => setSelectedPeerId(c.peerId)} className={`w-full text-left flex items-center gap-3 px-3 py-3 hover:bg-white transition-colors border-b border-gray-50 ${selectedPeerId === c.peerId ? 'bg-white border-l-4 border-l-orange-500' : 'border-l-4 border-l-transparent'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${c.peerRole === 'Admin' ? 'bg-red-500' : 'bg-orange-500'}`}>
                  {c.peerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-gray-800 truncate">{c.peerName}</span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                    <span className="text-[10px] px-1 py-0.5 bg-gray-100 rounded font-medium">{ROLE_LABELS[c.peerRole] || c.peerRole}</span>
                    <span className="truncate">{c.lastText}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Active chat view */}
      <div className={`${!selectedPeerId ? 'hidden lg:flex' : 'flex'} flex-1 flex-col min-w-0`}>
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-slate-50">
            <Users size={32} className="mb-3 text-gray-300" />
            <p className="font-semibold">Select a chat</p>
            <p className="text-xs mt-1">Choose a conversation from the history list or start a new chat.</p>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-gray-100 bg-white flex items-center gap-3">
              <button onClick={() => setSelectedPeerId(null)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18} /></button>
              <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">{activeConversation.peerName.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{activeConversation.peerName}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">{getRoleIcon(activeConversation.peerRole)} {ROLE_LABELS[activeConversation.peerRole] || activeConversation.peerRole}</p>
              </div>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 hidden sm:inline">Role: {currentUserRole}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {activeMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p className="text-sm">No messages yet.</p>
                  <p className="text-xs">Say hello to {activeConversation.peerName}!</p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const me = isMe(msg);
                  return (
                    <div key={msg.id} className={`flex flex-col ${me ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-end gap-2 max-w-[80%] ${me ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${msg.senderRole === 'Admin' ? 'bg-red-500' : msg.senderRole === 'Vendor' ? 'bg-blue-600' : 'bg-gray-400'}`}>
                          {msg.senderName.charAt(0)}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${me ? 'bg-orange-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'}`}>
                          <div className={`flex items-center gap-1 text-[10px] mb-1 font-bold uppercase tracking-wider ${me ? 'text-orange-100' : 'text-gray-400'}`}>
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

            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex gap-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={`Message ${activeConversation.peerName}...`} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <button type="submit" disabled={!inputText.trim()} className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* New Chat modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} className="text-orange-600" /> New Chat</h3>
              <button onClick={() => setShowNewChat(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>

            {!selectedRole ? (
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4">Select the type of user you want to chat with:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {VALID_ROLES.map((role) => (
                    <button key={role} onClick={() => handleSelectRole(role)} className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl transition-colors text-center">
                      <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><User size={18} /></span>
                      <span className="text-xs font-bold text-gray-800">{ROLE_LABELS[role] || role}</span>
                      <span className="text-[10px] text-gray-400">{role}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                  <button onClick={() => { setSelectedRole(null); setRoleUsers([]); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><ArrowLeft size={16} /></button>
                  <span className="text-sm font-bold text-gray-800">Top 10 latest {ROLE_LABELS[selectedRole] || selectedRole}s</span>
                  <span className="ml-auto text-xs text-gray-400">{roleUsers.length} found</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {loadingUsers ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-orange-600" size={24} /></div>
                  ) : roleUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No users found for this type.</p>
                      <p className="text-xs mt-1">Try another role or check back later.</p>
                    </div>
                  ) : (
                    roleUsers.map((u) => (
                      <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-white border border-gray-100 hover:border-orange-200 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">{u.name.charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 truncate">{u.companyName || u.category || u.city || u.phone} · {new Date(u.created_at).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handlePickUser(u)} className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Message</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
