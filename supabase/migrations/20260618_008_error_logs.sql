
CREATE TABLE public.error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'error' CHECK (char_length(level) <= 20),
  message TEXT NOT NULL CHECK (char_length(message) <= 2000),
  stack TEXT CHECK (stack IS NULL OR char_length(stack) <= 10000),
  route TEXT CHECK (route IS NULL OR char_length(route) <= 500),
  url TEXT CHECK (url IS NULL OR char_length(url) <= 2000),
  user_agent TEXT CHECK (user_agent IS NULL OR char_length(user_agent) <= 500),
  user_id UUID,
  context JSONB CHECK (context IS NULL OR pg_column_size(context) <= 8192),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.error_logs TO authenticated;
GRANT SELECT ON public.error_logs TO authenticated;
GRANT ALL ON public.error_logs TO service_role;

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert logs; user_id must match their own uid or be omitted
CREATE POLICY "Authenticated users can insert error logs"
  ON public.error_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Authenticated users can only read their own logs (admins use service_role via SQL)
CREATE POLICY "Users read own error logs"
  ON public.error_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_error_logs_created_at ON public.error_logs (created_at DESC);
CREATE INDEX idx_error_logs_route ON public.error_logs (route);
