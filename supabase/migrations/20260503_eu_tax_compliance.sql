-- PropertyPilot AI — EU Tax Compliance Fields
-- Run in Supabase SQL editor

-- Add VAT/tax fields to profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'vat_id') THEN
    ALTER TABLE profiles ADD COLUMN vat_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'vat_id_country') THEN
    ALTER TABLE profiles ADD COLUMN vat_id_country text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'vat_id_valid') THEN
    ALTER TABLE profiles ADD COLUMN vat_id_valid boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_name') THEN
    ALTER TABLE profiles ADD COLUMN business_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tax_address') THEN
    ALTER TABLE profiles ADD COLUMN tax_address jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_type') THEN
    ALTER TABLE profiles ADD COLUMN account_type text DEFAULT 'individual'; -- individual | business
  END IF;
END $$;

-- Payment failure tracking
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'payment_failed_count') THEN
    ALTER TABLE subscriptions ADD COLUMN payment_failed_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'payment_failed_at') THEN
    ALTER TABLE subscriptions ADD COLUMN payment_failed_at timestamptz;
  END IF;
END $$;
