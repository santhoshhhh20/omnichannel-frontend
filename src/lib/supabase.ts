/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Ticket } from '../types';

export const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mtwmpikzyuiimivdplyy.supabase.co';

export const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_UeSklw0bHzM4jAuw9oyJFA_BMeo_-mb';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ====================================================================
// SUPABASE TICKET CRUD API HELPERS
// ====================================================================

export async function fetchSupabaseTickets(): Promise<Ticket[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return null;
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
    console.warn('Supabase connection exception:', err);
    return null;
  }
}

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
      console.warn('Supabase insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase insert exception:', err);
    return false;
  }
}

export async function updateSupabaseTicketStatus(id: string, status: Ticket['status']): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.warn('Supabase update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update exception:', err);
    return false;
  }
}
