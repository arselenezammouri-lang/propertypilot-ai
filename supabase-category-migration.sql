-- =====================================================
-- PROPILOT AI - TRIPLE-THREAT CATEGORY SUPPORT
-- Migration SQL for Property Categories
-- =====================================================

-- Aggiungi colonna category alla tabella external_listings
ALTER TABLE public.external_listings
ADD COLUMN IF NOT EXISTS category VARCHAR(20) DEFAULT 'RESIDENTIAL_SALE'
CHECK (category IN ('RESIDENTIAL_SALE', 'RESIDENTIAL_RENT', 'COMMERCIAL'));

-- Aggiungi indice per performance
CREATE INDEX IF NOT EXISTS idx_external_listings_category ON public.external_listings(category);
CREATE INDEX IF NOT EXISTS idx_external_listings_category_user ON public.external_listings(user_id, category);

-- Aggiungi colonna per valore stimato (per calcolo Expected Yield)
ALTER TABLE public.external_listings
ADD COLUMN IF NOT EXISTS estimated_value NUMERIC(12, 2);

-- Commenti
COMMENT ON COLUMN public.external_listings.category IS 'Categoria immobiliare: RESIDENTIAL_SALE, RESIDENTIAL_RENT, COMMERCIAL';
COMMENT ON COLUMN public.external_listings.estimated_value IS 'Valore stimato per calcolo Expected Yield (affitti) o Market Gap (vendite)';

