-- Create follows table
create table if not exists public.follows (
    id uuid default gen_random_uuid() primary key,
    follower_id uuid references public.profiles(id) on delete cascade not null,
    following_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(follower_id, following_id)
);

-- Create indexes for better query performance
create index if not exists follows_follower_id_idx on public.follows(follower_id);
create index if not exists follows_following_id_idx on public.follows(following_id);

-- Enable Row Level Security
alter table public.follows enable row level security;

-- Create policies
create policy "Users can view all follows"
on public.follows for select
to authenticated
using (true);

create policy "Users can follow others"
on public.follows for insert
to authenticated
with check (follower_id = auth.uid());

create policy "Users can unfollow"
on public.follows for delete
to authenticated
using (follower_id = auth.uid());

-- Add follower count to profiles
alter table public.profiles 
add column if not exists followers_count integer default 0,
add column if not exists following_count integer default 0;

-- Create function to update followers count
create or replace function public.handle_follow_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    -- Increment the counts
    update public.profiles
    set followers_count = followers_count + 1
    where id = NEW.following_id;
    
    update public.profiles
    set following_count = following_count + 1
    where id = NEW.follower_id;
    
    return NEW;
  elsif (TG_OP = 'DELETE') then
    -- Decrement the counts
    update public.profiles
    set followers_count = followers_count - 1
    where id = OLD.following_id;
    
    update public.profiles
    set following_count = following_count - 1
    where id = OLD.follower_id;
    
    return OLD;
  end if;
  return null;
end;
$$;

-- Create triggers to maintain follower counts
drop trigger if exists handle_follow_count on public.follows;
create trigger handle_follow_count
after insert or delete on public.follows
for each row execute function public.handle_follow_count();