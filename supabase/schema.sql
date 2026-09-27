-- ====================================================================
-- SYNC X PRODUCTION SUPABASE DATABASE SCHEMA
-- Copy and run this script in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/mtwmpikzyuiimivdplyy/sql)
-- ====================================================================

-- 1. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_avatar TEXT,
    channel TEXT NOT NULL DEFAULT 'WhatsApp',
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open',
    priority TEXT NOT NULL DEFAULT 'Medium',
    assigned_to TEXT NOT NULL DEFAULT 'Sarah Jenkins',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_name TEXT NOT NULL,
    customer_avatar TEXT,
    channel TEXT NOT NULL DEFAULT 'WhatsApp',
    last_msg TEXT,
    unread BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    conversation_id TEXT REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'customer' or 'agent'
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent duplicate errors
DROP POLICY IF EXISTS "Allow public read tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow public insert tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow public update tickets" ON public.tickets;

DROP POLICY IF EXISTS "Allow public read conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public insert conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public update conversations" ON public.conversations;

DROP POLICY IF EXISTS "Allow public read messages" ON public.messages;
DROP POLICY IF EXISTS "Allow public insert messages" ON public.messages;

-- 6. Create Permissive Policies for Web & API Access
CREATE POLICY "Allow public read tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tickets" ON public.tickets FOR UPDATE USING (true);

CREATE POLICY "Allow public read conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update conversations" ON public.conversations FOR UPDATE USING (true);

CREATE POLICY "Allow public read messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 7. High Performance Query Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_channel ON public.tickets(channel);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON public.tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
