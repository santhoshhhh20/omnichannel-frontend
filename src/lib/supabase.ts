/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Ticket } from '../types';

export const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mtwmpikzyuiimivdplyy.supabase.co';

export const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_UeSklw0bHzM4jAuw9oyJFA_BMeo_-mb';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// ====================================================================
// REALTIME & PERMANENT DB PERSISTENCE MODULE (SUPABASE)
// ====================================================================

/**
 * Fetch all tickets permanently stored in Supabase PostgreSQL
 */
export async function fetchSupabaseTickets(): Promise<Ticket[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase tickets fetch warning:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      customerName: row.customer_name,
      customerAvatar: row.customer_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      channel: row.channel,
      subject: row.subject,
      status: row.status,
      priority: row.priority,
      createdAt: row.created_at 
        ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now',
      assignedTo: row.assigned_to
    }));
  } catch (err) {
    console.error('Supabase tickets connection exception:', err);
    return [];
  }
}

/**
 * Permanently insert a new ticket into Supabase DB
 */
export async function createSupabaseTicket(ticket: Ticket): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('tickets').insert([
      {
        id: ticket.id,
        customer_name: ticket.customerName,
        customer_avatar: ticket.customerAvatar,
        channel: ticket.channel,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assignedTo
      }
    ]);

    if (error) {
      console.warn('Supabase ticket insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase ticket insert exception:', err);
    return false;
  }
}

/**
 * Permanently update ticket status in Supabase DB
 */
export async function updateSupabaseTicketStatus(id: string, status: Ticket['status']): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.warn('Supabase ticket status update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase status update exception:', err);
    return false;
  }
}

/**
 * Permanently fetch chat conversations from Supabase
 */
export async function fetchSupabaseConversations(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase conversations fetch error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase conversations exception:', err);
    return [];
  }
}

/**
 * Permanently send and insert a message into Supabase
 */
export async function sendSupabaseMessage(conversationId: string, sender: string, text: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('messages').insert([
      {
        conversation_id: conversationId,
        sender,
        text
      }
    ]);

    if (error) {
      console.warn('Supabase message insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase message insert exception:', err);
    return false;
  }
}

/**
 * Live Realtime Subscription Engine listening to DB mutations across clients
 */
export function subscribeToSupabaseRealtime(onTicketChange: () => void, onMessageChange?: () => void) {
  if (!supabase) return null;

  const ticketsChannel = supabase
    .channel('syncx-tickets-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
      onTicketChange();
    })
    .subscribe();

  const messagesChannel = supabase
    .channel('syncx-messages-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
      if (onMessageChange) onMessageChange();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(ticketsChannel);
    supabase.removeChannel(messagesChannel);
  };
}
