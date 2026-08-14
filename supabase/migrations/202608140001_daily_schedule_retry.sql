-- RunLog — le premier cron disponible de la journée Paris peut rattraper
-- une tentative quotidienne qui a échoué avant toute livraison Push.
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
  on conflict (schedule_date) do update
    set status = 'processing',
        last_error = null,
        updated_at = now()
    where daily_schedule_deliveries.status = 'failed'
  returning id into claimed_id;

  return claimed_id is not null;
end;
$$;

revoke all on function public.claim_daily_schedule(date) from public, anon, authenticated;
grant execute on function public.claim_daily_schedule(date) to service_role;
