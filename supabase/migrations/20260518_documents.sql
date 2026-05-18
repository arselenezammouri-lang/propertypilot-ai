-- Document Intelligence: AI-powered document extraction with citations
-- Stores extracted documents with structured fields and source citations

CREATE TABLE IF NOT EXISTS extracted_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('mandate', 'energy_certificate', 'deed', 'id_document', 'other')),
  filename TEXT NOT NULL DEFAULT 'document',
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB NOT NULL DEFAULT '{}',
  citations JSONB NOT NULL DEFAULT '[]',
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0,
  language TEXT NOT NULL DEFAULT 'unknown',
  page_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_extracted_docs_user ON extracted_documents(user_id);
CREATE INDEX idx_extracted_docs_type ON extracted_documents(user_id, document_type);
CREATE INDEX idx_extracted_docs_created ON extracted_documents(user_id, created_at DESC);

-- RLS
ALTER TABLE extracted_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON extracted_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents"
  ON extracted_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON extracted_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Storage bucket for documents (run via Supabase dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
