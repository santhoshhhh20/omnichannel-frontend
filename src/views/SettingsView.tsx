import React, { useState } from 'react';
import { 
  User, 
  Share2, 
  ShieldCheck, 
  Bell, 
  Save, 
  Check, 
  Smartphone, 
  Mail, 
  Globe, 
  ToggleLeft,
  ToggleRight,
  Copy,
  Key
} from 'lucide-react';

interface SettingsViewProps {
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'channels' | 'notifications' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  // Form states
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    onShowToast?.('Settings Saved', 'Sync X profile & preferences updated successfully.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText('YOUR_STITCH_API_KEY');
    onShowToast?.('API Key Copied', 'Stitch MCP API Key copied to your clipboard.', 'success');
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Settings Sub-navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
        {[
          { id: 'profile', label: 'Profile & Team', icon: User },
          { id: 'channels', label: 'Channel Integrations', icon: Share2 },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'security', label: 'API Keys & Security', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile & Team Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-2xs">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Account Information</h4>
            
            <div className="flex items-center space-x-6">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
              />
              <div className="space-y-2">
                <button 
                  type="button" 
                  onClick={() => onShowToast?.('Avatar Upload', 'Photo picker opened.', 'info')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-all hover:shadow-xs hover:-translate-y-0.5 cursor-pointer"
                >
                  Change Photo
                </button>
                <p className="text-[11px] text-slate-400 font-medium">JPG or PNG, max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  defaultValue="Sarah Jenkins"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email Address</label>
                <input
                  type="email"
                  defaultValue="sarah.jenkins@syncx.io"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Role Title</label>
                <input
                  type="text"
                  defaultValue="Head of Support Operations"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Timezone</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                  <option>UTC+05:30 (Asia/Kolkata)</option>
                  <option>UTC-05:00 (US Eastern Time)</option>
                  <option>UTC+00:00 (Greenwich Mean Time)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Saved Changes!' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          {[
            { name: 'WhatsApp Business API', type: 'Messaging', status: 'Connected', icon: Smartphone, color: 'text-emerald-600' },
            { name: 'Support Inbox (Email)', type: 'Email Gateway', status: 'Connected', icon: Mail, color: 'text-blue-600' },
            { name: 'Website Live Widget', type: 'Web Chat', status: 'Connected', icon: Globe, color: 'text-amber-600' },
            { name: 'Instagram Direct', type: 'Social', status: 'Disconnected', icon: Share2, color: 'text-pink-600' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                    <p className="text-[11px] text-slate-500 font-medium">{item.type}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    item.status === 'Connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                  <button 
                    onClick={() => onShowToast?.('Channel Config', `Configuring ${item.name}...`, 'info')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Alert Preferences</h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">Email Digest Notifications</p>
                <p className="text-[11px] text-slate-500 font-medium">Receive daily performance reports in your inbox.</p>
              </div>
              <button onClick={() => setEmailNotifs(!emailNotifs)} className="text-indigo-600 transition-transform active:scale-90">
                {emailNotifs ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">Slack Ticket Alerts</p>
                <p className="text-[11px] text-slate-500 font-medium">Ping #support-ops when high-priority tickets are created.</p>
              </div>
              <button onClick={() => setSlackNotifs(!slackNotifs)} className="text-indigo-600 transition-transform active:scale-90">
                {slackNotifs ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">Auto-Assign Tickets</p>
                <p className="text-[11px] text-slate-500 font-medium">Smart round-robin assignment based on agent load.</p>
              </div>
              <button onClick={() => setAutoAssign(!autoAssign)} className="text-indigo-600 transition-transform active:scale-90">
                {autoAssign ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Production API Keys</h4>
              <p className="text-xs text-slate-500 font-medium">Use these keys to connect custom webhooks and Stitch MCP tools.</p>
            </div>
            <button 
              onClick={() => onShowToast?.('Key Generated', 'A new secret key has been generated.', 'success')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              Generate New Secret
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" /> Live Stitch MCP Key
              </span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value="YOUR_STITCH_API_KEY"
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-indigo-700 font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyApiKey}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all hover:shadow-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                <span>Copy Key</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
