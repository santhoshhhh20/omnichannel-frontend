import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Mail,
  Smartphone,
  Globe,
  Send as TelegramIcon,
  Instagram,
  Ticket as TicketIcon,
  X,
  TestTube
} from 'lucide-react';
import { Ticket } from '../types';

interface TicketsViewProps {
  onNewTicketClick?: () => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  ticketsList: Ticket[];
  onUpdateTicketStatus: (id: string, status: Ticket['status']) => void;
  onSeedDemoData?: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ 
  onNewTicketClick, 
  onShowToast,
  ticketsList,
  onUpdateTicketStatus,
  onSeedDemoData
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = ticketsList.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesQuery = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getPriorityStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Low': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyle = (status: Ticket['status']) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved': return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const handleStatusChange = (status: Ticket['status']) => {
    if (selectedTicket) {
      onUpdateTicketStatus(selectedTicket.id, status);
      setSelectedTicket({ ...selectedTicket, status });
      onShowToast?.('Status Updated', `Ticket ${selectedTicket.id} status changed to ${status}`, 'success');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Open', 'In Progress', 'Pending', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer or topic..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            />
          </div>
          {onSeedDemoData && (
            <button
              onClick={onSeedDemoData}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1"
            >
              <TestTube className="w-3.5 h-3.5 text-indigo-600" />
              <span>Test Demo</span>
            </button>
          )}
          <button 
            onClick={onNewTicketClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        {filteredTickets.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-50/40">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
              <TicketIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">No Support Tickets Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {ticketsList.length === 0 
                  ? "Your Sync X ticket queue is empty. Click 'Create Ticket' or 'Test Demo' to add test data."
                  : "No tickets match your current filter criteria."}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              {onSeedDemoData && (
                <button
                  onClick={onSeedDemoData}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <TestTube className="w-4 h-4 text-indigo-600" />
                  <span>Load Test Demo Data</span>
                </button>
              )}
              <button
                onClick={onNewTicketClick}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                + Create Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Ticket ID</th>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-5">Subject</th>
                  <th className="py-3.5 px-5">Channel</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Assigned To</th>
                  <th className="py-3.5 px-5 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-5 font-mono font-bold text-indigo-600 group-hover:text-indigo-700">
                      {ticket.id}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-2.5">
                        <img 
                          src={ticket.customerAvatar} 
                          alt={ticket.customerName}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-black/5" 
                        />
                        <span className="font-bold text-slate-900">{ticket.customerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 max-w-xs truncate text-slate-700 font-medium">
                      {ticket.subject}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center space-x-1.5 text-slate-600 font-medium">
                        {ticket.channel === 'WhatsApp' ? <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> :
                         ticket.channel === 'Telegram' ? <TelegramIcon className="w-3.5 h-3.5 text-sky-600" /> :
                         ticket.channel === 'Email' ? <Mail className="w-3.5 h-3.5 text-blue-600" /> :
                         ticket.channel === 'Web Chat' ? <Globe className="w-3.5 h-3.5 text-amber-600" /> :
                         <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                        <span>{ticket.channel}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getPriorityStyle(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-medium">
                      {ticket.assignedTo}
                    </td>
                    <td className="py-4 px-5 text-right text-slate-400 font-mono">
                      {ticket.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details Side Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600">{selectedTicket.id}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedTicket.customerName}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)} 
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</span>
                  <p className="text-xs font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {selectedTicket.subject}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Source Channel</span>
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
                      {selectedTicket.channel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority</span>
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold border ${getPriorityStyle(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Update Status</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Open', 'In Progress', 'Pending', 'Resolved'] as Ticket['status'][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:shadow-xs cursor-pointer ${
                          selectedTicket.status === st
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Mark {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
