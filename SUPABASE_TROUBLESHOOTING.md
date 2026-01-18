# Supabase Connection Troubleshooting Guide

## Current Issue: Connection Timeout

If you're seeing "Connection timeout" errors, follow these steps in order:

## Step 1: Verify Supabase Project Status

1. Go to https://supabase.com/dashboard
2. Select your project
3. Check the project status:
   - **Active** ✅ - Project is running
   - **Paused** ❌ - Click "Restore" or "Resume"
   - **Error** ⚠️ - Check error message and fix

## Step 2: Verify Database Tables Exist

In Supabase SQL Editor, run:

```sql
-- Check if products table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'products';
```

**If no results:**
- Run `supabase/schema.sql` in SQL Editor
- Then run `supabase/seed.sql` for sample data

**If table exists, check data:**
```sql
SELECT COUNT(*) FROM products;
```

## Step 3: Check RLS Policies

Run this in SQL Editor:

```sql
-- View current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';
```

**If no policy exists or it's not public:**

```sql
-- Drop existing policy if any
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

-- Create public read policy
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (true);
```

## Step 4: Verify Environment Variables

### Local Development (.env.local)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel Production
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure both variables are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Important:** After adding/updating variables, redeploy your app

### Verify in Browser Console
Open browser DevTools (F12) → Console. You should see:
```
✅ Supabase environment variables are set
Testing Supabase connection...
Supabase URL: https://xxxxx.supabase.co...
```

## Step 5: Test Supabase REST API Directly

In browser console, run this test:

```javascript
const url = 'YOUR_SUPABASE_URL'; // Replace with actual URL
const key = 'YOUR_ANON_KEY'; // Replace with actual key

// Test 1: Health check
fetch(`${url}/rest/v1/products?select=id&limit=1`, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected results:**
- ✅ Success: Returns array (empty if no data, or with products)
- ❌ CORS error: Check Supabase project settings
- ❌ 401/403: Check API key
- ❌ 404: Table doesn't exist (run schema.sql)
- ❌ Timeout: Project might be paused or network issue

## Step 6: Check Network Tab

1. Open DevTools (F12) → Network tab
2. Filter by "XHR" or "Fetch"
3. Look for requests to `supabase.co`
4. Check:
   - **Status Code**: Should be 200 (OK)
   - **Response Time**: Should be < 1 second
   - **Request URL**: Should match your Supabase URL

## Common Issues & Solutions

### Issue: "Connection timeout"
**Causes:**
- Project is paused → Resume in Dashboard
- Wrong URL → Check Settings → API → Project URL
- Network/firewall blocking → Check network settings

### Issue: "Products table not found"
**Solution:** Run `supabase/schema.sql` in SQL Editor

### Issue: "Permission denied" or 401/403
**Solution:** 
1. Check RLS policies (Step 3 above)
2. Verify API key is correct
3. Ensure policy uses `USING (true)` for public access

### Issue: Empty results (table exists but no data)
**Solution:** Run `supabase/seed.sql` in SQL Editor

### Issue: Environment variables not working in Vercel
**Solution:**
1. Set variables in Vercel Dashboard
2. Redeploy the app (Vercel needs a new build to pick up env vars)
3. For Vite, ensure variables start with `VITE_`

## Quick Diagnostic SQL

Run this complete diagnostic in SQL Editor:

```sql
-- 1. Check if table exists
SELECT 'Table exists: ' || COUNT(*) as status
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'products';

-- 2. Check row count
SELECT 'Row count: ' || COUNT(*) as status FROM products;

-- 3. Check RLS is enabled
SELECT 'RLS enabled: ' || CASE WHEN rowsecurity THEN 'Yes' ELSE 'No' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'products';

-- 4. Check policies
SELECT 'Policy: ' || policyname || ' - ' || cmd as status
FROM pg_policies 
WHERE tablename = 'products';

-- 5. Test query (should work if everything is correct)
SELECT id, type, country, price FROM products LIMIT 5;
```

## Still Not Working?

1. **Check Supabase Status Page**: https://status.supabase.com
2. **Check Browser Console**: Look for specific error messages
3. **Try Incognito Mode**: Rules out browser extension issues
4. **Check Network Connection**: Try from different network
5. **Verify Project Region**: Make sure it's accessible from your location

## Next Steps

Once connection is working, you should see products loading in the Marketplace page. If you still see timeouts after following all steps, the issue is likely:

1. Supabase project is paused (most common)
2. Network/firewall blocking requests
3. Incorrect Supabase URL format

Let me know what you find after running the diagnostic SQL above!
