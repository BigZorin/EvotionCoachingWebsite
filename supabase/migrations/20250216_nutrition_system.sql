-- ============================================
-- Nutrition System: recipes, meal plans, assignments
-- ============================================

-- ========== DROP OLD PRISMA TABLES ==========
-- Prisma created meal_plans/meals/_MealPlanMeals with TEXT ids.
-- We replace them with UUID-based tables + proper RLS.
DROP TABLE IF EXISTS "_MealPlanMeals" CASCADE;
DROP TABLE IF EXISTS "meals" CASCADE;
DROP TABLE IF EXISTS "meal_plans" CASCADE;

-- ========== CREATE ALL TABLES FIRST ==========

-- 1. RECIPES
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'spoonacular')),
  source_id TEXT,
  servings INT DEFAULT 1,
  prep_time_min INT,
  cook_time_min INT,
  calories INT,
  protein_grams INT,
  carbs_grams INT,
  fat_grams INT,
  instructions TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_coach ON recipes(coach_id);
CREATE INDEX IF NOT EXISTS idx_recipes_source ON recipes(source, source_id) WHERE source_id IS NOT NULL;

-- 2. RECIPE INGREDIENTS
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC,
  unit TEXT,
  order_index INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);

-- 3. MEAL PLANS
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  daily_calories INT,
  protein_grams INT,
  carbs_grams INT,
  fat_grams INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_coach ON meal_plans(coach_id);

-- 4. MEAL PLAN ENTRIES (recipes per day/meal)
CREATE TABLE IF NOT EXISTS meal_plan_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK')),
  custom_title TEXT,
  custom_description TEXT,
  order_index INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_plan ON meal_plan_entries(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_recipe ON meal_plan_entries(recipe_id) WHERE recipe_id IS NOT NULL;

-- 5. CLIENT MEAL PLANS (assignments)
CREATE TABLE IF NOT EXISTS client_meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_meal_plans_client ON client_meal_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_client_meal_plans_plan ON client_meal_plans(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_client_meal_plans_coach ON client_meal_plans(coach_id);

-- ========== ENABLE RLS ON ALL TABLES ==========

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_meal_plans ENABLE ROW LEVEL SECURITY;

-- ========== RLS POLICIES ==========

-- RECIPES: coach full access
DROP POLICY IF EXISTS "Coaches manage own recipes" ON recipes;
CREATE POLICY "Coaches manage own recipes" ON recipes
  FOR ALL USING (auth.uid() = coach_id);

-- RECIPES: clients can view recipes in their active meal plans
DROP POLICY IF EXISTS "Clients view assigned recipes" ON recipes;
CREATE POLICY "Clients view assigned recipes" ON recipes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meal_plan_entries mpe
      JOIN client_meal_plans cmp ON cmp.meal_plan_id = mpe.meal_plan_id
      WHERE mpe.recipe_id = recipes.id
      AND cmp.client_id = auth.uid()
      AND cmp.is_active = true
    )
  );

-- RECIPE INGREDIENTS: coach access via recipe ownership
DROP POLICY IF EXISTS "Coaches manage recipe ingredients" ON recipe_ingredients;
CREATE POLICY "Coaches manage recipe ingredients" ON recipe_ingredients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_ingredients.recipe_id AND r.coach_id = auth.uid())
  );

-- RECIPE INGREDIENTS: clients view via assignment
DROP POLICY IF EXISTS "Clients view assigned recipe ingredients" ON recipe_ingredients;
CREATE POLICY "Clients view assigned recipe ingredients" ON recipe_ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meal_plan_entries mpe
      JOIN client_meal_plans cmp ON cmp.meal_plan_id = mpe.meal_plan_id
      WHERE mpe.recipe_id = recipe_ingredients.recipe_id
      AND cmp.client_id = auth.uid()
      AND cmp.is_active = true
    )
  );

-- MEAL PLANS: coach full access
DROP POLICY IF EXISTS "Coaches manage own meal plans" ON meal_plans;
CREATE POLICY "Coaches manage own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = coach_id);

-- MEAL PLANS: clients view assigned
DROP POLICY IF EXISTS "Clients view assigned meal plans" ON meal_plans;
CREATE POLICY "Clients view assigned meal plans" ON meal_plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_meal_plans cmp
      WHERE cmp.meal_plan_id = meal_plans.id
      AND cmp.client_id = auth.uid()
      AND cmp.is_active = true
    )
  );

-- MEAL PLAN ENTRIES: coach access via meal plan ownership
DROP POLICY IF EXISTS "Coaches manage meal plan entries" ON meal_plan_entries;
CREATE POLICY "Coaches manage meal plan entries" ON meal_plan_entries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM meal_plans mp WHERE mp.id = meal_plan_entries.meal_plan_id AND mp.coach_id = auth.uid())
  );

-- MEAL PLAN ENTRIES: clients view assigned
DROP POLICY IF EXISTS "Clients view assigned meal plan entries" ON meal_plan_entries;
CREATE POLICY "Clients view assigned meal plan entries" ON meal_plan_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_meal_plans cmp
      WHERE cmp.meal_plan_id = meal_plan_entries.meal_plan_id
      AND cmp.client_id = auth.uid()
      AND cmp.is_active = true
    )
  );

-- CLIENT MEAL PLANS: coach full access
DROP POLICY IF EXISTS "Coaches manage client meal plans" ON client_meal_plans;
CREATE POLICY "Coaches manage client meal plans" ON client_meal_plans
  FOR ALL USING (auth.uid() = coach_id);

-- CLIENT MEAL PLANS: clients view own
DROP POLICY IF EXISTS "Clients view own meal plan assignments" ON client_meal_plans;
CREATE POLICY "Clients view own meal plan assignments" ON client_meal_plans
  FOR SELECT USING (auth.uid() = client_id);

-- ========== TRIGGERS ==========

CREATE OR REPLACE FUNCTION update_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_recipes_updated_at ON recipes;
CREATE TRIGGER trigger_recipes_updated_at
  BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_recipes_updated_at();

CREATE OR REPLACE FUNCTION update_meal_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_meal_plans_updated_at ON meal_plans;
CREATE TRIGGER trigger_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_meal_plans_updated_at();
