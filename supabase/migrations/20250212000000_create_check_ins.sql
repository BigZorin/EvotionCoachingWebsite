-- Create check_ins table
create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  week_number int not null,
  year int not null,
  feeling int,
  weight decimal,
  energy_level int,
  sleep_quality int,
  stress_level int,
  nutrition_adherence int,
  training_adherence int,
  notes text,
  constraint unique_weekly_checkin unique (user_id, week_number, year)
);

-- Enable RLS
alter table check_ins enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own check-ins" on check_ins;
drop policy if exists "Users can insert their own check-ins" on check_ins;

-- Create policies
create policy "Users can view their own check-ins"
  on check_ins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own check-ins"
  on check_ins for insert
  with check (auth.uid() = user_id);

-- Create index for performance
create index if not exists idx_check_ins_user_week
  on check_ins (user_id, year, week_number);
