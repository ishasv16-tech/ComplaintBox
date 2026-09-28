import { Bell, Building2, ChevronRight, ClipboardList, FileBarChart, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Sparkles, UserRound, Users, Wrench, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";

export type PortalRole = "student" | "warden";
export type PortalSection = "dashboard" | "complaints" | "add" | "notifications" | "profile" | "settings" | "students" | "staff" | "analytics";

const studentNav: Array<{ key: PortalSection; label: string; icon: typeof LayoutDashboard }> = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "complaints", label: "My complaints", icon: ClipboardList },
  { key: "add", label: "Add complaint", icon: FileBarChart },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "settings", label: "Settings", icon: Settings },
];
const wardenNav: Array<{ key: PortalSection; label: string; icon: typeof LayoutDashboard }> = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "complaints", label: "All complaints", icon: ClipboardList },
  { key: "students", label: "Students", icon: Users },
  { key: "staff", label: "Maintenance staff", icon: Wrench },
  { key: "analytics", label: "Analytics", icon: FileBarChart },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "settings", label: "Settings", icon: Settings },
];

export function PortalShell({ role, active, onNavigate, unread, children }: { role: PortalRole; active: PortalSection; onNavigate: (section: PortalSection) => void; unread?: number; children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = role === "student" ? studentNav : wardenNav;
  const initials = (user?.name || user?.email || "U").split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
  const go = (section: PortalSection) => { onNavigate(section); setMobileOpen(false); };
  return <div className="portal-shell">
    <aside className={`portal-sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="portal-brand"><div className="portal-logo"><Sparkles size={17} /></div><div><strong>Hostel<span>Hub</span></strong><small>Campus support desk</small></div><button type="button" className="mobile-close" onClick={() => setMobileOpen(false)}><X size={17} /></button></div>
      <div className="role-pill"><span className="role-dot" /> {role === "student" ? "Student workspace" : "Warden workspace"}</div>
      <nav className="portal-nav">{nav.map(item => <button type="button" key={item.key} className={active === item.key ? "active" : ""} onClick={() => go(item.key)}><item.icon size={17} /><span>{item.label}</span>{item.key === "notifications" && !!unread && <b className="nav-count">{unread > 9 ? "9+" : unread}</b>} {active === item.key && <ChevronRight className="nav-chevron" size={15} />}</button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-help"><ShieldCheck size={17} /><div><strong>Secure by design</strong><span>Your access is role-protected.</span></div></div>
      <button type="button" className="logout-button" onClick={() => { void logout(); }} disabled={loading}><LogOut size={16} /> {loading ? "Signing out…" : "Sign out"}</button>
      <div className="sidebar-user"><div className="avatar small">{initials}</div><div><strong>{user?.name || "Account"}</strong><span>{role === "student" ? "Student" : "Warden"}</span></div></div>
    </aside>
    {mobileOpen && <button type="button" className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <section className="portal-content"><header className="portal-header"><button type="button" className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div className="header-context"><span className="header-kicker">{role === "student" ? "Student portal" : "Operations center"}</span><span className="header-separator" /><span className="header-date">{new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(new Date())}</span></div><div className="header-actions"><button type="button" className="icon-button" onClick={() => onNavigate("notifications")} aria-label="Open notifications"><Bell size={18} />{!!unread && <i />}</button><div className="header-avatar">{initials}</div></div></header><main className="portal-main">{children}</main></section>
  </div>;
}

export function PageIntro({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><p className="portal-eyebrow">{eyebrow}</p><h1>{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}</div>{action}</div>;
}

export function StatCard({ label, value, hint, tone = "blue", icon: Icon }: { label: string; value: number | string; hint?: string; tone?: "blue" | "amber" | "green" | "red" | "violet"; icon: typeof LayoutDashboard }) {
  return <div className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={17} /></span></div><strong>{value}</strong>{hint && <small>{hint}</small>}</div>;
}

const statusLabels: Record<string, string> = { submitted: "Submitted", assigned: "Assigned", in_progress: "In progress", resolved: "Resolved", rejected: "Rejected" };
export function StatusBadge({ status }: { status: string }) { return <span className={`status-badge ${status}`}>{statusLabels[status] || status}</span>; }
export function PriorityBadge({ priority }: { priority: string }) { return <span className={`priority-badge ${priority}`}>{priority}</span>; }
export function EmptyState({ icon: Icon = ClipboardList, title, body, action }: { icon?: typeof ClipboardList; title: string; body: string; action?: React.ReactNode }) { return <div className="empty-state"><div className="empty-icon"><Icon size={22} /></div><h3>{title}</h3><p>{body}</p>{action}</div>; }
export function formatDate(date: Date | string | number) { return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
export function formatDateTime(date: Date | string | number) { return new Date(date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
