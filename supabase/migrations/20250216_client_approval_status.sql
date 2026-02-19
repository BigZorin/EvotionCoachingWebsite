-- ============================================================
-- Client Approval Status
-- Adds approval workflow: pending → approved / rejected
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS client_status TEXT DEFAULT 'pending'
    CHECK (client_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status_updated_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_client_status ON profiles(client_status);

-- Mark existing active clients as approved (anyone with check-ins)
-- Cast to text to handle UUID/text type mismatch between tables
UPDATE profiles SET client_status = 'approved'
WHERE client_status = 'pending'
  AND (
    user_id::text IN (SELECT DISTINCT user_id::text FROM check_ins)
    OR user_id::text IN (SELECT DISTINCT user_id::text FROM daily_check_ins)
  );
