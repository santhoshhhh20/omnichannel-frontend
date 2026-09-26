-- ====================================================================
-- SYNC X SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor to initialize DB.
-- ====================================================================

-- 1. Create enum types for ticket status, priority, and channels
CREATE TYPE channel_type AS ENUM ('WhatsApp', 'Telegram', 'Email', 'Web Chat', 'Instagram');
CREATE TYPE ticket_status AS ENUM ('Open', 'In Progress', 'Pending', 'Resolved');
CREATE TYPE ticket_priority AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- 2. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_avatar TEXT,
    channel channel_type NOT NULL DEFAULT 'WhatsApp',
    subject TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'Open',
    priority ticket_priority NOT NULL DEFAULT 'Medium',
    assigned_to TEXT NOT NULL DEFAULT 'Sarah Jenkins',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_avatar TEXT,
    channel channel_type NOT NULL DEFAULT 'WhatsApp',
    last_msg TEXT,
    unread BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'customer' or 'agent'
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for Public Access (or replace with authenticated policies)
CREATE POLICY "Allow public read access on tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on tickets" ON public.tickets FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on conversations" ON public.conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 7. Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_channel ON public.tickets(channel);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
