-- Seed script for initial data
-- Run this after schema.sql to populate initial products

-- Insert sample products (eSIM Local)
INSERT INTO public.products (id, type, country, region, data, validity, price, flag, is_popular, description, operators, covered_countries) VALUES
('us-1gb', 'esim', 'United States', 'Americas', '1GB', '7 Days', 4.50, '🇺🇸', false, 'Stay connected in the United States with high-speed data.', 
 '[{"name": "AT&T", "type": "5G"}, {"name": "T-Mobile", "type": "5G"}]'::jsonb,
 '["United States"]'::jsonb),
('us-3gb', 'esim', 'United States', 'Americas', '3GB', '30 Days', 10.00, '🇺🇸', true, 'Stay connected in the United States with high-speed data.', 
 '[{"name": "AT&T", "type": "5G"}, {"name": "T-Mobile", "type": "5G"}]'::jsonb,
 '["United States"]'::jsonb),
('us-10gb', 'esim', 'United States', 'Americas', '10GB', '30 Days', 25.00, '🇺🇸', false, 'Stay connected in the United States with high-speed data.', 
 '[{"name": "AT&T", "type": "5G"}, {"name": "T-Mobile", "type": "5G"}]'::jsonb,
 '["United States"]'::jsonb),
('jp-1gb', 'esim', 'Japan', 'Asia', '1GB', '7 Days', 6.00, '🇯🇵', false, 'Stay connected in Japan with high-speed data.', 
 '[{"name": "SoftBank", "type": "LTE"}, {"name": "KDDI", "type": "5G"}]'::jsonb,
 '["Japan"]'::jsonb),
('jp-3gb', 'esim', 'Japan', 'Asia', '3GB', '30 Days', 12.00, '🇯🇵', true, 'Stay connected in Japan with high-speed data.', 
 '[{"name": "SoftBank", "type": "LTE"}, {"name": "KDDI", "type": "5G"}]'::jsonb,
 '["Japan"]'::jsonb),
('jp-10gb', 'esim', 'Japan', 'Asia', '10GB', '30 Days', 18.00, '🇯🇵', false, 'Stay connected in Japan with high-speed data.', 
 '[{"name": "SoftBank", "type": "LTE"}, {"name": "KDDI", "type": "5G"}]'::jsonb,
 '["Japan"]'::jsonb),
('tr-1gb', 'esim', 'Turkey', 'Middle East', '1GB', '7 Days', 4.00, '🇹🇷', false, 'Stay connected in Turkey with high-speed data.', 
 '[{"name": "Turkcell", "type": "LTE"}, {"name": "Vodafone TR", "type": "4G"}]'::jsonb,
 '["Turkey"]'::jsonb),
('tr-3gb', 'esim', 'Turkey', 'Middle East', '3GB', '30 Days', 12.00, '🇹🇷', true, 'Stay connected in Turkey with high-speed data.', 
 '[{"name": "Turkcell", "type": "LTE"}, {"name": "Vodafone TR", "type": "4G"}]'::jsonb,
 '["Turkey"]'::jsonb),
('tr-10gb', 'esim', 'Turkey', 'Middle East', '10GB', '30 Days', 30.00, '🇹🇷', false, 'Stay connected in Turkey with high-speed data.', 
 '[{"name": "Turkcell", "type": "LTE"}, {"name": "Vodafone TR", "type": "4G"}]'::jsonb,
 '["Turkey"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert VPN products
INSERT INTO public.products (id, type, country, region, data, validity, price, flag, is_popular, description, features) VALUES
('vpn-basic', 'vpn', 'Global Servers', 'Global', 'Standard Speed', '1 Month', 3.99, '🛡️', false, 'Basic protection for casual browsing.',
 '["3 Devices", "20+ Locations", "No Logs"]'::jsonb),
('vpn-pro', 'vpn', 'Global Servers', 'Global', 'High Speed', '1 Month', 7.99, '🛡️', true, 'Complete security suite for power users.',
 '["Unlimited Devices", "100+ Locations", "Ad Blocker", "Streaming Optimized"]'::jsonb),
('vpn-year', 'vpn', 'Global Servers', 'Global', 'High Speed', '1 Year', 49.99, '🛡️', false, 'Best value for long-term protection.',
 '["Unlimited Devices", "100+ Locations", "Ad Blocker", "2 Months Free"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert Number products
INSERT INTO public.products (id, type, country, region, data, validity, price, flag, description, features) VALUES
('num-us', 'number', 'United States', 'Americas', '+1 (Voice/SMS)', '30 Days', 5.00, '🇺🇸', 'Get a real US phone number for verification and calls.',
 '["Receive SMS", "Voicemail", "Call Forwarding"]'::jsonb),
('num-uk', 'number', 'United Kingdom', 'Europe', '+44 (Voice/SMS)', '30 Days', 6.50, '🇬🇧', 'UK Mobile number (+44) compatible with most services.',
 '["Receive SMS", "Voicemail"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert VOIP products
INSERT INTO public.products (id, type, country, region, data, validity, price, flag, is_popular, description, features) VALUES
('voip-100', 'voip', 'World Credits', 'Global', '100 Minutes', 'No Expiry', 5.00, '📞', false, 'Call any phone in the world over the internet.',
 '["Call Landlines", "Call Mobiles", "Crystal Clear Audio"]'::jsonb),
('voip-500', 'voip', 'World Credits', 'Global', '500 Minutes', 'No Expiry', 20.00, '📞', true, 'Bulk credits for frequent callers.',
 '["Call Landlines", "Call Mobiles", "Best Value"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

