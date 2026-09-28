import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const highlights = ["One place for every hostel issue", "Real-time status updates", "Secure access for students and wardens"];

export default function Home() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"student" | "warden">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", studentId: "", roomNumber: "", hostelBlock: "" });
  const utils = trpc.useUtils();
  const login = trpc.auth.login.useMutation({ onSuccess: async () => { await utils.auth.me.invalidate(); toast.success("Welcome back"); }, onError: error => toast.error(error.message) });
  const signup = trpc.auth.registerStudent.useMutation({ onSuccess: async () => { await utils.auth.me.invalidate(); toast.success("Account created successfully"); }, onError: error => toast.error(error.message) });
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === "signin") {
      login.mutate({ email: form.email, password: form.password, role });
      return;
    }
    signup.mutate({ ...form });
  };

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="visual-grid" />
        <div className="brand-lockup"><div className="brand-mark"><Sparkles size={18} /></div><span>Hostel<span className="brand-accent">Hub</span></span></div>
        <div className="visual-copy">
          <p className="eyebrow light"><span className="eyebrow-dot" /> Built for better campus living</p>
          <h1>Issues raised.<br /><em>Solutions tracked.</em></h1>
          <p className="visual-subtitle">A calmer, clearer way for students and wardens to keep every hostel detail moving forward.</p>
          <div className="highlight-list">{highlights.map(item => <div className="highlight-item" key={item}><CheckCircle2 size={17} /><span>{item}</span></div>)}</div>
        </div>
        <div className="visual-footer"><span>Designed for campus communities</span><span className="footer-line" /><span>2026</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand"><div className="brand-mark"><Sparkles size={17} /></div><span>Hostel<span className="brand-accent">Hub</span></span></div>
          <div className="auth-heading"><p className="eyebrow">Welcome to HostelHub</p><h2>{mode === "signin" ? "Sign in to your workspace" : "Create your student account"}</h2><p>{mode === "signin" ? "Access complaints, updates, and your campus support desk." : "Set up your profile so your wardens can respond faster."}</p></div>
          <div className="auth-tabs"><button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign in</button><button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div>
          {mode === "signin" && <div className="role-switch" role="tablist"><button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}><UserRound size={15} /> Student</button><button type="button" className={role === "warden" ? "active" : ""} onClick={() => setRole("warden")}><ShieldCheck size={15} /> Warden</button></div>}
          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && <div className="field"><label>Full name</label><div className="input-wrap"><UserRound size={16} /><Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your name" required /></div></div>}
            <div className="field"><label>Email address</label><div className="input-wrap"><Mail size={16} /><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@college.edu" required /></div></div>
            {mode === "signup" && <div className="form-grid"><div className="field"><label>Student ID</label><Input value={form.studentId} onChange={e => update("studentId", e.target.value)} placeholder="e.g. STU-1024" required /></div><div className="field"><label>Room number</label><Input value={form.roomNumber} onChange={e => update("roomNumber", e.target.value)} placeholder="e.g. B-204" required /></div><div className="field full"><label>Hostel / block</label><Input value={form.hostelBlock} onChange={e => update("hostelBlock", e.target.value)} placeholder="e.g. North Block" required /></div></div>}
            <div className="field"><label>Password</label><div className="input-wrap"><LockKeyhole size={16} /><Input type={showPassword ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"} required minLength={mode === "signup" ? 8 : 1} /><button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            {mode === "signup" && <div className="field"><label>Confirm password</label><div className="input-wrap"><LockKeyhole size={16} /><Input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} placeholder="Re-enter your password" required minLength={8} /></div></div>}
            {mode === "signin" && <div className="form-meta"><label className="remember"><input type="checkbox" /> <span>Remember me</span></label><button type="button" className="text-button" onClick={() => toast.info("Please contact your hostel administrator to reset access.")}>Forgot password?</button></div>}
            <Button className="primary-action" type="submit" disabled={login.isPending || signup.isPending}>{login.isPending ? "Signing in…" : signup.isPending ? "Creating account…" : mode === "signin" ? "Sign in" : "Create account"}<ArrowRight size={17} /></Button>
          </form>
          <div className="divider"><span>or continue with</span></div>
          <button className="google-button" type="button" onClick={() => startLogin()}><span className="google-g">G</span><span>Continue with Google</span></button>
          <p className="auth-note"><ShieldCheck size={14} /> Secure OAuth sign-in. Your account stays protected.</p>
          <p className="switch-copy">{mode === "signin" ? "New to HostelHub?" : "Already have an account?"} <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Create an account" : "Sign in instead"}</button></p>
        </div>
      </section>
    </main>
  );
}
