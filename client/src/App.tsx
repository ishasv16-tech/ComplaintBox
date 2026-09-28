import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "./_core/hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import StudentPortal from "./pages/StudentPortal";
import WardenPortal from "./pages/WardenPortal";
import NotFound from "./pages/NotFound";

function Router() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#f6f8fb]"><div className="loading-ring" /></div>;
  if (!user) return <Home />;
  if (user.role === "admin") return <WardenPortal />;
  if (user.role === "user") return <StudentPortal />;
  setLocation("/");
  return <NotFound />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-right" />
          <Switch>
            <Route path="/" component={Router} />
            <Route path="/404" component={NotFound} />
            <Route component={Router} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
