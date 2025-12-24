-- Migration: Add fcm_token field to users table
-- Run this if you have an existing database without fcm_token field

-- Add fcm_token column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Add comment
COMMENT ON COLUMN users.fcm_token IS 'Firebase Cloud Messaging token for push notifications';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'fcm_token field added to users table successfully!';
END $$;

