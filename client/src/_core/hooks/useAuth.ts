import { useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";

type UseAuthOptions = { redirectOnUnauthenticated?: boolean; redirectPath?: string };

export function useAuth(_options?: UseAuthOptions) {
  const utils = trpc.useUtils();
  const meQuery = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => utils.auth.me.setData(undefined, null) });
  const logout = useCallback(async () => { try { await logoutMutation.mutateAsync({}); } finally { utils.auth.me.setData(undefined, null); await utils.auth.me.invalidate(); } }, [logoutMutation, utils]);
  return useMemo(() => ({ user: meQuery.data ?? null, loading: meQuery.isLoading || logoutMutation.isPending, error: meQuery.error ?? logoutMutation.error ?? null, isAuthenticated: Boolean(meQuery.data), refresh: () => meQuery.refetch(), logout }), [meQuery.data, meQuery.isLoading, meQuery.error, logoutMutation.isPending, logoutMutation.error, logout, meQuery]);
}
