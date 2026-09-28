import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const api = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`/api${path}`, { credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  return data;
};

const q = (key: string, path: string, input?: any, enabled = true) =>
  useQuery({ queryKey: [key, input], queryFn: () => api(path), enabled, retry: false, refetchOnWindowFocus: false });

const m = (key: string, path: string, method = "POST", transform: (x: any) => any = x => x) =>
  (opts: any = {}) => useMutation({
    mutationKey: [key],
    mutationFn: (input: any) => api(path.replace(/:id/g, String(input?.id ?? "")), { method, body: JSON.stringify(transform(input)) }),
    ...opts,
  });

export const trpc: any = {
  useUtils: () => {
    const qc = useQueryClient();
    return { auth: { me: { invalidate: () => qc.invalidateQueries({ queryKey: ["auth.me"] }), setData: (_: any, data: any) => qc.setQueryData(["auth.me", undefined], data) } } };
  },
  auth: {
    me: { useQuery: () => q("auth.me", "/auth/me") },
    login: { useMutation: (opts?: any) => m("auth.login", "/auth/login")(opts) },
    registerStudent: { useMutation: (opts?: any) => m("auth.register", "/auth/register")(opts) },
    logout: { useMutation: (opts?: any) => m("auth.logout", "/auth/logout")(opts) },
  },
  student: {
    dashboard: { useQuery: () => q("student.dashboard", "/student/dashboard") },
    complaints: { useQuery: () => q("student.complaints", "/complaints/my") },
  },
  complaints: {
    create: { useMutation: (opts?: any) => m("complaints.create", "/complaints")(opts) },
    byId: { useQuery: (input: any, opts?: any) => q("complaints.byId", `/complaints/${input.id}`, input, opts?.enabled ?? true) },
    all: { useQuery: () => q("complaints.all", "/warden/complaints") },
    update: { useMutation: (opts?: any) => m("complaints.update", "/warden/complaints/:id", "PATCH")(opts) },
  },
  notifications: {
    list: { useQuery: () => q("notifications.list", "/notifications") },
    markRead: { useMutation: (opts?: any) => m("notifications.markRead", "/notifications/:id/read", "PATCH")(opts) },
    markAllRead: { useMutation: (opts?: any) => m("notifications.markAllRead", "/notifications/read-all", "PATCH")(opts) },
  },
  profile: {
    update: { useMutation: (opts?: any) => m("profile.update", "/profile", "PATCH")(opts) },
  },
  warden: {
    dashboard: { useQuery: () => q("warden.dashboard", "/warden/dashboard") },
    students: { useQuery: () => q("warden.students", "/warden/students") },
    staff: { useQuery: () => q("warden.staff", "/warden/staff") },
    addStaff: { useMutation: (opts?: any) => m("warden.addStaff", "/warden/staff")(opts) },
    toggleStaff: { useMutation: (opts?: any) => m("warden.toggleStaff", "/warden/staff/:id", "PATCH")(opts) },
    analytics: { useQuery: () => q("warden.analytics", "/warden/analytics") },
  },
};
