# SNUC Tech Society

Production-ready Next.js + Supabase opportunity platform for SNU Chennai students and management.

## Included
- Separate Student and Management login modes
- Supabase Auth + role-based access through `profiles.role`
- RLS-backed student/management permissions
- Opportunity publishing form with official website, application URL, rules, brochure, eligibility, skills, dates, reward, team size and contact details
- Opportunity detail pages with Save, Apply now, official links and deadline reminder
- Student application tracker with status pipeline and deadlines
- In-app notifications and reminder records
- Student wins / achievement verification workflow
- Management dashboard with live applicant counts
- Applicant status updates
- One-click `.xlsx` applicant export per opportunity
- Responsive, mobile-friendly UI

## Environment
Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

Do not commit `.env.local` or any Supabase service-role key.

## Supabase
This frontend is designed for the SNUC Tech Society Supabase schema containing:
`profiles`, `opportunities`, `applications`, `saved_opportunities`, `wins`, and `notifications`.
The application uses only the publishable key in the browser. Authorization is enforced with Supabase RLS, not just hidden UI.

### Creating management accounts
Management accounts are not publicly sign-up enabled. A student account can be created normally, then an administrator can promote the account in Supabase SQL:

```sql
update public.profiles
set role = 'management'
where id = 'USER_UUID_HERE';
```

Use the authenticated user's UUID, not their name or email. Admin can use `role = 'admin'`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel
Set the two `NEXT_PUBLIC_*` variables in the Vercel project, then deploy from the `snuc-tech-society` root directory.

## Reminder behavior
The tracker calculates live time remaining from the stored deadline and stores explicit reminder notifications in Supabase. For guaranteed push/email reminders while a user is offline, connect a scheduled Supabase Edge Function/cron or an email provider; this package intentionally does not require a service-role key or third-party secret.
