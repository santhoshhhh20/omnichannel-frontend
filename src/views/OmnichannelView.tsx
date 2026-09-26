import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Globe, 
  Send as TelegramIcon, 
  Instagram,
  Search, 
  Paperclip,
  CheckCheck,
  Zap,
  Ticket as TicketIcon,
  Inbox
} from 'lucide-react';
import { ChannelMetric } from '../types';

interface OmnichannelViewProps {
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  onOpenNewTicket?: () => void;
}

export const OmnichannelView: React.FC<OmnichannelViewProps> = ({ onShowToast, onOpenNewTicket }) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // 5 Channels: WhatsApp, Telegram, Email, Web Chat, Instagram
  const channels: ChannelMetric[] = [
    {
      id: 'ch-whatsapp',
      name: 'WhatsApp Support',
      type: 'WhatsApp',
      status: 'Connected',
      unreadCount: 0,
      avgResponseTime: '0s',
      satisfaction: 100,
      iconName: 'Smartphone'
    },
    {
      id: 'ch-telegram',
      name: 'Telegram Bot',
      type: 'Telegram',
      status: 'Connected',
      unreadCount: 0,
      avgResponseTime: '0s',
      satisfaction: 100,
      iconName: 'Send'
    },
    {
      id: 'ch-email',
      name: 'Support Email',
      type: 'Email',
      status: 'Connected',
      unreadCount: 0,
      avgResponseTime: '0s',
      satisfaction: 100,
      iconName: 'Mail'
    },
    {
      id: 'ch-webchat',
      name: 'Website Widget',
      type: 'Web Chat',
      status: 'Connected',
      unreadCount: 0,
      avgResponseTime: '0s',
      satisfaction: 100,
      iconName: 'Globe'
    },
    {
      id: 'ch-instagram',
      name: 'Instagram Direct',
      type: 'Instagram',
      status: 'Connected',
      unreadCount: 0,
      avgResponseTime: '0s',
      satisfaction: 100,
      iconName: 'Instagram'
    }
  ];

  const [conversations, setConversations] = useState<any[]>([]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;
    activeChat.messages.push({
      sender: 'agent',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    onShowToast?.('Message Sent', `Reply delivered to ${activeChat.customerName}`, 'success');
    setReplyText('');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* 5 Channel Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {channels.map((ch) => (
          <div 
            key={ch.id}
            onClick={() => setSelectedChannel(ch.type.toLowerCase())}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              selectedChannel === ch.type.toLowerCase()
                ? 'bg-indigo-50/90 border-indigo-500 shadow-md shadow-indigo-500/10'
                : 'bg-white border-slate-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {ch.type === 'WhatsApp' ? <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> :
                   ch.type === 'Telegram' ? <TelegramIcon className="w-3.5 h-3.5 text-sky-600" /> :
                   ch.type === 'Email' ? <Mail className="w-3.5 h-3.5 text-blue-600" /> :
                   ch.type === 'Web Chat' ? <Globe className="w-3.5 h-3.5 text-amber-600" /> :
                   <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                </div>
                <span className="text-xs font-bold text-slate-900 truncate">{ch.name}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>State: <strong className="text-emerald-600 font-bold">Online</strong></span>
              <span className="text-[10px] text-slate-400 font-medium">Ready</span>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Inbox Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs h-[620px]">
        {/* Left Inbox List */}
        <div className="lg:col-span-4 border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50">
          {/* Search Header */}
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter Sync X messages..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 flex flex-col justify-center">
            {conversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h5 className="text-xs font-bold text-slate-800">Inbox Clear</h5>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-normal">
                  Incoming messages from WhatsApp, Telegram, Email, Web Chat, and Instagram will show here in real time.
                </p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Right Active Conversation Window */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50/30">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Sync X Unified Inbox</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Connected channels: WhatsApp, Telegram, Email, Web Chat, and Instagram. Select a chat or create a ticket to begin messaging.
                </p>
              </div>
              <button
                onClick={onOpenNewTicket}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                + Create Ticket
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full">
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
