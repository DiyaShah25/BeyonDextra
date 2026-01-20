-- Add language column to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Create languages table
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  flag_emoji TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Languages are viewable by everyone' AND tablename = 'languages') THEN
    CREATE POLICY "Languages are viewable by everyone" ON public.languages FOR SELECT USING (true);
  END IF;
END $$;

-- Insert default languages
INSERT INTO public.languages (code, name, native_name, flag_emoji, is_active)
VALUES 
  ('en', 'English', 'English', '🇺🇸', true),
  ('es', 'Spanish', 'Español', '🇪🇸', true),
  ('fr', 'French', 'Français', '🇫🇷', true),
  ('de', 'German', 'Deutsch', '🇩🇪', true),
  ('pt', 'Portuguese', 'Português', '🇧🇷', true),
  ('zh', 'Chinese', '中文', '🇨🇳', true),
  ('ja', 'Japanese', '日本語', '🇯🇵', true),
  ('ko', 'Korean', '한국어', '🇰🇷', true),
  ('ar', 'Arabic', 'العربية', '🇸🇦', true),
  ('hi', 'Hindi', 'हिन्दी', '🇮🇳', true)
ON CONFLICT (code) DO NOTHING;