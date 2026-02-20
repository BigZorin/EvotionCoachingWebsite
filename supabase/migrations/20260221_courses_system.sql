-- ============================================================
-- COURSES SYSTEM: E-learning voor clienten
-- ============================================================

-- Courses (coach/admin aangemaakt)
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_courses_coach ON courses(coach_id);
CREATE INDEX idx_courses_status ON courses(status);

-- Course modules (hoofdstukken)
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_course_modules_course ON course_modules(course_id);

-- Course lessons (individuele lessen)
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'quiz')),
  content_url TEXT,
  content_text TEXT,
  duration TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_course_lessons_module ON course_lessons(module_id);

-- Course enrollments (client inschrijvingen)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  progress_percent INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, client_id)
);

CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_course_enrollments_client ON course_enrollments(client_id);

-- Lesson progress (per les per client)
CREATE TABLE IF NOT EXISTS course_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(enrollment_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_enrollment ON course_lesson_progress(enrollment_id);

-- RLS Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Service role bypass (for server actions)
DROP POLICY IF EXISTS "Service role courses" ON courses;
CREATE POLICY "Service role courses" ON courses FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role modules" ON course_modules;
CREATE POLICY "Service role modules" ON course_modules FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role lessons" ON course_lessons;
CREATE POLICY "Service role lessons" ON course_lessons FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role enrollments" ON course_enrollments;
CREATE POLICY "Service role enrollments" ON course_enrollments FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role lesson progress" ON course_lesson_progress;
CREATE POLICY "Service role lesson progress" ON course_lesson_progress FOR ALL USING (auth.role() = 'service_role');

-- Coaches manage own courses
DROP POLICY IF EXISTS "Coaches manage own courses" ON courses;
CREATE POLICY "Coaches manage own courses" ON courses FOR ALL USING (coach_id = auth.uid());

-- Clients can view published courses they're enrolled in
DROP POLICY IF EXISTS "Clients view enrolled courses" ON courses;
CREATE POLICY "Clients view enrolled courses" ON courses FOR SELECT USING (
  status = 'published' AND id IN (
    SELECT course_id FROM course_enrollments WHERE client_id = auth.uid()
  )
);

-- Clients can view modules/lessons of enrolled courses
DROP POLICY IF EXISTS "Clients view modules" ON course_modules;
CREATE POLICY "Clients view modules" ON course_modules FOR SELECT USING (
  course_id IN (SELECT course_id FROM course_enrollments WHERE client_id = auth.uid())
);

DROP POLICY IF EXISTS "Clients view lessons" ON course_lessons;
CREATE POLICY "Clients view lessons" ON course_lessons FOR SELECT USING (
  module_id IN (
    SELECT id FROM course_modules WHERE course_id IN (
      SELECT course_id FROM course_enrollments WHERE client_id = auth.uid()
    )
  )
);

-- Clients manage own enrollments + progress
DROP POLICY IF EXISTS "Clients view own enrollments" ON course_enrollments;
CREATE POLICY "Clients view own enrollments" ON course_enrollments FOR SELECT USING (client_id = auth.uid());

DROP POLICY IF EXISTS "Clients manage own progress" ON course_lesson_progress;
CREATE POLICY "Clients manage own progress" ON course_lesson_progress FOR ALL USING (
  enrollment_id IN (SELECT id FROM course_enrollments WHERE client_id = auth.uid())
);
