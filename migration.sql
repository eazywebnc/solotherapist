-- ============================================
-- SoloTherapist — Database Migration
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
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  practice_name TEXT,
  timezone TEXT DEFAULT 'Pacific/Noumea',
  booking_url_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================
-- st_patients: patient profiles
-- ============================================
CREATE TABLE IF NOT EXISTS st_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  referral_source TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- st_appointments: session scheduling
-- ============================================
CREATE TABLE IF NOT EXISTS st_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES st_patients(id) ON DELETE SET NULL,
  date TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL DEFAULT 50, -- minutes
  type TEXT NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'group', 'video', 'initial_consult', 'follow_up')),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  video_room_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- st_notes: clinical session notes
-- ============================================
CREATE TABLE IF NOT EXISTS st_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES st_patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES st_appointments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'session' CHECK (type IN ('session', 'intake', 'progress', 'termination', 'supervision')),
  presenting_issues TEXT,
  interventions TEXT,
  plan TEXT,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- st_invoices: billing and payments
-- ============================================
CREATE TABLE IF NOT EXISTS st_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES st_patients(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES st_appointments(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  invoice_number TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE st_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE st_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE st_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE st_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE st_invoices ENABLE ROW LEVEL SECURITY;

-- st_settings
CREATE POLICY "Users can view own settings" ON st_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON st_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON st_settings FOR UPDATE USING (auth.uid() = user_id);

-- st_patients
CREATE POLICY "Users can view own patients" ON st_patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own patients" ON st_patients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own patients" ON st_patients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own patients" ON st_patients FOR DELETE USING (auth.uid() = user_id);

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

-- st_invoices
CREATE POLICY "Users can view own invoices" ON st_invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices" ON st_invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON st_invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON st_invoices FOR DELETE USING (auth.uid() = user_id);

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

CREATE TRIGGER st_patients_updated_at
  BEFORE UPDATE ON st_patients
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

CREATE TRIGGER st_appointments_updated_at
  BEFORE UPDATE ON st_appointments
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

CREATE TRIGGER st_notes_updated_at
  BEFORE UPDATE ON st_notes
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

CREATE TRIGGER st_invoices_updated_at
  BEFORE UPDATE ON st_invoices
  FOR EACH ROW EXECUTE FUNCTION update_st_updated_at();

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_st_patients_user_id ON st_patients(user_id);
CREATE INDEX IF NOT EXISTS idx_st_appointments_user_id ON st_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_st_appointments_date ON st_appointments(date);
CREATE INDEX IF NOT EXISTS idx_st_appointments_patient_id ON st_appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_st_notes_user_id ON st_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_st_notes_patient_id ON st_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_st_invoices_user_id ON st_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_st_invoices_patient_id ON st_invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_st_invoices_status ON st_invoices(status);
