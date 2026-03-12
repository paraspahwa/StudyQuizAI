import { useState } from "react";

export default function LandingPage({ onGetStarted, onLogin, onViewPricing }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    { icon: "📋", title: "Track Everything", desc: "Add all your subscriptions in seconds. Netflix, Spotify, SaaS tools — one place." },
    { icon: "📊", title: "Spending Analytics", desc: "See exactly how much you spend monthly and yearly, broken down by category." },
    { icon: "🔔", title: "Renewal Alerts", desc: "Never get surprised by a charge again. Know what's due in the next 30 days." },
    { icon: "✂️", title: "Spot Waste", desc: "Identify unused subscriptions draining your wallet. Cancel with confidence." },
    { icon: "📁", title: "Organize by Category", desc: "Group subs by Entertainment, Productivity, Health, and more." },
    { icon: "🔒", title: "Private & Secure", desc: "Your financial data stays yours. Encrypted, no ads, no data selling." },
  ];

  const stats = [
    { value: "$273", label: "avg. monthly spend on subscriptions" },
    { value: "12+", label: "subscriptions the average person has" },
    { value: "3+", label: "forgotten subscriptions per person" },
  ];

  const testimonials = [
    { name: "Sarah K.", role: "Freelance Designer", text: "Found $89/month in subscriptions I completely forgot about. Paid for itself in day one.", avatar: "SK" },
    { name: "Marcus T.", role: "Software Engineer", text: "Finally have a clear picture of my SaaS spend. The renewal alerts alone are worth it.", avatar: "MT" },
    { name: "Priya M.", role: "Product Manager", text: "Cancelled 4 subscriptions in the first week. The analytics are eye-opening.", avatar: "PM" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,26,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border2)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>💳</span>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, background: "linear-gradient(135deg,#a78bfa,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SubTrack</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={onViewPricing} style={{ background: "none", color: "var(--text3)", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--text3)"}>
              Pricing
            </button>
            <button onClick={onLogin} style={{ background: "none", color: "var(--text2)", border: "1px solid var(--border2)", padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "var(--primary-light)"; e.currentTarget.style.color = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}>
              Log In
            </button>
            <button onClick={onGetStarted} style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.4)", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(124,58,237,0.5)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.4)"; }}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, background: "radial-gradient(ellipse,rgba(124,58,237,0.2) 0%,transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 32, fontSize: 13, fontWeight: 600, color: "#a78bfa" }}>
            💡 The average person wastes $89/month on forgotten subscriptions
          </div>

          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Stop Losing Money to{" "}
            <span style={{ background: "linear-gradient(135deg,#a78bfa,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Forgotten Subscriptions
            </span>
          </h1>

          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "var(--text2)", lineHeight: 1.7, marginBottom: 48, maxWidth: 620, margin: "0 auto 48px" }}>
            Track every subscription in one place. See your true monthly spend, catch renewals before they hit, and cut what you don't use.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
            <button onClick={onGetStarted} style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 14, fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.5)", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.6)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.5)"; }}>
              Start Tracking Free →
            </button>
            <button onClick={onViewPricing} style={{ background: "transparent", color: "var(--text2)", border: "1px solid var(--border2)", padding: "16px 32px", borderRadius: 14, fontSize: 17, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#a78bfa"; e.currentTarget.style.color = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}>
              See Pricing
            </button>
          </div>

          <p style={{ fontSize: 13, color: "var(--text4)" }}>Free forever • No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid var(--border2)", borderBottom: "1px solid var(--border2)", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 48, fontWeight: 900, background: "linear-gradient(135deg,#a78bfa,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 14, color: "var(--text3)", marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, marginBottom: 16 }}>
              Everything you need to take control
            </h2>
            <p style={{ fontSize: 18, color: "var(--text3)", maxWidth: 500, margin: "0 auto" }}>
              Simple, powerful tools to manage your subscriptions and protect your budget.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{ background: "var(--card)", border: `1px solid ${hoveredFeature === i ? "rgba(124,58,237,0.5)" : "var(--border2)"}`, borderRadius: 20, padding: "32px", transition: "all 0.2s", transform: hoveredFeature === i ? "translateY(-4px)" : "none", boxShadow: hoveredFeature === i ? "var(--shadow-glow)" : "none" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "var(--text3)", fontSize: 15, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO PREVIEW */}
      <section style={{ padding: "80px 24px", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800 }}>
              Your subscriptions, beautifully organized
            </h2>
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: 24, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Monthly Spend", value: "$127.94", color: "#7c3aed" },
                { label: "Yearly Total", value: "$1,535", color: "#06b6d4" },
                { label: "Active Subs", value: "8", color: "#10b981" },
                { label: "Due This Month", value: "3", color: "#f59e0b" },
              ].map((card, i) => (
                <div key={i} style={{ background: "var(--bg)", borderRadius: 14, padding: "20px", border: `1px solid ${card.color}33` }}>
                  <div style={{ fontSize: 12, color: "var(--text4)", marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 800, color: card.color }}>{card.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "Netflix", cat: "Entertainment", amount: "$15.99", color: "#e50914", days: 5 },
                { name: "Spotify", cat: "Entertainment", amount: "$9.99", color: "#1db954", days: 12 },
                { name: "GitHub Pro", cat: "Productivity", amount: "$4.00", color: "#6e40c9", days: 18 },
                { name: "Notion", cat: "Productivity", amount: "$16.00", color: "#555", days: 25 },
              ].map((sub, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg2)", borderRadius: 12, padding: "14px 18px", border: "1px solid var(--border2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: sub.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {sub.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{sub.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text4)" }}>{sub.cat}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{sub.amount}</div>
                    <div style={{ fontSize: 12, color: sub.days <= 7 ? "#f59e0b" : "var(--text4)" }}>
                      {sub.days <= 7 ? `⚡ ${sub.days}d` : `in ${sub.days}d`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800 }}>
              People are saving real money
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border2)", borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                  "{t.text}"
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text4)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "var(--bg2)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, marginBottom: 16 }}>
            Start saving money today
          </h2>
          <p style={{ fontSize: 17, color: "var(--text3)", marginBottom: 36 }}>
            Free forever for up to 10 subscriptions. No credit card required.
          </p>
          <button onClick={onGetStarted} style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", padding: "18px 48px", borderRadius: 14, fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.5)", transition: "all 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(124,58,237,0.6)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.5)"; }}>
            Get Started — It's Free →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", borderTop: "1px solid var(--border2)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>💳</span>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text3)" }}>SubTrack</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text4)" }}>© 2025 SubTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
