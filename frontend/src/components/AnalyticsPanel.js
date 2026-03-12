import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors, categoryColors } from "../theme";

const { width } = Dimensions.get("window");

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;
  const { monthly_total, yearly_total, active_count, by_category, upcoming_renewals, most_expensive } = analytics;

  const catEntries = Object.entries(by_category).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries[0]?.[1] || 1;

  return (
    <View style={s.wrap}>
      {/* Summary row */}
      <View style={s.summaryRow}>
        {[
          { label: "Monthly",  value: `$${monthly_total.toFixed(2)}`, color: colors.primary },
          { label: "Yearly",   value: `$${yearly_total.toFixed(0)}`,  color: colors.cyan    },
          { label: "Active",   value: String(active_count),           color: colors.success },
          { label: "Due 30d",  value: String(upcoming_renewals.length),color: colors.warning },
        ].map((c, i) => (
          <View key={i} style={[s.summaryCard, { borderColor: c.color + "22" }]}>
            <Text style={s.summaryLabel}>{c.label}</Text>
            <Text style={[s.summaryValue, { color: c.color }]}>{c.value}</Text>
          </View>
        ))}
      </View>

      {/* Spend by category */}
      {catEntries.length > 0 && (
        <View style={s.block}>
          <Text style={s.blockTitle}>Spend by Category</Text>
          {catEntries.map(([cat, val]) => (
            <View key={cat} style={s.catRow}>
              <View style={s.catLabel}>
                <Text style={s.catName}>{cat}</Text>
                <Text style={s.catAmt}>${val.toFixed(2)}/mo</Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${(val / maxCat) * 100}%`, backgroundColor: categoryColors[cat] || colors.primary }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Upcoming renewals */}
      {upcoming_renewals.length > 0 && (
        <View style={[s.block, { borderColor: "rgba(245,158,11,0.2)" }]}>
          <Text style={[s.blockTitle, { color: colors.warning }]}>🔔  Upcoming Renewals</Text>
          {upcoming_renewals.map(sub => {
            const d = daysUntil(sub.next_billing_date);
            return (
              <View key={sub.id} style={s.renewRow}>
                <View style={[s.renewAvatar, { backgroundColor: sub.color || categoryColors[sub.category] || "#475569" }]}>
                  <Text style={s.renewAvatarText}>{sub.name[0]}</Text>
                </View>
                <Text style={s.renewName} numberOfLines={1}>{sub.name}</Text>
                <View style={{ marginLeft: "auto", alignItems: "flex-end" }}>
                  <Text style={s.renewAmt}>${sub.amount}</Text>
                  <Text style={[s.renewDays, d <= 3 ? { color: colors.warning } : {}]}>
                    {d === 0 ? "Today" : `${d}d`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Most expensive */}
      {most_expensive.length > 0 && (
        <View style={s.block}>
          <Text style={s.blockTitle}>💸  Most Expensive</Text>
          {most_expensive.map((sub, i) => (
            <View key={sub.id} style={s.expRow}>
              <Text style={s.expRank}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</Text>
              <Text style={s.expName} numberOfLines={1}>{sub.name}</Text>
              <Text style={s.expAmt}>${sub.monthly_cost.toFixed(2)}/mo</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:         { paddingBottom: 20 },

  summaryRow:   { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  summaryCard:  { flex: 1, minWidth: "44%", backgroundColor: colors.card, borderWidth: 1, borderRadius: 14, padding: 14 },
  summaryLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: colors.text4, textTransform: "uppercase", letterSpacing: 0.5 },
  summaryValue: { fontFamily: "Poppins_800ExtraBold", fontSize: 20, marginTop: 4 },

  block:        { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border2, borderRadius: 16, padding: 18, marginBottom: 12 },
  blockTitle:   { fontFamily: "Inter_700Bold", fontSize: 14, color: colors.text, marginBottom: 14 },

  catRow:       { marginBottom: 12 },
  catLabel:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  catName:      { fontFamily: "Inter_500Medium", fontSize: 13, color: colors.text2 },
  catAmt:       { fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.text },
  barBg:        { height: 6, backgroundColor: colors.bg, borderRadius: 3, overflow: "hidden" },
  barFill:      { height: "100%", borderRadius: 3 },

  renewRow:     { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  renewAvatar:  { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  renewAvatarText: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#fff" },
  renewName:    { fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.text, flex: 1 },
  renewAmt:     { fontFamily: "Inter_700Bold", fontSize: 13, color: colors.text },
  renewDays:    { fontFamily: "Inter_400Regular", fontSize: 11, color: colors.text4 },

  expRow:       { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  expRank:      { fontSize: 16 },
  expName:      { fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.text, flex: 1 },
  expAmt:       { fontFamily: "Inter_700Bold", fontSize: 13, color: colors.text },
});
