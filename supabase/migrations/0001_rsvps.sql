create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  phone text not null,
  attending text not null check (attending in ('yes','maybe','no')),
  adults int not null default 1 check (adults between 0 and 6),
  kids int not null default 0 check (kids between 0 and 6),
  kids_ages text,
  dietary text,
  volunteer text[],
  note text
);

create or replace function public.rsvps_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists rsvps_touch_updated_at on public.rsvps;
create trigger rsvps_touch_updated_at
  before update on public.rsvps
  for each row execute function public.rsvps_touch_updated_at();

-- RLS on, no policies: anon/authenticated get nothing.
-- The server uses the service role key, which bypasses RLS.
alter table public.rsvps enable row level security;
revoke all on public.rsvps from anon, authenticated;
