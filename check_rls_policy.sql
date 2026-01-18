-- Check the actual RLS policy for products table
-- Run this in Supabase SQL Editor

-- 1. View the policy details
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products';

-- 2. Test if the policy works by trying a query as anon user
-- This simulates what the app is trying to do
SET ROLE anon;
SELECT COUNT(*) FROM products;
RESET ROLE;

-- 3. If the above fails, check what the current policy qual is
-- It should be "true" or "(true)" to allow all public access

-- 4. If policy doesn't allow public access, fix it with:
-- DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
-- CREATE POLICY "Products are viewable by everyone"
-- ON public.products FOR SELECT
-- USING (true);
