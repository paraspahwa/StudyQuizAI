import { useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";

const MONTHLY_PLAN_ID = import.meta.env.VITE_RAZORPAY_MONTHLY_PLAN_ID || "plan_xxxxx";
const YEARLY_PLAN_ID = import.meta.env.VITE_RAZORPAY_YEARLY_PLAN_ID || "plan_yyyyy";

export default function PricingPage({ onBack, onSuccess }) {
  const { payOnce, subscribe, loading, error } = useRazorpay();
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const handlePayment = () => {
    const callbacks = {
      onSuccess: (result) => onSuccess?.(result),
      onFailure: (err) => console.error("Payment failed:", err),
    };

    if (selectedPlan === "monthly") {
      subscribe({ planId: MONTHLY_PLAN_ID, ...callbacks });
    } else if (selectedPlan === "yearly") {
      subscribe({ planId: YEARLY_PLAN_ID, ...callbacks });
    } else {
      payOnce({ amount: 49900, planType: "lifetime", ...callbacks });
    }
  };

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "₹199",
      period: "/month",
      features: ["Unlimited quizzes", "All difficulty levels", "Cancel anytime"],
      tag: null,
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "₹1,499",
      period: "/year",
      features: ["Unlimited quizzes", "Priority AI processing", "Export to PDF", "Save 37%"],
      tag: "MOST POPULAR",
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: "₹499",
      period: "once",
      features: ["Unlimited forever", "All future updates", "No recurring charges", "Best value"],
      tag: "BEST VALUE",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>Upgrade to <span style={styles.pro}>Pro</span></h1>
        <p style={styles.subtitle}>Unlock unlimited AI-powered quiz generation</p>
      </div>

      {error && <div style={styles.error}>⚠️ {error}</div>}

      {/* Plan Cards */}
      <div style={styles.cards}>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                ...styles.card,
                ...(isSelected ? styles.cardSelected : {}),
              }}
            >
              {plan.tag && (
                <div style={{
                  ...styles.tag,
                  ...(plan.id === "yearly" ? styles.tagPopular : styles.tagValue),
                }}>
                  {plan.tag}
                </div>
              )}

              <div style={styles.radio}>
                <div style={{
                  ...styles.radioInner,
                  ...(isSelected ? styles.radioChecked : {}),
                }} />
              </div>

              <h3 style={styles.planName}>{plan.name}</h3>
              <div style={styles.priceRow}>
                <span style={styles.price}>{plan.price}</span>
                <span style={styles.period}>{plan.period}</span>
              </div>

              <ul style={styles.features}>
                {plan.features.map((f, i) => (
                  <li key={i} style={styles.feature}>
                    <span style={styles.check}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Pay Button */}
      <div style={styles.paySection}>
        <button
          style={{
            ...styles.payBtn,
            ...(loading ? styles.payBtnDisabled : {}),
          }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : `Get Pro — ${plans.find((p) => p.id === selectedPlan).price}`}
        </button>
        <p style={styles.secure}>🔒 Secured by Razorpay · UPI · Cards · Net Banking · International</p>
      </div>

      {/* Free vs Pro comparison */}
      <div style={styles.comparison}>
        <h3 style={styles.compTitle}>Free vs Pro</h3>
        <div style={styles.compGrid}>
          <div style={styles.compHeader}>Feature</div>
          <div style={styles.compHeader}>Free</div>
          <div style={{ ...styles.compHeader, color: "#0f766e" }}>Pro ⚡</div>

          <div style={styles.compCell}>Quizzes per day</div>
          <div style={styles.compCell}>3</div>
          <div style={{ ...styles.compCell, fontWeight: 700 }}>Unlimited</div>

          <div style={styles.compCell}>Questions per quiz</div>
          <div style={styles.compCell}>Up to 10</div>
          <div style={{ ...styles.compCell, fontWeight: 700 }}>Up to 50</div>

          <div style={styles.compCell}>Difficulty levels</div>
          <div style={styles.compCell}>All</div>
          <div style={{ ...styles.compCell, fontWeight: 700 }}>All</div>

          <div style={styles.compCell}>Per-option explanations</div>
          <div style={styles.compCell}>✓</div>
          <div style={{ ...styles.compCell, fontWeight: 700 }}>✓</div>

          <div style={styles.compCell}>Export to PDF</div>
          <div style={{ ...styles.compCell, color: "#94a3b8" }}>—</div>
          <div style={{ ...styles.compCell, fontWeight: 700 }}>✓</div>

          <div style={styles.compCell}>Priority AI</div>
          <div style={{ ...styles.compCell, color: "#94a3b8" }}>—</div>
          <div style={{ ...styles.compCell, fontWeight: 700 }}>✓</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px",
    minHeight: "100vh",
    background: "#fafbfc",
  },
  header: { textAlign: "center", marginBottom: 36 },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 15,
    color: "#64748b",
    cursor: "pointer",
    marginBottom: 16,
    display: "block",
  },
  title: { fontSize: 32, fontWeight: 900, color: "#0f172a", marginBottom: 8 },
  pro: { color: "#0f766e" },
  subtitle: { fontSize: 16, color: "#64748b" },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  cards: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 32,
  },
  card: {
    flex: "1 1 240px",
    maxWidth: 280,
    background: "#fff",
    border: "2px solid #e2e8f0",
    borderRadius: 16,
    padding: "24px 20px",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
    position: "relative",
  },
  cardSelected: {
    borderColor: "#0f766e",
    boxShadow: "0 4px 20px rgba(15, 118, 110, 0.15)",
  },
  tag: {
    position: "absolute",
    top: -10,
    right: 16,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 0.8,
    padding: "4px 10px",
    borderRadius: 6,
  },
  tagPopular: { background: "#0f766e", color: "#fff" },
  tagValue: { background: "#fbbf24", color: "#78350f" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "2px solid #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "transparent",
    transition: "background 0.2s",
  },
  radioChecked: { background: "#0f766e" },
  planName: { fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 4 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 },
  price: { fontSize: 28, fontWeight: 900, color: "#0f172a" },
  period: { fontSize: 14, color: "#94a3b8" },
  features: { listStyle: "none", padding: 0, margin: 0 },
  feature: { fontSize: 14, color: "#475569", lineHeight: 2, display: "flex", alignItems: "center", gap: 6 },
  check: { color: "#0f766e", fontWeight: 700 },
  paySection: { textAlign: "center", marginBottom: 48 },
  payBtn: {
    background: "linear-gradient(135deg, #0f766e, #0891b2)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "16px 48px",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(15, 118, 110, 0.3)",
    marginBottom: 12,
  },
  payBtnDisabled: { opacity: 0.6, cursor: "not-allowed" },
  secure: { fontSize: 13, color: "#94a3b8" },
  comparison: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 28,
    marginBottom: 40,
  },
  compTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16, textAlign: "center" },
  compGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "1px",
    fontSize: 14,
  },
  compHeader: { fontWeight: 700, padding: "8px 0", borderBottom: "1px solid #e2e8f0", color: "#0f172a" },
  compCell: { padding: "10px 0", borderBottom: "1px solid #f1f5f9", color: "#475569" },
};
