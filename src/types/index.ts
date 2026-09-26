export type TabType = 'dashboard' | 'omnichannel' | 'tickets' | 'settings';

export type ChannelType = 'WhatsApp' | 'Telegram' | 'Email' | 'Web Chat' | 'Instagram';

export interface Ticket {
  id: string;
  customerName: string;
  customerAvatar: string;
  channel: ChannelType;
  subject: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  assignedTo: string;
}

export interface ChannelMetric {
  id: string;
  name: string;
  type: ChannelType;
  status: 'Connected' | 'Syncing' | 'Offline';
  unreadCount: number;
  avgResponseTime: string;
  satisfaction: number;
  iconName: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  channel?: string;
}
