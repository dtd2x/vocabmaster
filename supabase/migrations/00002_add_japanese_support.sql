-- ============================================================
-- Japanese Language Support Migration
-- ============================================================

-- 1. Add language column to decks (default 'en' for backward compatibility)
ALTER TABLE public.decks ADD COLUMN language TEXT DEFAULT 'en' NOT NULL;
CREATE INDEX idx_decks_language ON public.decks(language);

-- 2. Add extra_fields JSONB to cards for language-specific data (hiragana, katakana, jlpt_level)
ALTER TABLE public.cards ADD COLUMN extra_fields JSONB DEFAULT '{}'::JSONB;

-- 3. Ensure all existing decks are marked as English
UPDATE public.decks SET language = 'en' WHERE language IS NULL;
