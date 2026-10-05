# Supabase production notes

The app expects the existing SNUC Tech Society database with RLS enabled.

Required tables:
- profiles
- opportunities
- applications
- saved_opportunities
- wins
- notifications

Required role values:
- student
- management
- admin

The browser must only receive the publishable key. Never put a Supabase service-role key in `.env.local`, GitHub, client code or Vercel public environment variables.
