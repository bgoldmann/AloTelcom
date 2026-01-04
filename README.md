# AloTelcom - Global eSIM Marketplace

A comprehensive platform for global connectivity solutions including eSIM data plans, VPN services, virtual phone numbers, and VOIP calling.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **AI**: Google Gemini

## Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the database schema:
   - Copy `supabase/schema.sql` to Supabase SQL Editor
   - Execute the script
   - (Optional) Run `supabase/seed.sql` for sample data

### 3. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Note**: See `.env.example` for all available configuration options.

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Create Admin User

After signing up, make a user admin:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`
4. Deploy!

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed setup instructions.

## Project Structure

```
├── components/       # React components
├── pages/           # Page components
├── lib/             # Utilities (Supabase client, helpers)
├── services/        # External service integrations
├── supabase/        # Database schema and seeds
├── types.ts         # TypeScript type definitions
└── store.tsx        # Global state management
```

## Features

- ✅ User authentication (Supabase Auth)
- ✅ Product catalog (eSIM, VPN, Numbers, VOIP)
- ✅ Shopping cart & checkout
- ✅ Order management dashboard
- ✅ Admin panel
- ✅ Partner API key management
- ✅ AI chat assistant (Gemini)
- ✅ Dark mode
- ✅ Responsive design

## Documentation

- [PRD.md](./PRD.md) - Product Requirements Document
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Supabase + Vercel setup guide
- [CHANGELOG.md](./CHANGELOG.md) - Version history

## License

Private - AloTelcom Inc.
