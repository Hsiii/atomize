alter function public.add_solo_exp(uuid, integer) security invoker;
alter function public.record_match_result(uuid, boolean, boolean) security invoker;

revoke all on function public.add_solo_exp(uuid, integer) from public, anon;
revoke all on function public.record_match_result(uuid, boolean, boolean) from public, anon;

grant execute on function public.add_solo_exp(uuid, integer) to authenticated;
grant execute on function public.record_match_result(uuid, boolean, boolean) to authenticated;
