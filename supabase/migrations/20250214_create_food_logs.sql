-- Food Logs: client-tracked daily food intake with barcode support

CREATE TABLE IF NOT EXISTS food_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_at TIMESTAMPTZ DEFAULT NOW(),

  meal_type TEXT NOT NULL CHECK (meal_type IN ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK')),
  food_name TEXT NOT NULL,

  -- Macros
  calories INT,
  protein_grams INT,
  carbs_grams INT,
  fat_grams INT,

  -- Serving
  serving_size NUMERIC,
  serving_unit TEXT,           -- e.g. 'g', 'ml', 'stuks', 'portie'
  number_of_servings NUMERIC DEFAULT 1,

  -- Source
  barcode TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'barcode', 'search')),

  -- Extra
  photo_url TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_food_logs_barcode ON food_logs(barcode) WHERE barcode IS NOT NULL;

-- RLS
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Clients manage their own food logs
CREATE POLICY "Users manage own food logs" ON food_logs
  FOR ALL USING (auth.uid() = user_id);

-- Coaches can view their clients' food logs
CREATE POLICY "Coaches view client food logs" ON food_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = food_logs.user_id
      AND p.coach_id = auth.uid()
    )
  );

-- Daily nutrition targets (set by coach per client)
CREATE TABLE IF NOT EXISTS nutrition_targets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  daily_calories INT,
  daily_protein_grams INT,
  daily_carbs_grams INT,
  daily_fat_grams INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for nutrition_targets
ALTER TABLE nutrition_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own targets" ON nutrition_targets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Coaches manage client targets" ON nutrition_targets
  FOR ALL USING (auth.uid() = coach_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_nutrition_targets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_nutrition_targets_updated_at
  BEFORE UPDATE ON nutrition_targets
  FOR EACH ROW
  EXECUTE FUNCTION update_nutrition_targets_updated_at();
