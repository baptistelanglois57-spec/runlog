-- RunLog — planification persistante des rappels Agenda et Web Push.
-- L'application n'a pas encore d'authentification : user_id reste donc nullable
-- jusqu'à l'introduction d'un vrai utilisateur Supabase.

alter table public.events
  add column if not exists time text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'events_time_hhmm_check'
  ) then
    alter table public.events
      add constraint events_time_hhmm_check
      check (time is null or time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');
  end if;
end $$;

create table if not exists public.scheduled_event_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  event_id text not null,
  reminder_type text not null check (reminder_type in ('training', 'race')),
  scheduled_at timestamptz not null,
  dedupe_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'processing', 'sent', 'cancelled', 'failed')),
  sent_at timestamptz null,
  notification_id text null,
  push_status text null check (push_status in ('sent', 'failed', 'not-configured')),
  last_error text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, reminder_type)
);

create index if not exists scheduled_event_reminders_due_idx
  on public.scheduled_event_reminders (scheduled_at)
  where status = 'scheduled';

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- Une notification Agenda livrée est unique même si le cron est exécuté deux fois.
create unique index if not exists notifications_event_reminder_dedupe_idx
  on public.notifications (entity, "entityId")
  where entity = 'event-reminder';

-- Atomiquement réclamer un lot d'échéances. Les échéances bloquées par un crash
-- peuvent être reprises au bout de 15 minutes.
create or replace function public.claim_due_event_reminders(batch_size integer default 100)
returns table (
  id uuid,
  event_id text,
  reminder_type text,
  dedupe_key text,
  payload jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with due as (
    select reminder.id
    from public.scheduled_event_reminders reminder
    where reminder.scheduled_at <= now()
      and (
        reminder.status = 'scheduled'
        or (
          reminder.status = 'processing'
          and reminder.updated_at < now() - interval '15 minutes'
        )
      )
    order by reminder.scheduled_at asc
    for update skip locked
    limit greatest(batch_size, 1)
  )
  update public.scheduled_event_reminders reminder
  set status = 'processing', updated_at = now()
  from due
  where reminder.id = due.id
  returning reminder.id, reminder.event_id, reminder.reminder_type,
    reminder.dedupe_key, reminder.payload;
end;
$$;

revoke all on function public.claim_due_event_reminders(integer) from public, anon, authenticated;
grant execute on function public.claim_due_event_reminders(integer) to service_role;

-- Compatible avec l'application actuelle sans auth. À resserrer par user_id dès
-- l'ajout d'une authentification Supabase.
grant select, insert, update, delete on public.scheduled_event_reminders to anon, authenticated, service_role;
grant select, insert, update on public.push_subscriptions to anon, authenticated, service_role;
