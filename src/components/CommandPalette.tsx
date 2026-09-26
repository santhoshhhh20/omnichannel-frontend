import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, MessageSquareShare, Ticket, Settings, ArrowRight, Zap, X } from 'lucide-react';
import { TabType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onOpenNewTicket: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTab,
  onOpenNewTicket
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard Overview',
      category: 'Navigation',
      icon: LayoutDashboard,
      run: () => { onSelectTab('dashboard'); onClose(); }
    },
    {
      id: 'omnichannel',
      title: 'Open Omnichannel Control Center',
      category: 'Navigation',
      icon: MessageSquareShare,
      run: () => { onSelectTab('omnichannel'); onClose(); }
    },
    {
      id: 'tickets',
      title: 'View All Customer Support Tickets',
      category: 'Navigation',
      icon: Ticket,
      run: () => { onSelectTab('tickets'); onClose(); }
    },
    {
      id: 'new-ticket',
      title: 'Create New Support Ticket',
      category: 'Actions',
      icon: Zap,
      run: () => { onOpenNewTicket(); onClose(); }
    },
    {
      id: 'settings',
      title: 'Manage Platform & Channel Settings',
      category: 'Navigation',
      icon: Settings,
      run: () => { onSelectTab('settings'); onClose(); }
    }
  ];

  const filtered = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search Sync X..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
            ESC
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No matching Sync X commands found.</p>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.run}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/80 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-950">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
