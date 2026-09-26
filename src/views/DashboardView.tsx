import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight,
  Zap,
  Mail,
  Smartphone,
  Globe,
  Send as TelegramIcon,
  Instagram,
  BarChart2,
  Inbox,
  TestTube
} from 'lucide-react';
import { MetricCard } from '../types';

interface DashboardViewProps {
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  onOpenNewTicket?: () => void;
  ticketsCount?: number;
  onSeedDemoData?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onShowToast, 
  onOpenNewTicket,
  ticketsCount = 0,
  onSeedDemoData
}) => {
  const [timeframe, setTimeframe] = useState('7d');

  const metrics: MetricCard[] = [
    {
      title: 'Total Open Tickets',
      value: `${ticketsCount}`,
      change: ticketsCount > 0 ? '+12.4%' : '0.0%',
      isPositive: true,
      period: 'live system state'
    },
    {
      title: 'Avg. First Response Time',
      value: ticketsCount > 0 ? '4m 18s' : '0m 00s',
      change: ticketsCount > 0 ? '-18.2%' : '0.0%',
      isPositive: true,
      period: 'improved speed'
    },
    {
      title: 'Omnichannel Messages',
      value: ticketsCount > 0 ? '1,420' : '0',
      change: ticketsCount > 0 ? '+24.1%' : '0.0%',
      isPositive: true,
      period: 'across 5 channels'
    },
    {
      title: 'Customer Satisfaction (CSAT)',
      value: '98.4%',
      change: '+2.1%',
      isPositive: true,
      period: 'baseline score'
    }
  ];

  const channelStats = [
    { name: 'WhatsApp Business', count: ticketsCount > 0 ? '450 msgs' : '0 msgs', percent: ticketsCount > 0 ? 35 : 0, icon: Smartphone, color: 'from-emerald-500 to-teal-600' },
    { name: 'Telegram Bot API', count: ticketsCount > 0 ? '380 msgs' : '0 msgs', percent: ticketsCount > 0 ? 25 : 0, icon: TelegramIcon, color: 'from-sky-500 to-blue-600' },
    { name: 'Support Email', count: ticketsCount > 0 ? '290 msgs' : '0 msgs', percent: ticketsCount > 0 ? 20 : 0, icon: Mail, color: 'from-blue-600 to-indigo-600' },
    { name: 'Web Live Chat', count: ticketsCount > 0 ? '180 msgs' : '0 msgs', percent: ticketsCount > 0 ? 12 : 0, icon: Globe, color: 'from-amber-500 to-orange-500' },
    { name: 'Instagram Direct', count: ticketsCount > 0 ? '120 msgs' : '0 msgs', percent: ticketsCount > 0 ? 8 : 0, icon: Instagram, color: 'from-pink-500 to-rose-600' }
  ];

  const handleExport = () => {
    onShowToast?.('Export Started', 'Sync X digest PDF report has been generated.', 'success');
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-900 p-7 shadow-lg shadow-indigo-600/10 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Sync X Engine Ready Across 5 Channels</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">Welcome to Sync X 👋</h3>
            <p className="text-indigo-100 text-sm max-w-xl font-normal leading-relaxed">
              Your omnichannel workspace is connected to WhatsApp, Telegram, Email, Web Chat, and Instagram.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              Export Report
            </button>
            <button 
              onClick={onOpenNewTicket}
              className="px-4 py-2.5 bg-indigo-500/30 hover:bg-indigo-500/40 text-white rounded-xl text-xs font-bold border border-white/20 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              + Create Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Metric Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            Key Performance Metrics
          </h4>
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {['today', '7d', '30d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  timeframe === t 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((card, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <TrendingUp className="w-3 h-3 text-slate-400" />
                  {card.change}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {card.value}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">{card.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Channel Volume Breakdown (5 Channels) */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Channel Volume</h4>
                <p className="text-xs text-slate-500">5 active channel streams</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                Live Data
              </span>
            </div>

            <div className="space-y-4">
              {channelStats.map((ch, idx) => {
                const Icon = ch.icon;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                        <Icon className="w-4 h-4 text-indigo-600" />
                        <span>{ch.name}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{ch.count} ({ch.percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${ch.color} rounded-full transition-all duration-500`}
                        style={{ width: `${ch.percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Capacity: <strong className="text-slate-800">100% Operational</strong></span>
            <button 
              onClick={() => onShowToast?.('Channel Manager', 'Opening channel capacity manager...', 'info')}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              Manager <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-slate-900 text-base">Live Activity Feed</h4>
              <p className="text-xs text-slate-500">Real-time team support actions in Sync X</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onSeedDemoData}
                className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
              >
                <TestTube className="w-3.5 h-3.5" />
                <span>Test UI Demo</span>
              </button>
              <button 
                onClick={() => onShowToast?.('Audit Log', 'Audit log loaded.', 'info')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
              >
                View Log
              </button>
            </div>
          </div>

          {ticketsCount === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h5 className="text-xs font-bold text-slate-800">No Recent Activity Logged</h5>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Click <strong>"Test UI Demo"</strong> above or <strong>"+ Create Ticket"</strong> to test live activity updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {[
                {
                  id: '1',
                  user: 'Sarah Jenkins',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
                  action: 'received ticket',
                  target: '#TCK-9012 (Enterprise Webhook Delivery Latency)',
                  time: '5 mins ago',
                  channel: 'WhatsApp'
                },
                {
                  id: '2',
                  user: 'David Chen',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
                  action: 'assigned ticket',
                  target: '#TCK-9011 (SSO SAML single sign-on setup)',
                  time: '18 mins ago',
                  channel: 'Telegram'
                },
                {
                  id: '3',
                  user: 'Alex Rivera',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
                  action: 'updated status to Pending',
                  target: '#TCK-9010 (Annual Subscription Invoice)',
                  time: '42 mins ago',
                  channel: 'Email'
                }
              ].map((act) => (
                <div 
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={act.avatar}
                      alt={act.user}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/5"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        <span>{act.user}</span>{' '}
                        <span className="text-slate-500 font-normal">{act.action}</span>
                      </p>
                      <p className="text-xs font-mono text-indigo-600 font-semibold mt-0.5 group-hover:text-indigo-700">{act.target}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 mb-1 shadow-2xs">
                      {act.channel}
                    </span>
                    <p className="text-[11px] text-slate-400 font-medium">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
