
CREATE TABLE public.error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'error',
  message TEXT NOT NULL,
  stack TEXT,
  route TEXT,
  url TEXT,
  user_agent TEXT,
  user_id UUID,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.error_logs TO anon, authenticated;
GRANT SELECT ON public.error_logs TO authenticated;
GRANT ALL ON public.error_logs TO service_role;

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Anyone (signed in or not) can report an error log
CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can only read their own logs (admins use service_role via SQL)
CREATE POLICY "Users read own error logs"
  ON public.error_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_error_logs_created_at ON public.error_logs (created_at DESC);
CREATE INDEX idx_error_logs_route ON public.error_logs (route);
