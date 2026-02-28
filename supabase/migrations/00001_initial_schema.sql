-- ============================================================
-- VocabMaster Database Schema
-- ============================================================

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  native_language TEXT DEFAULT 'vi',
  daily_new_cards_limit INT DEFAULT 20,
  daily_review_limit INT DEFAULT 100,
  timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- 2. USER_STATS
CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_review_date DATE,
  total_reviews INT DEFAULT 0,
  total_cards_learned INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::JSONB,
  daily_goal INT DEFAULT 30,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 3. Auto-create profile and stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. DECKS
CREATE TABLE public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_preset BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  category TEXT,
  card_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_decks_user_id ON public.decks(user_id);
CREATE INDEX idx_decks_is_preset ON public.decks(is_preset) WHERE is_preset = TRUE;

ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own decks and preset decks"
  ON public.decks FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_preset = TRUE);

CREATE POLICY "Users can insert own decks"
  ON public.decks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_preset = FALSE);

CREATE POLICY "Users can update own decks"
  ON public.decks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND is_preset = FALSE);

CREATE POLICY "Users can delete own decks"
  ON public.decks FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND is_preset = FALSE);

-- 5. CARDS
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  example_sentence TEXT,
  pronunciation TEXT,
  audio_url TEXT,
  image_url TEXT,
  tags TEXT[],
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cards_deck_id ON public.cards(deck_id);

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.owns_deck(deck_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.decks
    WHERE id = deck_uuid AND (user_id = auth.uid() OR is_preset = TRUE)
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Users can view cards in own or preset decks"
  ON public.cards FOR SELECT TO authenticated
  USING (public.owns_deck(deck_id));

CREATE POLICY "Users can insert cards in own decks"
  ON public.cards FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.decks WHERE id = deck_id AND user_id = auth.uid() AND is_preset = FALSE
  ));

CREATE POLICY "Users can update cards in own decks"
  ON public.cards FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.decks WHERE id = deck_id AND user_id = auth.uid() AND is_preset = FALSE
  ));

CREATE POLICY "Users can delete cards in own decks"
  ON public.cards FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.decks WHERE id = deck_id AND user_id = auth.uid() AND is_preset = FALSE
  ));

-- 6. CARD_PROGRESS (SRS state)
CREATE TABLE public.card_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  ease_factor REAL DEFAULT 2.5,
  interval INT DEFAULT 0,
  repetitions INT DEFAULT 0,
  next_review TIMESTAMPTZ DEFAULT now(),
  last_reviewed TIMESTAMPTZ,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'review', 'graduated')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, card_id)
);

CREATE INDEX idx_card_progress_user_review ON public.card_progress(user_id, next_review);
CREATE INDEX idx_card_progress_user_status ON public.card_progress(user_id, status);

ALTER TABLE public.card_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own card progress"
  ON public.card_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own card progress"
  ON public.card_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own card progress"
  ON public.card_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 7. REVIEW_LOGS (append-only audit)
CREATE TABLE public.review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES public.decks(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 4),
  ease_factor_before REAL,
  ease_factor_after REAL,
  interval_before INT,
  interval_after INT,
  review_duration_ms INT,
  quiz_mode TEXT DEFAULT 'flashcard',
  reviewed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_review_logs_user_date ON public.review_logs(user_id, reviewed_at);

ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own review logs"
  ON public.review_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own review logs"
  ON public.review_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 8. ACHIEVEMENTS
CREATE TABLE public.achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  xp_reward INT DEFAULT 0,
  condition JSONB NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT TO authenticated
  USING (TRUE);

-- 9. DATABASE FUNCTIONS

-- Get review heatmap data
CREATE OR REPLACE FUNCTION public.get_review_heatmap(
  p_user_id UUID,
  p_days INT DEFAULT 365
)
RETURNS TABLE (review_date DATE, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(reviewed_at) AS review_date,
    COUNT(*) AS review_count
  FROM public.review_logs
  WHERE user_id = p_user_id
    AND reviewed_at >= now() - (p_days || ' days')::INTERVAL
  GROUP BY DATE(reviewed_at)
  ORDER BY review_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 10. SEED ACHIEVEMENTS
INSERT INTO public.achievements (id, name, description, xp_reward, condition) VALUES
  ('first_review', 'Bước đầu tiên', 'Hoàn thành bài ôn tập đầu tiên', 10, '{"type": "total_reviews", "value": 1}'),
  ('streak_3', 'Ổn định', 'Đạt streak 3 ngày liên tục', 25, '{"type": "streak", "value": 3}'),
  ('streak_7', 'Kiên trì', 'Đạt streak 7 ngày liên tục', 50, '{"type": "streak", "value": 7}'),
  ('streak_30', 'Không gì cản nổi', 'Đại streak 30 ngày liên tục', 200, '{"type": "streak", "value": 30}'),
  ('cards_50', 'Người học chăm chỉ', 'Học được 50 từ', 30, '{"type": "cards_learned", "value": 50}'),
  ('cards_100', 'Kho từ vựng', 'Học được 100 từ', 75, '{"type": "cards_learned", "value": 100}'),
  ('cards_500', 'Từ điển sống', 'Học được 500 từ', 300, '{"type": "cards_learned", "value": 500}'),
  ('cards_1000', 'Bậc thầy', 'Học được 1000 từ', 500, '{"type": "cards_learned", "value": 1000}'),
  ('level_5', 'Đẳng cấp', 'Đạt level 5', 50, '{"type": "level", "value": 5}'),
  ('level_10', 'Chuyên gia', 'Đạt level 10', 150, '{"type": "level", "value": 10}'),
  ('perfect_session', 'Hoàn hảo', 'Hoàn thành 1 phiên ôn tập với 100% chính xác', 50, '{"type": "perfect_session", "value": 1}'),
  ('speed_demon', 'Thần tốc', 'Ôn tập 50 thẻ trong 1 phiên', 75, '{"type": "session_cards", "value": 50}');
