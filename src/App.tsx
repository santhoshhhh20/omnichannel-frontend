import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { OmnichannelView } from './views/OmnichannelView';
import { TicketsView } from './views/TicketsView';
import { SettingsView } from './views/SettingsView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { NewTicketModal } from './components/NewTicketModal';
import { CommandPalette } from './components/CommandPalette';
import { TabType, Ticket } from './types';
import { 
  fetchSupabaseTickets, 
  createSupabaseTicket, 
  updateSupabaseTicketStatus,
  subscribeToSupabaseRealtime,
  isSupabaseConfigured
} from './lib/supabase';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Tickets State - Live from Supabase
  const [ticketsList, setTicketsList] = useState<Ticket[]>([]);

  const loadProductionTickets = async () => {
    if (isSupabaseConfigured) {
      const data = await fetchSupabaseTickets();
      setTicketsList(data);
    }
  };

  // 1. Initial Fetch on Mount
  // 2. Realtime WebSocket Listener: Auto-syncs any insert/update across connected browsers
  useEffect(() => {
    loadProductionTickets();

    if (isSupabaseConfigured) {
      const unsubscribe = subscribeToSupabaseRealtime(() => {
        loadProductionTickets();
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      title,
      description,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCreateTicket = async (newTicketData: Partial<Ticket>) => {
    const id = `TCK-${Math.floor(1001 + Math.random() * 9000)}`;
    const created: Ticket = {
      id,
      customerName: newTicketData.customerName || 'Customer',
      customerAvatar: newTicketData.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      channel: newTicketData.channel || 'WhatsApp',
      subject: newTicketData.subject || 'Support Case',
      status: 'Open',
      priority: newTicketData.priority || 'Medium',
      createdAt: 'Just now',
      assignedTo: newTicketData.assignedTo || 'Sarah Jenkins'
    };

    // Optimistic UI update
    setTicketsList((prev) => [created, ...prev]);

    // Permanent Supabase DB Persistence
    if (isSupabaseConfigured) {
      const synced = await createSupabaseTicket(created);
      if (synced) {
        showToast('Saved to Supabase DB', `Ticket ${id} permanently created in PostgreSQL.`, 'success');
      } else {
        showToast('Local Saved', `Ticket ${id} created in memory.`, 'info');
      }
    } else {
      showToast('Ticket Created', `Ticket ${id} added to workspace.`, 'success');
    }
  };

  const handleUpdateTicketStatus = async (id: string, status: Ticket['status']) => {
    // Optimistic UI update
    setTicketsList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );

    // Permanent Supabase DB Update
    if (isSupabaseConfigured) {
      const updated = await updateSupabaseTicketStatus(id, status);
      if (updated) {
        showToast('Realtime DB Sync', `Ticket ${id} status permanently set to ${status}.`, 'success');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* 4-Option Light Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadCount={0}
        openTicketCount={ticketsList.filter(t => t.status !== 'Resolved').length}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <Header 
          activeTab={activeTab} 
          onNewTicketClick={() => setIsNewTicketModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onShowToast={showToast}
              onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
              ticketsCount={ticketsList.length}
            />
          )}
          {activeTab === 'omnichannel' && (
            <OmnichannelView 
              onShowToast={showToast}
              onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
            />
          )}
          {activeTab === 'tickets' && (
            <TicketsView 
              onNewTicketClick={() => setIsNewTicketModalOpen(true)}
              onShowToast={showToast}
              ticketsList={ticketsList}
              onUpdateTicketStatus={handleUpdateTicketStatus}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsView 
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global SaaS Overlay Components */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <NewTicketModal 
        isOpen={isNewTicketModalOpen} 
        onClose={() => setIsNewTicketModalOpen(false)} 
        onCreate={handleCreateTicket} 
      />
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
      />
    </div>
  );
}

export default App;
