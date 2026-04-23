import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import { attendanceApi } from "../../../api/attendanceApi";

const COLORS = {
  primary: "#4A90D9",
  primaryLight: "#EBF4FF",
  success: "#27AE60",
  successLight: "#E8F8F0",
  warning: "#F39C12",
  warningLight: "#FEF9E7",
  danger: "#E74C3C",
  dangerLight: "#FDEDEC",
  bg: "#F0F4FA",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textMid: "#4A5568",
  textLight: "#8A9BB5",
  border: "#DDE5F0",
};

const LEAVE_TYPES = [
  { value: "annual", label: "Nghỉ phép năm", icon: "🏖️" },
  { value: "sick", label: "Nghỉ ốm", icon: "🏥" },
  { value: "unpaid", label: "Nghỉ không lương", icon: "📋" },
  { value: "other", label: "Lý do khác", icon: "📝" },
];

function StatusBadge({ status }: { status: string }) {
  const cfg: any = {
    pending: {
      label: "Chờ duyệt",
      color: COLORS.warning,
      bg: COLORS.warningLight,
    },
    approved: {
      label: "Đã duyệt",
      color: COLORS.success,
      bg: COLORS.successLight,
    },
    rejected: {
      label: "Từ chối",
      color: COLORS.danger,
      bg: COLORS.dangerLight,
    },
  };
  const c = cfg[status] ?? cfg.pending;
  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

export default function LeaveScreen({ navigation }: any) {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [leaveType, setLeaveType] = useState("annual");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await attendanceApi.getLeaveRequests();
      setLeaves(res.data?.data ?? []);
    } catch (e) {
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate) return;
    try {
      setSubmitting(true);
      await attendanceApi.createLeaveRequest({
        leave_type: leaveType,
        from_date: fromDate,
        to_date: toDate,
        reason,
      });
      setShowForm(false);
      setFromDate("");
      setToDate("");
      setReason("");
      fetchLeaves();
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.back}>← Quay về</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Đơn xin nghỉ</Text>
        <TouchableOpacity style={s.btnAdd} onPress={() => setShowForm(true)}>
          <Text style={s.btnAddText}>+ Tạo</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          color={COLORS.primary}
          size="large"
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
          {leaves.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>📝</Text>
              <Text style={s.emptyText}>Chưa có đơn xin nghỉ nào</Text>
              <TouchableOpacity
                style={s.btnCreate}
                onPress={() => setShowForm(true)}
              >
                <Text style={s.btnCreateText}>Tạo đơn đầu tiên</Text>
              </TouchableOpacity>
            </View>
          ) : (
            leaves.map((leave, i) => {
              const type =
                LEAVE_TYPES.find((t) => t.value === leave.leave_type) ??
                LEAVE_TYPES[3];
              return (
                <View key={i} style={s.leaveCard}>
                  <View style={s.leaveCardTop}>
                    <View style={s.leaveTypeRow}>
                      <Text style={s.leaveIcon}>{type.icon}</Text>
                      <Text style={s.leaveTypeLabel}>{type.label}</Text>
                    </View>
                    <StatusBadge status={leave.status} />
                  </View>
                  <View style={s.leaveDates}>
                    <Text style={s.leaveDateText}>
                      📅 {new Date(leave.from_date).toLocaleDateString("vi-VN")}
                      {leave.from_date !== leave.to_date
                        ? ` → ${new Date(leave.to_date).toLocaleDateString("vi-VN")}`
                        : ""}
                    </Text>
                    <Text style={s.leaveDays}>{leave.total_days} ngày</Text>
                  </View>
                  {leave.reason ? (
                    <Text style={s.leaveReason} numberOfLines={2}>
                      {leave.reason}
                    </Text>
                  ) : null}
                  {leave.reject_reason ? (
                    <Text style={s.leaveRejectReason}>
                      Lý do từ chối: {leave.reject_reason}
                    </Text>
                  ) : null}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={s.modalBg}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Tạo đơn xin nghỉ</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Loại nghỉ */}
              <Text style={s.fieldLabel}>Loại nghỉ</Text>
              <View style={s.typeGrid}>
                {LEAVE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    style={[
                      s.typeBtn,
                      leaveType === t.value && s.typeBtnActive,
                    ]}
                    onPress={() => setLeaveType(t.value)}
                  >
                    <Text style={s.typeBtnIcon}>{t.icon}</Text>
                    <Text
                      style={[
                        s.typeBtnText,
                        leaveType === t.value && s.typeBtnTextActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Ngày */}
              <View style={s.dateRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.fieldLabel}>Từ ngày</Text>
                  <TextInput
                    style={s.input}
                    placeholder="YYYY-MM-DD"
                    value={fromDate}
                    onChangeText={setFromDate}
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.fieldLabel}>Đến ngày</Text>
                  <TextInput
                    style={s.input}
                    placeholder="YYYY-MM-DD"
                    value={toDate}
                    onChangeText={setToDate}
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              </View>

              {/* Lý do */}
              <Text style={s.fieldLabel}>Lý do</Text>
              <TextInput
                style={[s.input, s.textarea]}
                placeholder="Nhập lý do xin nghỉ..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                placeholderTextColor={COLORS.textLight}
              />

              <TouchableOpacity
                style={[
                  s.btnSubmit,
                  (!fromDate || !toDate) && { opacity: 0.5 },
                ]}
                onPress={handleSubmit}
                disabled={!fromDate || !toDate || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.btnSubmitText}>Gửi đơn</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { color: COLORS.primary, fontSize: 14, fontWeight: "600" },
  headerTitle: { color: COLORS.textDark, fontSize: 17, fontWeight: "700" },
  btnAdd: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  btnAddText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.textLight, fontSize: 14, marginBottom: 20 },
  btnCreate: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  btnCreateText: { color: "#fff", fontWeight: "700" },
  leaveCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    shadowColor: "rgba(0,0,0,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  leaveCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveTypeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  leaveIcon: { fontSize: 20 },
  leaveTypeLabel: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  leaveDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveDateText: { fontSize: 13, color: COLORS.textMid },
  leaveDays: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  leaveReason: { fontSize: 12, color: COLORS.textLight, lineHeight: 18 },
  leaveRejectReason: {
    fontSize: 12,
    color: COLORS.danger,
    fontStyle: "italic",
  },
  // Modal
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textDark },
  modalClose: { fontSize: 20, color: COLORS.textLight },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textMid,
    marginBottom: 6,
    marginTop: 12,
  },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  typeBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  typeBtnIcon: { fontSize: 16 },
  typeBtnText: { fontSize: 12, color: COLORS.textMid, fontWeight: "600" },
  typeBtnTextActive: { color: COLORS.primary },
  dateRow: { flexDirection: "row", gap: 10 },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.textDark,
    backgroundColor: COLORS.bg,
  },
  textarea: { height: 80, textAlignVertical: "top" },
  btnSubmit: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnSubmitText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
