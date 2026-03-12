import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";

/**
 * SubTrack — App Stage Manager
 *
 * Stages:
 *   landing   → Marketing / home page
 *   auth      → Login / signup
 *   pricing   → Pricing page
 *   dashboard → Main app (subscriptions, analytics)
 */
export default function App() {
  const [stage, setStage] = useState("landing");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("st_token");
    const saved = localStorage.getItem("st_user");
    if (token && saved) {
      try {
        setUser(JSON.parse(saved));
        setStage("dashboard");
      } catch {
        localStorage.removeItem("st_token");
        localStorage.removeItem("st_user");
      }
    }
  }, []);

  const handleAuthSuccess = (data) => {
    setUser({ id: data.user_id, email: data.email, name: data.full_name, plan: data.plan });
    setStage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("st_token");
    localStorage.removeItem("st_user");
    setUser(null);
    setStage("landing");
  };

  const goToLogin = () => {
    setAuthMode("login");
    setStage("auth");
  };

  const goToSignup = () => {
    setAuthMode("signup");
    setStage("auth");
  };

  return (
    <>
      {stage === "landing" && (
        <LandingPage
          onGetStarted={goToSignup}
          onViewPricing={() => setStage("pricing")}
          onLogin={goToLogin}
        />
      )}

      {stage === "auth" && (
        <AuthPage
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onBack={() => setStage("landing")}
        />
      )}

      {stage === "pricing" && (
        <PricingPage
          onBack={() => setStage(user ? "dashboard" : "landing")}
          onGetStarted={goToSignup}
          user={user}
          onSuccess={(result) => {
            if (user) {
              setUser(prev => ({ ...prev, plan: "pro" }));
              setStage("dashboard");
            } else {
              goToSignup();
            }
          }}
        />
      )}

      {stage === "dashboard" && (
        <DashboardPage
          user={user}
          onLogout={handleLogout}
          onUpgrade={() => setStage("pricing")}
        />
      )}
    </>
  );
}
