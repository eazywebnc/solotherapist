-- ============================================
-- SoloTherapist — Database Migration (v2)
-- Project: solotherapist
-- Supabase: mgiamamqrvfcfqzlqtcs (SaaS Factory)
-- Prefix: st_
-- ============================================

-- ============================================
-- st_settings: user settings / subscription
-- ============================================
CREATE TABLE IF NOT EXISTS st_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'solo', 'practice', 'premium')),
  practice_name TEXT,
  specialty TEXT,
  session_rate DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'EUR',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  timezone TEXT DEFAULT 'Pacific/Noumea',
  booking_url_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================
-- st_clients: client profiles
-- ============================================
CREATE TABLE IF NOT EXISTS st_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- st_appointments: session scheduling
-- ============================================
CREATE TABLE IF NOT EXISTS st_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES st_clients(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 50,
  type TEXT NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'group', 'video', 'initial_consult', 'follow_up')),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- st_notes: clinical session notes
-- ============================================
CREATE TABLE IF NOT EXISTS st_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES st_clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES st_appointments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  progress_rating INTEGER CHECK (progress_rating >= 1 AND progress_rating <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE st_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE st_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE st_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE st_notes ENABLE ROW LEVEL SECURITY;

-- st_settings
CREATE POLICY "Users can view own settings" ON st_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON st_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON st_settings FOR UPDATE USING (auth.uid() = user_id);

-- st_clients
CREATE POLICY "Users can view own clients" ON st_clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON st_clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON st_clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON st_clients FOR DELETE USING (auth.uid() = user_id);

-- st_appointments
CREATE POLICY "Users can view own appointments" ON st_appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON st_appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON st_appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON st_appointments FOR DELETE USING (auth.uid() = user_id);

-- st_notes
CREATE POLICY "Users can view own notes" ON st_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON st_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON st_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON st_notes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_st_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER st_settings_updated_at
  BEFORE UPDATE ON st_settings
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

CREATE TRIGGER st_clients_updated_at
  BEFORE UPDATE ON st_clients
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

CREATE TRIGGER st_appointments_updated_at
  BEFORE UPDATE ON st_appointments
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

CREATE TRIGGER st_notes_updated_at
  BEFORE UPDATE ON st_notes
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_st_clients_user_id ON st_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_st_clients_status ON st_clients(status);
CREATE INDEX IF NOT EXISTS idx_st_appointments_user_id ON st_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_st_appointments_date ON st_appointments(date);
CREATE INDEX IF NOT EXISTS idx_st_appointments_client_id ON st_appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_st_appointments_status ON st_appointments(status);
CREATE INDEX IF NOT EXISTS idx_st_notes_user_id ON st_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_st_notes_client_id ON st_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_st_notes_appointment_id ON st_notes(appointment_id);
