-- Drop existing table and recreate with new schema
DROP TABLE IF EXISTS diagnostics CASCADE;

-- Create diagnostics table with new schema
CREATE TABLE diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Individual scores (0-100)
  ux_research_score INTEGER NOT NULL DEFAULT 0,
  ui_design_score INTEGER NOT NULL DEFAULT 0,
  facilitation_score INTEGER NOT NULL DEFAULT 0,
  business_score INTEGER NOT NULL DEFAULT 0,
  data_score INTEGER NOT NULL DEFAULT 0,
  
  -- Total score
  total_score INTEGER NOT NULL DEFAULT 0,
  
  -- Diagnosis type (level)
  diagnosis_type TEXT NOT NULL DEFAULT '',
  
  -- Comments
  strength_comment TEXT NOT NULL DEFAULT '',
  improvement_comment TEXT NOT NULL DEFAULT '',
  
  -- Store all answers for reference
  answers JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous users (session_id based) - allow public access for now
CREATE POLICY "select_all_diagnostics" ON diagnostics FOR SELECT
  USING (true);

CREATE POLICY "insert_all_diagnostics" ON diagnostics FOR INSERT
  WITH CHECK (true);

-- Index for faster queries
CREATE INDEX idx_diagnostics_created_at ON diagnostics(created_at DESC);