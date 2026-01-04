# Migration Guide: Supabase + Vercel Setup

This guide will help you migrate the AloTelcom codebase to use Supabase for backend services and deploy to Vercel.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (sign up at https://supabase.com)
- A Vercel account (sign up at https://vercel.com)
- Git repository set up

## Step 1: Install Dependencies

```bash
npm install
```

This will install the new Supabase dependencies:
- `@supabase/supabase-js`

## Step 2: Set Up Supabase Project

1. Go to https://supabase.com and create a new project
2. Note your project URL and anon key from Settings > API
3. Run the database schema:

   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL script
   - (Optional) Run `supabase/seed.sql` to add sample products

4. Configure Authentication:
   - Go to Authentication > Settings
   - Enable Email provider
   - Configure email templates if needed
   - Set up redirect URLs (add your Vercel domain when ready)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

2. Get your Supabase credentials:
   - Project URL: Found in Settings > API > Project URL
   - Anon Key: Found in Settings > API > anon public key

## Step 4: Create Initial Admin User

After running the schema, you need to create an admin user:

1. Sign up a user through the app (or Supabase Auth dashboard)
2. Go to Supabase SQL Editor and run:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

## Step 5: Test Locally

```bash
npm run dev
```

The app should now:
- Connect to Supabase
- Allow user registration/login
- Store data in Supabase database
- Use real authentication

## Step 6: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_GEMINI_API_KEY`

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`
6. Deploy

## Step 7: Update Supabase Redirect URLs

After deployment, update Supabase auth settings:

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

## Step 8: Verify Deployment

1. Visit your Vercel deployment URL
2. Test user registration
3. Test login
4. Test creating an order
5. Verify data appears in Supabase dashboard

## Key Changes Made

### Authentication
- ✅ Replaced mock authentication with Supabase Auth
- ✅ Added proper login/signup flow
- ✅ Session management with Supabase

### Database
- ✅ Created Supabase schema (users, orders, products, api_keys, admin_config)
- ✅ Row Level Security (RLS) policies for data access
- ✅ Automatic user profile creation on signup

### State Management
- ✅ Updated `store.tsx` to use Supabase queries
- ✅ Real-time data fetching from database
- ✅ Proper error handling

### Components
- ✅ Updated authentication pages
- ✅ Updated checkout to save IMEI and device model
- ✅ All data operations now use Supabase

## Troubleshooting

### Authentication Issues
- Check Supabase redirect URLs are configured correctly
- Verify environment variables are set
- Check browser console for errors

### Database Issues
- Verify schema.sql was executed successfully
- Check RLS policies are enabled
- Verify user has correct role/permissions

### Deployment Issues
- Ensure all environment variables are set in Vercel
- Check build logs for errors
- Verify Vite build completes successfully

## Next Steps

1. **Set up Stripe**: Integrate real payment processing
2. **Email Service**: Configure email notifications (SendGrid/Resend)
3. **eSIM Provider**: Integrate Airalo API for real eSIM provisioning
4. **Monitoring**: Set up error tracking (Sentry)
5. **Analytics**: Configure Google Analytics

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Check Vercel documentation: https://vercel.com/docs
- Review the PRD.md for feature requirements

