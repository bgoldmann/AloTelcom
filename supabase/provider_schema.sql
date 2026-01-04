-- Provider Integration Schema
-- Phase 1: Foundation - Multi-Provider Support
-- Created: January 2025

-- Provider tracking table
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'redtea', 'telnyx', 'esimgo'
  type VARCHAR(20) NOT NULL, -- 'esim', 'communication'
  tier INTEGER NOT NULL, -- 1 = primary, 2 = backup
  status VARCHAR(20) NOT NULL DEFAULT 'inactive', -- 'active', 'inactive', 'maintenance'
  config JSONB DEFAULT '{}',
  api_key_encrypted TEXT, -- Encrypted API keys
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT providers_type_check CHECK (type IN ('esim', 'communication')),
  CONSTRAINT providers_status_check CHECK (status IN ('active', 'inactive', 'maintenance'))
);

-- Provider country mapping
CREATE TABLE IF NOT EXISTS public.provider_countries (
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  country_code VARCHAR(3) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 999, -- Lower = higher priority
  cost_per_gb DECIMAL(10,2),
  activation_fee DECIMAL(10,2),
  coverage_data JSONB DEFAULT '{}', -- Network operators, 5G support, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (provider_id, country_code)
);

-- Provider performance metrics
CREATE TABLE IF NOT EXISTS public.provider_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_orders INTEGER DEFAULT 0,
  successful_orders INTEGER DEFAULT 0,
  failed_orders INTEGER DEFAULT 0,
  avg_activation_time INTEGER, -- in seconds
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  profit_margin DECIMAL(5,2), -- percentage
  api_response_time_avg INTEGER, -- in milliseconds
  error_rate DECIMAL(5,2), -- percentage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, date)
);

-- Extend orders table with provider tracking
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS primary_provider_id UUID REFERENCES public.providers(id),
ADD COLUMN IF NOT EXISTS backup_provider_id UUID REFERENCES public.providers(id),
ADD COLUMN IF NOT EXISTS actual_provider_id UUID REFERENCES public.providers(id),
ADD COLUMN IF NOT EXISTS provider_order_id VARCHAR(255), -- Provider's external order ID
ADD COLUMN IF NOT EXISTS failover_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS provider_selection_reason TEXT,
ADD COLUMN IF NOT EXISTS provider_metadata JSONB DEFAULT '{}'; -- Additional provider-specific data

-- Provider webhook events log
CREATE TABLE IF NOT EXISTS public.provider_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES public.orders(id),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_type ON public.providers(type);
CREATE INDEX IF NOT EXISTS idx_providers_status ON public.providers(status);
CREATE INDEX IF NOT EXISTS idx_providers_tier ON public.providers(tier);
CREATE INDEX IF NOT EXISTS idx_provider_countries_provider ON public.provider_countries(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_countries_country ON public.provider_countries(country_code);
CREATE INDEX IF NOT EXISTS idx_provider_countries_active ON public.provider_countries(is_active);
CREATE INDEX IF NOT EXISTS idx_provider_metrics_provider_date ON public.provider_metrics(provider_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON public.orders(actual_provider_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider_order_id ON public.orders(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_provider_webhooks_provider ON public.provider_webhooks(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_webhooks_order ON public.provider_webhooks(order_id);
CREATE INDEX IF NOT EXISTS idx_provider_webhooks_processed ON public.provider_webhooks(processed);

-- Enable RLS
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for providers (admin only for now)
CREATE POLICY "Admins can manage providers"
  ON public.providers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage provider countries"
  ON public.provider_countries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view provider metrics"
  ON public.provider_metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert provider metrics"
  ON public.provider_metrics
  FOR INSERT
  WITH CHECK (true); -- Allow system inserts

CREATE POLICY "System can manage webhooks"
  ON public.provider_webhooks
  FOR ALL
  USING (true); -- Allow webhook processing

-- Insert initial provider records (will be activated when credentials are added)
INSERT INTO public.providers (name, type, tier, status) VALUES
  ('redtea', 'esim', 1, 'inactive'),
  ('telnyx', 'communication', 1, 'inactive'),
  ('airalo', 'esim', 2, 'inactive'),
  ('vpn', 'vpn', 1, 'inactive'),
  ('esimgo', 'esim', 2, 'inactive')
ON CONFLICT (name) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.providers IS 'Provider registry for multi-provider orchestration';
COMMENT ON TABLE public.provider_countries IS 'Country coverage mapping for each provider';
COMMENT ON TABLE public.provider_metrics IS 'Daily performance metrics for providers';
COMMENT ON TABLE public.provider_webhooks IS 'Webhook events log from providers';
COMMENT ON COLUMN public.orders.provider_order_id IS 'External order ID from provider (e.g., Redtea Mobile order ID)';
COMMENT ON COLUMN public.orders.failover_count IS 'Number of times order failed over to backup provider';
COMMENT ON COLUMN public.orders.provider_selection_reason IS 'Reason why this provider was selected';

