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
  isSupabaseConfigured
} from './lib/supabase';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Tickets State
  const [ticketsList, setTicketsList] = useState<Ticket[]>([]);

  // Load from Supabase on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchSupabaseTickets().then((data) => {
        if (data && data.length > 0) {
          setTicketsList(data);
          showToast('Supabase Connected', 'Loaded live tickets from PostgreSQL database.', 'success');
        }
      });
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

    setTicketsList((prev) => [created, ...prev]);

    if (isSupabaseConfigured) {
      const synced = await createSupabaseTicket(created);
      if (synced) {
        showToast('Synced to Supabase', `Ticket ${id} saved to PostgreSQL database.`, 'success');
      } else {
        showToast('Saved Locally', `Ticket ${id} created in workspace.`, 'info');
      }
    } else {
      showToast('Ticket Created', `Ticket ${id} added to Sync X workspace.`, 'success');
    }
  };

  const handleSeedDemoData = () => {
    const demoTickets: Ticket[] = [
      {
        id: 'TCK-9012',
        customerName: 'Acme Global Corp',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        channel: 'WhatsApp',
        subject: 'Enterprise API webhook delivery latency',
        status: 'Open',
        priority: 'Urgent',
        createdAt: '5 mins ago',
        assignedTo: 'Sarah Jenkins'
      },
      {
        id: 'TCK-9011',
        customerName: 'Elena Rostova',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
        channel: 'Telegram',
        subject: 'SSO SAML single sign-on setup inquiry',
        status: 'In Progress',
        priority: 'High',
        createdAt: '18 mins ago',
        assignedTo: 'David Chen'
      },
      {
        id: 'TCK-9010',
        customerName: 'TechCorp Solutions',
        customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
        channel: 'Email',
        subject: 'Annual subscription invoice tax ID update',
        status: 'Pending',
        priority: 'Medium',
        createdAt: '42 mins ago',
        assignedTo: 'Alex Rivera'
      }
    ];

    setTicketsList(demoTickets);
    showToast('Demo Data Loaded', 'Populated 3 test tickets for instant UI testing.', 'success');
  };

  const handleUpdateTicketStatus = async (id: string, status: Ticket['status']) => {
    setTicketsList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );

    if (isSupabaseConfigured) {
      await updateSupabaseTicketStatus(id, status);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* 4-Option Light Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadCount={ticketsList.length > 0 ? 3 : 0}
        openTicketCount={ticketsList.filter(t => t.status !== 'Resolved').length}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <Header 
          activeTab={activeTab} 
          onNewTicketClick={() => setIsNewTicketModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onSeedDemoData={handleSeedDemoData}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onShowToast={showToast}
              onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
              ticketsCount={ticketsList.length}
              onSeedDemoData={handleSeedDemoData}
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
              onSeedDemoData={handleSeedDemoData}
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
