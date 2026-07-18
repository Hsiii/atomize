-- Web and Godot share an anonymous Supabase Auth identity. The username is a
-- profile attribute owned by auth.uid(), not a credential.

drop index if exists public.combo_leaderboard_player_name_lower_key;

create unique index combo_leaderboard_player_name_lower_key
on public.combo_leaderboard (lower(btrim(player_name)));

alter table public.combo_leaderboard
drop constraint if exists combo_leaderboard_player_name_format;

alter table public.combo_leaderboard
add constraint combo_leaderboard_player_name_format check (
  player_name = btrim(player_name)
  and char_length(player_name) between 1 and 8
  and player_name !~ '[[:cntrl:]]'
  and player_name !~ '[[:space:]]{2,}'
);

drop policy if exists allow_read on public.combo_leaderboard;
drop policy if exists allow_insert_own on public.combo_leaderboard;
drop policy if exists allow_update_own on public.combo_leaderboard;

create policy allow_read
on public.combo_leaderboard
for select
to anon, authenticated
using (true);

create policy allow_insert_own
on public.combo_leaderboard
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy allow_update_own
on public.combo_leaderboard
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on table public.combo_leaderboard from anon, authenticated;
grant select on table public.combo_leaderboard to anon, authenticated;
grant insert, update on table public.combo_leaderboard to authenticated;

create or replace function public.claim_player_name(p_player_name text)
returns public.combo_leaderboard
language plpgsql
security invoker
set search_path = ''
as $$
declare
  claimed_profile public.combo_leaderboard;
  normalized_name text := regexp_replace(btrim(p_player_name), '[[:space:]]+', ' ', 'g');
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if char_length(normalized_name) not between 1 and 8
    or normalized_name ~ '[[:cntrl:]]'
  then
    raise exception 'Player name must be 1 to 8 visible characters' using errcode = '22023';
  end if;

  insert into public.combo_leaderboard (user_id, player_name)
  values (current_user_id, normalized_name)
  on conflict (user_id) do update
  set player_name = excluded.player_name,
      updated_at = now()
  returning * into claimed_profile;

  return claimed_profile;
end;
$$;

revoke all on function public.claim_player_name(text) from public, anon;
grant execute on function public.claim_player_name(text) to authenticated;

create or replace function public.submit_solo_score(
  p_score integer,
  p_max_combo integer default 0
)
returns public.combo_leaderboard
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated_profile public.combo_leaderboard;
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  update public.combo_leaderboard
  set high_score = greatest(high_score, greatest(0, p_score)),
      max_combo = greatest(max_combo, greatest(0, p_max_combo)),
      updated_at = now()
  where user_id = current_user_id
  returning * into updated_profile;

  if updated_profile.user_id is null then
    raise exception 'Claim a player name before submitting a score' using errcode = 'P0002';
  end if;

  return updated_profile;
end;
$$;

revoke all on function public.submit_solo_score(integer, integer) from public, anon;
grant execute on function public.submit_solo_score(integer, integer) to authenticated;

create or replace function public.add_solo_exp(p_user_id uuid, p_exp_gain integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is distinct from p_user_id then
    raise exception 'Cannot update another player' using errcode = '42501';
  end if;

  update public.combo_leaderboard
  set experience = experience + greatest(0, p_exp_gain),
      updated_at = now()
  where user_id = p_user_id;
end;
$$;

create or replace function public.record_match_result(
  p_user_id uuid,
  p_is_winner boolean,
  p_is_tie boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  experience_gain integer;
begin
  if (select auth.uid()) is distinct from p_user_id then
    raise exception 'Cannot update another player' using errcode = '42501';
  end if;

  if p_is_winner and not p_is_tie then
    experience_gain := 150;
  elsif p_is_tie then
    experience_gain := 50;
  else
    experience_gain := 30;
  end if;

  update public.combo_leaderboard
  set games_played = games_played + 1,
      wins = wins + case when p_is_winner and not p_is_tie then 1 else 0 end,
      losses = losses + case when not p_is_winner and not p_is_tie then 1 else 0 end,
      ties = ties + case when p_is_tie then 1 else 0 end,
      experience = experience + experience_gain,
      updated_at = now()
  where user_id = p_user_id;
end;
$$;
