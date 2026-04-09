-- ─── CMS Tables ──────────────────────────────────────────────

-- 1. Media Library
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- image, video, document, other
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    folder TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Pages (Block-based system)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title JSONB NOT NULL, -- LocalizedString
    description JSONB, -- LocalizedString
    hero JSONB DEFAULT '{}',
    blocks JSONB DEFAULT '[]', -- Array of PageBlock
    seo JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft', -- draft, pending_approval, published, archived
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Menus
CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL, -- main, footer, header_top
    items JSONB DEFAULT '[]', -- Array of NavItem
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Settings
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name JSONB NOT NULL,
    logo TEXT,
    logo_footer TEXT,
    favicon TEXT,
    slogan JSONB,
    contact_emails TEXT[] DEFAULT '{}',
    contact_phones TEXT[] DEFAULT '{}',
    address JSONB DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    coordinates JSONB DEFAULT '{}',
    copyright JSONB NOT NULL,
    seo_global JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Enhancements to existing tables ───────────────────────

-- Ensure contents table has all necessary fields
-- (Assuming contents already exists with title, body, excerpt, category, tags, status)

-- Add missing columns to contents if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='priority') THEN
        ALTER TABLE public.contents ADD COLUMN priority TEXT DEFAULT 'normal';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='event_date') THEN
        ALTER TABLE public.contents ADD COLUMN event_date TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='event_end_date') THEN
        ALTER TABLE public.contents ADD COLUMN event_end_date TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='event_location') THEN
        ALTER TABLE public.contents ADD COLUMN event_location TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='images') THEN
        ALTER TABLE public.contents ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='external_link') THEN
        ALTER TABLE public.contents ADD COLUMN external_link TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='video_link') THEN
        ALTER TABLE public.contents ADD COLUMN video_link TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='expires_at') THEN
        ALTER TABLE public.contents ADD COLUMN expires_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contents' AND column_name='published_at') THEN
        ALTER TABLE public.contents ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
END $$;

-- ─── Security (RLS Policies) ───────────────────────────────

-- Enable RLS
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public can view published pages, menus and settings
CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public can view media" ON public.media_assets FOR SELECT USING (true);

-- Admins can do everything
-- (Replace 'authenticated' and check roles if possible, but basic authenticated can work if guarded by app logic)
CREATE POLICY "Authenticated users can manage all" ON public.media_assets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage pages" ON public.pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage menus" ON public.menus FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage settings" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
