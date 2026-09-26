import React from 'react';
import { Search, Bell, Plus, Sparkles, Filter, Command } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onNewTicketClick?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onNewTicketClick,
  onOpenCommandPalette
}) => {
  const titles: Record<TabType, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time performance metrics and omnichannel support analytics.'
    },
    omnichannel: {
      title: 'Omnichannel Control Center',
      subtitle: 'Manage conversations across WhatsApp, Telegram, Email, Web Chat, and Instagram.'
    },
    tickets: {
      title: 'Ticket Management',
      subtitle: 'Track, assign, prioritize, and resolve customer support requests.'
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Configure channel integrations, team roles, and system preferences.'
    }
  };

  const current = titles[activeTab];

  return (
    <header className="bg-white/90 border-b border-slate-200/80 px-8 py-4 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shadow-2xs">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {current.title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{current.subtitle}</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Search Bar / Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="relative hidden sm:flex items-center space-x-3 w-64 px-3.5 py-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/90 hover:border-indigo-300 rounded-xl text-xs text-slate-500 transition-all text-left group cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="flex-1 truncate font-medium">Search Sync X...</span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-indigo-200">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Notifications Button */}
        <button 
          title="Notifications"
          className="relative p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/90 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 hover:shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Dynamic Production Action Button */}
        {activeTab === 'tickets' ? (
          <button 
            onClick={onNewTicketClick}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        ) : activeTab === 'omnichannel' ? (
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filter Channels</span>
          </button>
        ) : (
          <button 
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Actions</span>
          </button>
        )}
      </div>
    </header>
  );
};
