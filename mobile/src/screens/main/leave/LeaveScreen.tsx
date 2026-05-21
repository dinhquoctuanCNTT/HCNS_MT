import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ActivityIndicator, StatusBar, Modal,
  TextInput, Alert, RefreshControl, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { leaveApi } from "../../../api/leaveApi";

const NAVY = "#1b3b6f";
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";
const todayStr = () => new Date().toISOString().slice(0, 10);

const CATEGORY_OPTS = [
  { key: "annual",    label: "Phép năm" },
  { key: "unpaid",    label: "Không lương" },
  { key: "emergency", label: "Khẩn cấp" },
];

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending:      { label: "Chờ TBP",    color: "#92400e", bg: "#fef3c7" },
  tbp_approved: { label: "Chờ HCNS",   color: "#1e40af", bg: "#dbeafe" },
  approved:     { label: "Đã duyệt",   color: "#166534", bg: "#dcfce7" },
  rejected:     { label: "Từ chối",    color: "#991b1b", bg: "#fee2e2" },
  cancelled:    { label: "Đã hủy",     color: "#6b7280", bg: "#f3f4f6" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? { label: status, color: "#6b7280", bg: "#f3f4f6" };
  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

function CategoryTag({ cat }: { cat: string }) {
  const labels: Record<string, string> = {
    annual: "Phép năm", unpaid: "Không lương", emergency: "Khẩn cấp",
  };
  return (
    <Text style={s.catTag}>{labels[cat] ?? cat}</Text>
  );
}

// Simple date stepper: shows YYYY-MM-DD, +/- 1 day
function DateStepper({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const step = (days: number) => {
    const d = new Date(value);
    d.setDate(d.getDate() + days);
    onChange(d.toISOString().slice(0, 10));
  };
  const [dd, mm, yyyy] = value.split("-").reverse();
  return (
    <View style={s.stepperRow}>
      <Text style={s.stepperLabel}>{label}</Text>
      <View style={s.stepperCtrl}>
        <TouchableOpacity onPress={() => step(-1)} style={s.stepBtn}>
          <Text style={s.stepBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.stepperValue}>{dd}/{mm}/{yyyy}</Text>
        <TouchableOpacity onPress={() => step(1)} style={s.stepBtn}>
          <Text style={s.stepBtnText}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function LeaveScreen({ navigation: _navigation }: any) {
  const [requests, setRequests] = useState<any[]>([]);
  const [balance, setBalance]   = useState<any>(null);
  const [filter, setFilter]     = useState<string>("all");
  const [loading, setLoading]   = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal]   = useState(false);

  // Form state
  const [category, setCategory] = useState("annual");
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate,   setToDate]   = useState(todayStr());
  const [reason,   setReason]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [reqRes, balRes] = await Promise.all([
        leaveApi.getMyRequests(),
        leaveApi.getMyBalance(),
      ]);
      setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      setBalance(balRes.data ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const openModal = () => {
    setCategory("annual");
    setFromDate(todayStr());
    setToDate(todayStr());
    setReason("");
    setShowModal(true);
  };

  const submit = async () => {
    if (fromDate > toDate) {
      Alert.alert("Lỗi", "Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }
    setSubmitting(true);
    try {
      await leaveApi.create({ leave_category: category, from_date: fromDate, to_date: toDate, reason });
      setShowModal(false);
      Alert.alert("Thành công", "Đơn nghỉ phép đã được gửi");
      load();
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message || "Không thể tạo đơn");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelReq = async (id: number) => {
    Alert.alert("Xác nhận", "Huỷ đơn nghỉ phép này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Huỷ đơn", style: "destructive",
        onPress: async () => {
          try {
            await leaveApi.cancel(id);
            load();
          } catch (e: any) {
            Alert.alert("Lỗi", e.response?.data?.message || "Không thể huỷ");
          }
        },
      },
    ]);
  };

  const FILTERS = [
    { key: "all",          label: "Tất cả" },
    { key: "pending",      label: "Chờ TBP" },
    { key: "tbp_approved", label: "Chờ HCNS" },
    { key: "approved",     label: "Đã duyệt" },
    { key: "rejected",     label: "Từ chối" },
  ];

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const bal = balance ?? {};
  const remaining = ((bal.total_days ?? 0) + (bal.carried_over ?? 0) - (bal.used_days ?? 0)).toFixed(1);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />

      {/* HEADER */}
      <SafeAreaView style={{ backgroundColor: NAVY }} edges={["top"]}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Nghỉ phép</Text>
          <TouchableOpacity onPress={openModal} style={s.addBtn}>
            <Text style={s.addBtnText}>+ Tạo đơn</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={s.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={NAVY} />}
      >
        {/* BALANCE CARDS */}
        <View style={s.balSection}>
          <Text style={s.balTitle}>Số dư ngày phép năm {new Date().getFullYear()}</Text>
          <View style={s.balGrid}>
            {[
              { label: "Tổng phép",    val: (bal.total_days ?? 0) + (bal.carried_over ?? 0), color: "#3b82f6" },
              { label: "Đã dùng",      val: bal.used_days ?? 0,   color: "#f59e0b" },
              { label: "Còn lại",      val: remaining,             color: "#22c55e" },
              { label: "Sang năm trước", val: bal.carried_over ?? 0, color: "#8b5cf6" },
            ].map(c => (
              <View key={c.label} style={s.balCard}>
                <Text style={[s.balVal, { color: c.color }]}>{c.val}</Text>
                <Text style={s.balLabel}>{c.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FILTER PILLS */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[s.pill, filter === f.key && s.pillActive]}
            >
              <Text style={[s.pillText, filter === f.key && s.pillTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LIST */}
        <View style={s.listWrap}>
          {loading ? (
            <ActivityIndicator color={NAVY} style={{ marginTop: 40 }} />
          ) : filtered.length === 0 ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>Chưa có đơn nào</Text>
            </View>
          ) : (
            filtered.map((r) => (
              <View key={r.id} style={s.card}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <CategoryTag cat={r.leave_category} />
                    <Text style={s.cardDates}>
                      {fmtDate(r.from_date)} → {fmtDate(r.to_date)}
                      {"  "}
                      <Text style={s.cardDaysNum}>{r.total_days} ngày</Text>
                    </Text>
                  </View>
                  <StatusBadge status={r.status} />
                </View>

                {!!r.reason && (
                  <Text style={s.cardReason} numberOfLines={2}>{r.reason}</Text>
                )}

                {r.status === "rejected" && r.hcns_note && (
                  <Text style={s.rejectNote}>Lý do từ chối: {r.hcns_note}</Text>
                )}

                <View style={s.cardFooter}>
                  <Text style={s.cardTime}>
                    Tạo: {fmtDate(r.created_at?.slice(0, 10))}
                  </Text>
                  {r.status === "pending" && (
                    <TouchableOpacity onPress={() => cancelReq(r.id)} style={s.cancelBtn}>
                      <Text style={s.cancelBtnText}>Huỷ đơn</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* CREATE MODAL */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={s.modalOverlay}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowModal(false)} />
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Tạo đơn nghỉ phép</Text>

            {/* Category selector */}
            <Text style={s.fieldLabel}>Loại nghỉ phép</Text>
            <View style={s.catRow}>
              {CATEGORY_OPTS.map(o => (
                <TouchableOpacity
                  key={o.key}
                  onPress={() => setCategory(o.key)}
                  style={[s.catOpt, category === o.key && s.catOptActive]}
                >
                  <Text style={[s.catOptText, category === o.key && s.catOptTextActive]}>
                    {o.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date steppers */}
            <Text style={s.fieldLabel}>Ngày nghỉ</Text>
            <DateStepper label="Từ ngày" value={fromDate} onChange={setFromDate} />
            <DateStepper label="Đến ngày" value={toDate}   onChange={setToDate} />

            {/* Reason */}
            <Text style={s.fieldLabel}>Lý do</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Nhập lý do nghỉ phép..."
              multiline
              numberOfLines={3}
              style={s.textarea}
              textAlignVertical="top"
            />

            {/* Buttons */}
            <View style={s.modalBtns}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={s.cancelModalBtn}>
                <Text style={s.cancelModalBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submit}
                disabled={submitting}
                style={[s.submitBtn, submitting && { opacity: 0.6 }]}
              >
                <Text style={s.submitBtnText}>{submitting ? "Đang gửi..." : "Gửi đơn"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#f0f4f8" },
  headerRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  addBtn:      { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  addBtnText:  { color: "#fff", fontSize: 13, fontWeight: "700" },

  body: { flex: 1 },

  /* Balance */
  balSection: { margin: 16, marginBottom: 8, backgroundColor: "#fff", borderRadius: 14, padding: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  balTitle:   { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 12 },
  balGrid:    { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  balCard:    { flex: 1, minWidth: "40%", backgroundColor: "#f9fafb", borderRadius: 10, padding: 12, alignItems: "center" },
  balVal:     { fontSize: 22, fontWeight: "800" },
  balLabel:   { fontSize: 11, color: "#6b7280", marginTop: 2, textAlign: "center" },

  /* Filters */
  filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  pill:         { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#e2e8f0", borderWidth: 1, borderColor: "#e2e8f0" },
  pillActive:   { backgroundColor: NAVY, borderColor: NAVY },
  pillText:     { fontSize: 12, fontWeight: "600", color: "#64748b" },
  pillTextActive: { color: "#fff" },

  /* List */
  listWrap: { paddingHorizontal: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  cardTop:  { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  catTag:   { fontSize: 12, color: "#3b82f6", fontWeight: "700", marginBottom: 4 },
  cardDates:   { fontSize: 13, color: "#374151", fontWeight: "600" },
  cardDaysNum: { color: "#6b7280", fontWeight: "400" },
  cardReason:  { fontSize: 12, color: "#6b7280", marginTop: 8, fontStyle: "italic" },
  rejectNote:  { fontSize: 12, color: "#ef4444", marginTop: 6, fontStyle: "italic" },
  cardFooter:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  cardTime:    { fontSize: 11, color: "#9ca3af" },
  cancelBtn:   { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#ef4444" },
  cancelBtnText: { fontSize: 12, color: "#ef4444", fontWeight: "600" },

  /* Badge */
  badge:     { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: "700" },

  emptyBox:  { padding: 60, alignItems: "center" },
  emptyText: { color: "#9ca3af", fontSize: 13 },

  /* Modal */
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalSheet:   { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: "#d1d5db", alignSelf: "center", marginBottom: 20 },
  modalTitle:   { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 20 },

  fieldLabel: { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 8, marginTop: 12 },

  catRow:        { flexDirection: "row", gap: 8 },
  catOpt:        { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: "#e2e8f0", alignItems: "center" },
  catOptActive:  { borderColor: NAVY, backgroundColor: "#eff6ff" },
  catOptText:    { fontSize: 12, fontWeight: "600", color: "#6b7280" },
  catOptTextActive: { color: NAVY },

  stepperRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, backgroundColor: "#f9fafb", borderRadius: 10, padding: 12 },
  stepperLabel: { fontSize: 13, color: "#374151", fontWeight: "600" },
  stepperCtrl:  { flexDirection: "row", alignItems: "center", gap: 12 },
  stepBtn:      { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" },
  stepBtnText:  { fontSize: 18, color: "#374151", fontWeight: "300", lineHeight: 22 },
  stepperValue: { fontSize: 14, fontWeight: "700", color: "#111827", minWidth: 90, textAlign: "center" },

  textarea: { backgroundColor: "#f9fafb", borderRadius: 10, borderWidth: 1, borderColor: "#e2e8f0", padding: 12, fontSize: 13, color: "#111827", minHeight: 80, marginBottom: 4 },

  modalBtns:       { flexDirection: "row", gap: 12, marginTop: 20 },
  cancelModalBtn:  { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: "#e2e8f0", alignItems: "center" },
  cancelModalBtnText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  submitBtn:       { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: NAVY, alignItems: "center" },
  submitBtnText:   { fontSize: 15, fontWeight: "700", color: "#fff" },
});
