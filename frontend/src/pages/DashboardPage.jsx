import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CATEGORIES = ["Entertainment", "Productivity", "Health & Fitness", "Education", "Finance", "Shopping", "Gaming", "News & Media", "Cloud Storage", "Other"];

const CATEGORY_COLORS = {
  "Entertainment": "#e50914",
  "Productivity": "#6e40c9",
  "Health & Fitness": "#10b981",
  "Education": "#f59e0b",
  "Finance": "#06b6d4",
  "Shopping": "#ec4899",
  "Gaming": "#8b5cf6",
  "News & Media": "#3b82f6",
  "Cloud Storage": "#64748b",
  "Other": "#475569",
};

const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "weekly", label: "Weekly" },
];

function authHeaders() {
  const token = localStorage.getItem("st_token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function SubModal({ sub, onClose, onSaved }) {
  const isEdit = Boolean(sub?.id);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: sub?.name || "",
    category: sub?.category || "Entertainment",
    amount: sub?.amount || "",
    currency: sub?.currency || "USD",
    billing_cycle: sub?.billing_cycle || "monthly",
    next_billing_date: sub?.next_billing_date ? sub.next_billing_date.split("T")[0] : today,
    notes: sub?.notes || "",
    color: sub?.color || CATEGORY_COLORS["Entertainment"],
    is_active: sub?.is_active !== undefined ? sub.is_active : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "category") next.color = CATEGORY_COLORS[value] || "#475569";
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return setError("Enter a valid amount.");
    setLoading(true);
    try {
      const url = isEdit ? `${API}/api/subscriptions/${sub.id}` : `${API}/api/subscriptions`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to save");
      onSaved(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--text)", borderRadius: 10, padding: "11px 14px", fontSize: 14, transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: 24, padding: 36, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20 }}>
            {isEdit ? "Edit Subscription" : "Add Subscription"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#fca5a5" }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Service Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Netflix" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }} />
            </div>

            <div>
              <label style={labelStyle}>Amount *</label>
              <input name="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={handleChange} placeholder="9.99" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }} />
            </div>

            <div>
              <label style={labelStyle}>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} style={inputStyle}>
                {["USD", "EUR", "GBP", "INR", "CAD", "AUD"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Billing Cycle</label>
              <select name="billing_cycle" value={form.billing_cycle} onChange={handleChange} style={inputStyle}>
                {BILLING_CYCLES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Next Billing Date</label>
              <input name="next_billing_date" type="date" value={form.next_billing_date} onChange={handleChange} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }} />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any notes..." rows={2}
                style={{ ...inputStyle, resize: "vertical", minHeight: 64 }}
                onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }} />
            </div>

            {isEdit && (
              <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
                <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} id="is_active" style={{ width: 16, height: 16, accentColor: "var(--primary)", cursor: "pointer" }} />
                <label htmlFor="is_active" style={{ fontSize: 14, color: "var(--text2)", cursor: "pointer" }}>Active subscription</label>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: "var(--bg)", color: "var(--text3)", border: "1px solid var(--border2)", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ flex: 2, background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.4)", transition: "all 0.2s" }}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Subscription Card ────────────────────────────────────────────────────────
function SubCard({ sub, onEdit, onDelete, onToggle }) {
  const days = daysUntil(sub.next_billing_date);
  const catColor = sub.color || CATEGORY_COLORS[sub.category] || "#475569";
  const isUrgent = days !== null && days <= 7;
  const isOverdue = days !== null && days < 0;

  return (
    <div style={{ background: "var(--card)", border: `1px solid ${isUrgent && !isOverdue ? "rgba(245,158,11,0.4)" : isOverdue ? "rgba(239,68,68,0.4)" : "var(--border2)"}`, borderRadius: 16, padding: "20px", transition: "all 0.2s", opacity: sub.is_active ? 1 : 0.55 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: catColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff", flexShrink: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            {sub.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{sub.name}</div>
            <div style={{ fontSize: 12, color: "var(--text4)", marginTop: 2 }}>{sub.category}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => onEdit(sub)} style={{ background: "none", border: "none", color: "var(--text4)", fontSize: 15, cursor: "pointer", padding: 6, borderRadius: 8, transition: "all 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--text2)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text4)"; }} title="Edit">✏️</button>
          <button onClick={() => onDelete(sub.id)} style={{ background: "none", border: "none", color: "var(--text4)", fontSize: 15, cursor: "pointer", padding: 6, borderRadius: 8, transition: "all 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseOut={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text4)"; }} title="Delete">🗑️</button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>
            {formatCurrency(sub.amount, sub.currency)}
          </div>
          <div style={{ fontSize: 12, color: "var(--text4)", marginTop: 2 }}>
            {sub.billing_cycle} · {formatCurrency(sub.monthly_cost, sub.currency)}/mo
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          {days !== null && (
            <div style={{ fontSize: 13, fontWeight: 600, color: isOverdue ? "#ef4444" : isUrgent ? "#f59e0b" : "var(--text3)", padding: "4px 10px", background: isOverdue ? "rgba(239,68,68,0.1)" : isUrgent ? "rgba(245,158,11,0.1)" : "var(--bg)", borderRadius: 8 }}>
              {isOverdue ? `⚠️ ${Math.abs(days)}d overdue` : days === 0 ? "⚡ Due today" : isUrgent ? `⚡ ${days}d` : `${days}d`}
            </div>
          )}
          <div style={{ fontSize: 11, color: "var(--text4)", marginTop: 4 }}>
            {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString() : "—"}
          </div>
        </div>
      </div>

      {!sub.is_active && (
        <div style={{ marginTop: 12, padding: "6px 10px", background: "rgba(100,116,139,0.15)", borderRadius: 8, fontSize: 12, color: "var(--text4)", textAlign: "center" }}>
          Paused / Cancelled
        </div>
      )}
    </div>
  );
}

// ─── Analytics Panel ──────────────────────────────────────────────────────────
function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;
  const { monthly_total, yearly_total, active_count, by_category, upcoming_renewals, most_expensive } = analytics;

  const catEntries = Object.entries(by_category).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries[0]?.[1] || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Monthly Spend", value: `$${monthly_total.toFixed(2)}`, color: "#7c3aed" },
          { label: "Yearly Total", value: `$${yearly_total.toFixed(2)}`, color: "#06b6d4" },
          { label: "Active Subs", value: active_count, color: "#10b981" },
          { label: "Due in 30d", value: upcoming_renewals.length, color: "#f59e0b" },
        ].map((c, i) => (
          <div key={i} style={{ background: "var(--bg)", borderRadius: 14, padding: "16px", border: `1px solid ${c.color}22` }}>
            <div style={{ fontSize: 11, color: "var(--text4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* By category */}
      {catEntries.length > 0 && (
        <div style={{ background: "var(--bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border2)" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Spend by Category</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {catEntries.map(([cat, val]) => (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "var(--text2)" }}>{cat}</span>
                  <span style={{ fontWeight: 600 }}>${val.toFixed(2)}/mo</span>
                </div>
                <div style={{ height: 6, background: "var(--card)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(val / maxCat) * 100}%`, background: `${CATEGORY_COLORS[cat] || "#7c3aed"}`, borderRadius: 3, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming renewals */}
      {upcoming_renewals.length > 0 && (
        <div style={{ background: "var(--bg)", borderRadius: 16, padding: 20, border: "1px solid rgba(245,158,11,0.2)" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#f59e0b" }}>🔔 Upcoming Renewals</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming_renewals.map(s => {
              const d = daysUntil(s.next_billing_date);
              return (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--card)", borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color || CATEGORY_COLORS[s.category] || "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0 }}>
                      {s.name[0]}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>${s.amount}</div>
                    <div style={{ fontSize: 11, color: d <= 3 ? "#f59e0b" : "var(--text4)" }}>{d === 0 ? "Today" : `${d}d`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Most expensive */}
      {most_expensive.length > 0 && (
        <div style={{ background: "var(--bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border2)" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>💸 Most Expensive</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {most_expensive.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--card)", borderRadius: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: i === 0 ? "#f59e0b" : i === 1 ? "var(--text3)" : "#cd7f32" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700 }}>${s.monthly_cost.toFixed(2)}/mo</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage({ user, onLogout, onUpgrade }) {
  const [subs, setSubs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSub, setEditSub] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all, active, inactive
  const [filterCategory, setFilterCategory] = useState("All");
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("st_token");
    if (!token) return;
    setLoading(true);
    try {
      const [subsRes, analyticsRes, meRes] = await Promise.all([
        fetch(`${API}/api/subscriptions`, { headers: authHeaders() }),
        fetch(`${API}/api/analytics`, { headers: authHeaders() }),
        fetch(`${API}/api/auth/me`, { headers: authHeaders() }),
      ]);
      if (subsRes.ok) setSubs(await subsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (meRes.ok) setUserInfo(await meRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this subscription?")) return;
    await fetch(`${API}/api/subscriptions/${id}`, { method: "DELETE", headers: authHeaders() });
    showToast("Subscription deleted");
    fetchData();
  };

  const handleSaved = (saved) => {
    setShowModal(false);
    setEditSub(null);
    showToast(editSub ? "Subscription updated!" : "Subscription added!");
    fetchData();
  };

  const filteredSubs = subs.filter(s => {
    if (activeTab === "active" && !s.is_active) return false;
    if (activeTab === "inactive" && s.is_active) return false;
    if (filterCategory !== "All" && s.category !== filterCategory) return false;
    return true;
  });

  const isFreePlan = userInfo?.plan === "free";
  const atLimit = isFreePlan && userInfo?.active_subscription_count >= (userInfo?.free_limit || 10);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 2000, padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, background: toast.type === "success" ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
          {toast.type === "success" ? "✓ " : "⚠ "}{toast.msg}
        </div>
      )}

      {/* Modals */}
      {(showModal || editSub) && (
        <SubModal
          sub={editSub}
          onClose={() => { setShowModal(false); setEditSub(null); }}
          onSaved={handleSaved}
        />
      )}

      {/* Header */}
      <header style={{ background: "rgba(10,10,26,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border2)", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>💳</span>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg,#a78bfa,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SubTrack</span>
            {isFreePlan && <span style={{ fontSize: 11, background: "rgba(124,58,237,0.2)", color: "#a78bfa", padding: "3px 8px", borderRadius: 20, fontWeight: 600, border: "1px solid rgba(124,58,237,0.3)" }}>FREE</span>}
            {!isFreePlan && <span style={{ fontSize: 11, background: "rgba(6,182,212,0.2)", color: "#06b6d4", padding: "3px 8px", borderRadius: 20, fontWeight: 600, border: "1px solid rgba(6,182,212,0.3)" }}>PRO</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isFreePlan && (
              <button onClick={onUpgrade} style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ⚡ Upgrade to Pro
              </button>
            )}
            <div style={{ fontSize: 13, color: "var(--text3)" }}>{user?.email || user?.name}</div>
            <button onClick={onLogout} style={{ background: "none", color: "var(--text4)", border: "1px solid var(--border2)", padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text4)"; }}>
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: showAnalytics ? "1fr 320px" : "1fr", gap: 24, alignItems: "start" }}>

        {/* Left: Subscriptions */}
        <div>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 26 }}>My Subscriptions</h1>
              <p style={{ fontSize: 14, color: "var(--text3)", marginTop: 4 }}>
                {subs.filter(s => s.is_active).length} active
                {isFreePlan && ` · ${userInfo?.free_limit || 10} max on free plan`}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAnalytics(s => !s)} style={{ background: showAnalytics ? "rgba(6,182,212,0.15)" : "var(--card)", color: showAnalytics ? "#06b6d4" : "var(--text3)", border: `1px solid ${showAnalytics ? "rgba(6,182,212,0.3)" : "var(--border2)"}`, padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                📊 Analytics
              </button>
              <button
                onClick={() => atLimit ? onUpgrade() : setShowModal(true)}
                style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "9px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.4)", transition: "all 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.5)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.4)"; }}>
                {atLimit ? "⚡ Upgrade to Add More" : "+ Add Subscription"}
              </button>
            </div>
          </div>

          {/* Free plan limit warning */}
          {atLimit && (
            <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#a78bfa" }}>Free plan limit reached</div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>Upgrade to Pro for unlimited subscriptions.</div>
              </div>
              <button onClick={onUpgrade} style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Upgrade Now
              </button>
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            {["all", "active", "inactive"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? "rgba(124,58,237,0.15)" : "var(--card)", color: activeTab === tab ? "#a78bfa" : "var(--text3)", border: `1px solid ${activeTab === tab ? "rgba(124,58,237,0.3)" : "var(--border2)"}`, padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
                {tab}
              </button>
            ))}

            <div style={{ width: 1, height: 24, background: "var(--border2)" }} />

            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ background: "var(--card)", color: "var(--text2)", border: "1px solid var(--border2)", borderRadius: 20, padding: "7px 14px", fontSize: 13, cursor: "pointer" }}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Subscription list */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text4)" }}>
              <div style={{ width: 40, height: 40, border: "3px solid var(--border2)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              Loading subscriptions...
            </div>
          ) : filteredSubs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px", border: "2px dashed var(--border2)", borderRadius: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                {subs.length === 0 ? "No subscriptions yet" : "No subscriptions match this filter"}
              </h3>
              <p style={{ color: "var(--text3)", fontSize: 15, marginBottom: 24 }}>
                {subs.length === 0 ? "Add your first subscription to start tracking your spend." : "Try changing the filter."}
              </p>
              {subs.length === 0 && (
                <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  + Add First Subscription
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {filteredSubs.map(sub => (
                <SubCard
                  key={sub.id}
                  sub={sub}
                  onEdit={s => { setEditSub(s); setShowModal(false); }}
                  onDelete={handleDelete}
                  onToggle={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Analytics sidebar */}
        {showAnalytics && (
          <div style={{ position: "sticky", top: 88 }}>
            <AnalyticsPanel analytics={analytics} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
