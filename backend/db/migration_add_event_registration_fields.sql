-- Migration: Add personal information fields to event_registrations table
-- Date: 2025-01-XX

-- Add new columns to event_registrations table
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS tc_no VARCHAR(11),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comments
COMMENT ON COLUMN event_registrations.first_name IS 'Başvuru sahibinin adı';
COMMENT ON COLUMN event_registrations.last_name IS 'Başvuru sahibinin soyadı';
COMMENT ON COLUMN event_registrations.tc_no IS 'TC Kimlik Numarası';
COMMENT ON COLUMN event_registrations.phone IS 'Telefon numarası';
COMMENT ON COLUMN event_registrations.email IS 'E-posta adresi';
COMMENT ON COLUMN event_registrations.notes IS 'Ek notlar veya özel istekler';

-- Add index for TC number (if needed for lookups)
CREATE INDEX IF NOT EXISTS idx_event_registrations_tc_no ON event_registrations(tc_no);

