import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const FREE_FEATURES = [
  "Up to 10 subscriptions",
  "Monthly & yearly spend summary",
  "Category organization",
  "Renewal date tracking",
  "Basic analytics",
];

const PRO_FEATURES = [
  "Unlimited subscriptions",
  "Full analytics dashboard",
  "Renewal alerts (30-day view)",
  "Most expensive breakdown",
  "Spend by category charts",
  "Priority support",
  "Everything in Free",
];

export default function PricingPage({ onBack, onGetStarted, onSuccess, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    const token = localStorage.getItem("st_token");
    if (!token) {
      onGetStarted();
      return;
    }
    if (!RAZORPAY_KEY) {
      setError("Payment not configured. Contact support.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: 99900, currency: "INR", plan_type: "pro" }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.detail || "Failed to create order");

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "SubTrack Pro",
        description: "Lifetime Pro Access",
        order_id: order.order_id,
        handler: async (response) => {
          const vRes = await fetch(`${API}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(response),
          });
          if (vRes.ok) {
            const saved = localStorage.getItem("st_user");
            if (saved) {
              const u = JSON.parse(saved);
              u.plan = "pro";
              localStorage.setItem("st_user", JSON.stringify(u));
            }
            onSuccess?.({ plan: "pro" });
          }
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkStyle = { color: "#10b981", marginRight: 8, fontWeight: 700 };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: 900, height: 600, background: "radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 900, position: "relative", zIndex: 1 }}>
        <button onClick={onBack} style={{ background: "none", color: "var(--text3)", border: "none", fontSize: 14, fontWeight: 500, padding: "8px 0", marginBottom: 40, cursor: "pointer", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 6 }}
          onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--text3)"}>
          ← Back
        </button>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, marginBottom: 16 }}>
            Simple, honest pricing
          </h1>
          <p style={{ fontSize: 18, color: "var(--text3)", maxWidth: 500, margin: "0 auto" }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "12px 18px", marginBottom: 24, fontSize: 14, color: "#fca5a5", textAlign: "center" }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, alignItems: "start" }}>

          {/* Free */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: 24, padding: 36 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Free</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 48, fontWeight: 900 }}>$0</span>
                <span style={{ fontSize: 16, color: "var(--text3)", marginBottom: 10 }}>/month</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text3)" }}>Perfect for getting started</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {FREE_FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", fontSize: 14 }}>
                  <span style={checkStyle}>✓</span>
                  <span style={{ color: "var(--text2)" }}>{f}</span>
                </div>
              ))}
            </div>

            <button onClick={onGetStarted} style={{ width: "100%", background: "transparent", color: "var(--text2)", border: "1px solid var(--border2)", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#a78bfa"; e.currentTarget.style.color = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}>
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div style={{ background: "var(--card)", border: "1px solid rgba(124,58,237,0.5)", borderRadius: 24, padding: 36, position: "relative", boxShadow: "0 0 40px rgba(124,58,237,0.2)" }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
              MOST POPULAR
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Pro</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 48, fontWeight: 900, background: "linear-gradient(135deg,#a78bfa,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>$9</span>
                <span style={{ fontSize: 16, color: "var(--text3)", marginBottom: 10 }}>/month</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text3)" }}>For power users who want full control</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {PRO_FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", fontSize: 14 }}>
                  <span style={checkStyle}>✓</span>
                  <span style={{ color: "var(--text2)" }}>{f}</span>
                </div>
              ))}
            </div>

            <button onClick={handleUpgrade} disabled={loading} style={{ width: "100%", background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)", transition: "all 0.2s" }}
              onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; } }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}>
              {loading ? "Processing..." : "⚡ Upgrade to Pro"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text4)", marginTop: 32 }}>
          All plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
