-- Run once in Supabase SQL Editor to enable a per-student hourly AI limit.
create table if not exists public.nexus_ai_usage (
  user_id uuid not null,
  bucket_start timestamptz not null,
  request_count integer not null default 0,
  primary key (user_id, bucket_start)
);

alter table public.nexus_ai_usage enable row level security;
revoke all on public.nexus_ai_usage from anon, authenticated;

create or replace function public.consume_nexus_ai_request(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bucket timestamptz := date_trunc('hour', now());
  v_count integer;
begin
  insert into public.nexus_ai_usage(user_id, bucket_start, request_count)
  values (p_user_id, v_bucket, 1)
  on conflict (user_id, bucket_start)
  do update set request_count = public.nexus_ai_usage.request_count + 1
  returning request_count into v_count;
  return v_count <= 30;
end;
$$;
revoke all on function public.consume_nexus_ai_request(uuid) from public, anon, authenticated;
grant execute on function public.consume_nexus_ai_request(uuid) to service_role;
