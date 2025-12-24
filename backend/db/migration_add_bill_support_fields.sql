-- Migration: Add support tracking fields to bill_supports table
-- Date: 2024-12-24
-- Description: Adds supported_amount, supported_by_count, and is_public fields to track bill support contributions

-- Add new columns
ALTER TABLE bill_supports 
ADD COLUMN IF NOT EXISTS supported_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS supported_by_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true NOT NULL;

-- Add check constraint for supported_amount
ALTER TABLE bill_supports 
ADD CONSTRAINT check_supported_amount_non_negative 
CHECK (supported_amount >= 0);

-- Add check constraint for supported_by_count
ALTER TABLE bill_supports 
ADD CONSTRAINT check_supported_by_count_non_negative 
CHECK (supported_by_count >= 0);

-- Create index for is_public and status (for public bill queries)
CREATE INDEX IF NOT EXISTS idx_bill_supports_public_status 
ON bill_supports(is_public, status) 
WHERE is_public = true AND status = 'pending';

-- Create index for supported_amount (for sorting)
CREATE INDEX IF NOT EXISTS idx_bill_supports_supported_amount 
ON bill_supports(supported_amount);

-- Create bill_support_transactions table
CREATE TABLE IF NOT EXISTS bill_support_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_support_id UUID NOT NULL REFERENCES bill_supports(id) ON DELETE CASCADE,
    supporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'direct' CHECK (payment_method IN ('golbucks', 'direct', 'other')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure a user can only support a bill once
    UNIQUE(bill_support_id, supporter_id)
);

-- Create indexes for bill_support_transactions
CREATE INDEX IF NOT EXISTS idx_bill_support_transactions_bill_id 
ON bill_support_transactions(bill_support_id);

CREATE INDEX IF NOT EXISTS idx_bill_support_transactions_supporter_id 
ON bill_support_transactions(supporter_id);

CREATE INDEX IF NOT EXISTS idx_bill_support_transactions_status 
ON bill_support_transactions(status);

CREATE INDEX IF NOT EXISTS idx_bill_support_transactions_created_at 
ON bill_support_transactions(created_at);

-- Add updated_at trigger for bill_support_transactions
CREATE TRIGGER update_bill_support_transactions_updated_at 
BEFORE UPDATE ON bill_support_transactions
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE bill_support_transactions IS 'Tracks individual contributions to bill supports';
COMMENT ON COLUMN bill_support_transactions.bill_support_id IS 'The bill being supported';
COMMENT ON COLUMN bill_support_transactions.supporter_id IS 'User who is supporting the bill';
COMMENT ON COLUMN bill_support_transactions.amount IS 'Amount contributed by supporter';
COMMENT ON COLUMN bill_support_transactions.payment_method IS 'How the supporter paid (golbucks, direct, other)';
COMMENT ON COLUMN bill_supports.supported_amount IS 'Total amount supported by all users';
COMMENT ON COLUMN bill_supports.supported_by_count IS 'Number of users who supported this bill';
COMMENT ON COLUMN bill_supports.is_public IS 'Whether this bill is visible to other users for support';

