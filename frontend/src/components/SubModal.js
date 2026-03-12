import { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, CATEGORIES, BILLING_CYCLES, categoryColors } from "../theme";
import { api } from "../api";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

export default function SubModal({ visible, sub, onClose, onSaved }) {
  const isEdit = Boolean(sub?.id);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name:              sub?.name              || "",
    category:          sub?.category          || "Entertainment",
    amount:            sub?.amount?.toString() || "",
    currency:          sub?.currency          || "USD",
    billing_cycle:     sub?.billing_cycle     || "monthly",
    next_billing_date: sub?.next_billing_date ? sub.next_billing_date.split("T")[0] : today,
    notes:             sub?.notes             || "",
    color:             sub?.color             || categoryColors["Entertainment"],
    is_active:         sub?.is_active !== undefined ? sub.is_active : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Reset form when sub prop changes
  useState(() => {
    if (sub) {
      setForm({
        name:              sub.name              || "",
        category:          sub.category          || "Entertainment",
        amount:            sub.amount?.toString() || "",
        currency:          sub.currency          || "USD",
        billing_cycle:     sub.billing_cycle     || "monthly",
        next_billing_date: sub.next_billing_date ? sub.next_billing_date.split("T")[0] : today,
        notes:             sub.notes             || "",
        color:             sub.color             || categoryColors["Entertainment"],
        is_active:         sub.is_active !== undefined ? sub.is_active : true,
      });
    }
  }, [sub]);

  const set = (key) => (val) => {
    setForm(p => {
      const next = { ...p, [key]: val };
      if (key === "category") next.color = categoryColors[val] || "#475569";
      return next;
    });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.name.trim())                           return setError("Name is required.");
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return setError("Enter a valid amount.");
    if (!form.next_billing_date)                      return setError("Select a billing date.");

    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      const data = isEdit ? await api.updateSub(sub.id, payload) : await api.createSub(payload);
      onSaved(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.safe}>
        <View style={s.header}>
          <Text style={s.title}>{isEdit ? "Edit Subscription" : "Add Subscription"}</Text>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Text style={s.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠️  {error}</Text>
            </View>
          ) : null}

          <View style={s.field}>
            <Text style={s.label}>Service Name *</Text>
            <TextInput style={s.input} placeholder="e.g. Netflix" placeholderTextColor={colors.text4} value={form.name} onChangeText={set("name")} />
          </View>

          <View style={s.row}>
            <View style={[s.field, { flex: 1 }]}>
              <Text style={s.label}>Amount *</Text>
              <TextInput style={s.input} placeholder="9.99" placeholderTextColor={colors.text4} value={form.amount} onChangeText={set("amount")} keyboardType="decimal-pad" />
            </View>
            <View style={[s.field, { flex: 1 }]}>
              <Text style={s.label}>Currency</Text>
              <View style={s.picker}>
                {CURRENCIES.map(c => (
                  <TouchableOpacity key={c} onPress={() => set("currency")(c)} style={[s.chip, form.currency === c && s.chipActive]}>
                    <Text style={[s.chipText, form.currency === c && s.chipActiveText]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Billing Cycle</Text>
            <View style={s.toggleRow}>
              {BILLING_CYCLES.map(b => (
                <TouchableOpacity key={b.value} onPress={() => set("billing_cycle")(b.value)} style={[s.toggleBtn, form.billing_cycle === b.value && s.toggleActive]}>
                  <Text style={[s.toggleText, form.billing_cycle === b.value && s.toggleActiveText]}>{b.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Next Billing Date</Text>
            <TextInput
              style={s.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text4}
              value={form.next_billing_date}
              onChangeText={set("next_billing_date")}
              keyboardType="numeric"
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Category</Text>
            <View style={s.catGrid}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} onPress={() => set("category")(c)} style={[s.catChip, form.category === c && { borderColor: categoryColors[c] || colors.primary, backgroundColor: (categoryColors[c] || colors.primary) + "22" }]}>
                  <Text style={[s.catChipText, form.category === c && { color: categoryColors[c] || colors.primary }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Notes (optional)</Text>
            <TextInput style={[s.input, { height: 72, textAlignVertical: "top" }]} placeholder="Any notes..." placeholderTextColor={colors.text4} value={form.notes} onChangeText={set("notes")} multiline />
          </View>

          {isEdit && (
            <View style={s.field}>
              <Text style={s.label}>Status</Text>
              <View style={s.toggleRow}>
                {[{ v: true, l: "Active" }, { v: false, l: "Paused" }].map(o => (
                  <TouchableOpacity key={String(o.v)} onPress={() => set("is_active")(o.v)} style={[s.toggleBtn, form.is_active === o.v && s.toggleActive]}>
                    <Text style={[s.toggleText, form.is_active === o.v && s.toggleActiveText]}>{o.l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={s.btnRow}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <LinearGradient colors={loading ? ["rgba(124,58,237,0.5)", "rgba(6,182,212,0.5)"] : [colors.primary, colors.cyan]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.saveBtn]}>
              <TouchableOpacity style={s.saveBtnInner} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.saveText}>{isEdit ? "Save Changes" : "Add Subscription"}</Text>}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.bg, paddingTop: Platform.OS === "android" ? 24 : 0 },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderColor: colors.border2 },
  title:        { fontFamily: "Poppins_800ExtraBold", fontSize: 18, color: colors.text },
  closeBtn:     { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  closeText:    { fontFamily: "Inter_400Regular", fontSize: 18, color: colors.text3 },
  scroll:       { padding: 20 },

  errorBox:     { backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: "rgba(239,68,68,0.3)", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:    { fontFamily: "Inter_500Medium", fontSize: 13, color: "#fca5a5" },

  field:        { marginBottom: 18 },
  row:          { flexDirection: "row", gap: 12 },
  label:        { fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.text3, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 },
  input:        { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border2, borderRadius: 10, padding: 13, fontSize: 15, color: colors.text, fontFamily: "Inter_400Regular" },

  picker:       { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip:         { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.border2, backgroundColor: colors.bg2 },
  chipActive:   { borderColor: colors.primary, backgroundColor: colors.primary + "22" },
  chipText:     { fontFamily: "Inter_500Medium", fontSize: 12, color: colors.text3 },
  chipActiveText:{ color: colors.primaryLight },

  toggleRow:    { flexDirection: "row", gap: 8 },
  toggleBtn:    { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border2, alignItems: "center", backgroundColor: colors.bg2 },
  toggleActive: { borderColor: colors.primary, backgroundColor: colors.primary + "22" },
  toggleText:   { fontFamily: "Inter_500Medium", fontSize: 14, color: colors.text3 },
  toggleActiveText: { color: colors.primaryLight, fontFamily: "Inter_600SemiBold" },

  catGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catChip:      { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.border2, backgroundColor: colors.bg2 },
  catChipText:  { fontFamily: "Inter_500Medium", fontSize: 13, color: colors.text3 },

  btnRow:       { flexDirection: "row", gap: 12, marginTop: 8, marginBottom: 40 },
  cancelBtn:    { flex: 1, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border2, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  cancelText:   { fontFamily: "Inter_600SemiBold", fontSize: 15, color: colors.text3 },
  saveBtn:      { flex: 2, borderRadius: 12 },
  saveBtnInner: { paddingVertical: 15, alignItems: "center" },
  saveText:     { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
});
