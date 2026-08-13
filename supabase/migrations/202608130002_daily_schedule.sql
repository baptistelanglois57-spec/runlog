-- RunLog — résumé quotidien Agenda, produit une seule fois par journée Paris.
create table if not exists public.daily_schedule_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  schedule_date date not null unique,
  status text not null default 'processing'
    check (status in ('processing', 'sent', 'no-events', 'failed')),
  notification_id text null,
  event_ids text[] not null default '{}',
  push_status text null check (push_status in ('sent', 'failed', 'not-configured')),
  last_error text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists notifications_daily_schedule_dedupe_idx
  on public.notifications (entity, "entityId")
  where entity = 'daily-schedule';

create or replace function public.claim_daily_schedule(target_date date)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed_id uuid;
begin
  insert into public.daily_schedule_deliveries (schedule_date, status)
  values (target_date, 'processing')
  on conflict (schedule_date) do nothing
  returning id into claimed_id;

  return claimed_id is not null;
end;
$$;

revoke all on function public.claim_daily_schedule(date) from public, anon, authenticated;
grant execute on function public.claim_daily_schedule(date) to service_role;
grant select, insert, update on public.daily_schedule_deliveries to service_role;
