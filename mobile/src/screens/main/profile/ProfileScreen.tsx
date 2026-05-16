import React, { useState, useCallback } from "react";
import Svg, { Path } from "react-native-svg";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { logout, updateUser } from "../../../store/slices/authSlice";
import { userApi } from "../../../api/userApi";
import COLORS from "../../../constants/colors";

const NAVY = "#1b3b6f";

type FieldConfig = {
  key: string;
  label: string;
  icon: string;
  iconBg: string;
  editable: boolean;
  keyboard?: "default" | "numeric" | "phone-pad" | "email-address";
};

const FIELDS: FieldConfig[] = [
  { key: "full_name",          label: "Họ và tên",               icon: "👤", iconBg: "#dbeafe", editable: true  },
  { key: "date_of_birth",      label: "Ngày sinh",                icon: "📅", iconBg: "#fef3c7", editable: true  },
  { key: "gender",             label: "Giới tính",                icon: "⚧️", iconBg: "#ede9fe", editable: true  },
  { key: "cccd",               label: "Số định danh (CCCD)",      icon: "🪪", iconBg: "#d1fae5", editable: true, keyboard: "numeric" },
  { key: "cccd_date",          label: "Ngày cấp",                 icon: "🗓️", iconBg: "#fef3c7", editable: true  },
  { key: "cccd_place",         label: "Nơi cấp",                  icon: "🏛️", iconBg: "#cffafe", editable: true  },
  { key: "address",            label: "Địa chỉ thường trú",       icon: "🏠", iconBg: "#dbeafe", editable: true  },
  { key: "phone",              label: "Số điện thoại",            icon: "📞", iconBg: "#d1fae5", editable: true, keyboard: "phone-pad" },
  { key: "email",              label: "Email",                    icon: "✉️", iconBg: "#fee2e2", editable: false },
  { key: "role",               label: "Chức vụ",                  icon: "💼", iconBg: "#ede9fe", editable: false },
  { key: "department_name",    label: "Phòng ban",                icon: "🏢", iconBg: "#fef3c7", editable: false },
  { key: "joined_date",        label: "Ngày vào làm",             icon: "📆", iconBg: "#dbeafe", editable: false },
  { key: "bank_account",       label: "Số tài khoản ngân hàng",   icon: "💳", iconBg: "#d1fae5", editable: true  },
  { key: "emergency_contact",  label: "Người liên hệ khẩn cấp",  icon: "👥", iconBg: "#fef9c3", editable: true  },
];

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user) as any;
  const hasFace = !!(user?.has_registered_face);

  const buildForm = useCallback((): Record<string, string> => ({
    full_name:          user?.fullName          || "",
    date_of_birth:      user?.date_of_birth     || "",
    gender:             user?.gender            || "",
    cccd:               user?.national_id       || "",
    cccd_date:          user?.cccd_date         || "",
    cccd_place:         user?.cccd_place        || "",
    address:            user?.address           || "",
    phone:              user?.phone             || "",
    email:              user?.email             || "",
    role:               user?.role              || "",
    department_name:    user?.department_name   || "",
    joined_date:        user?.joined_date        || "",
    bank_account:       user?.bank_account      || "",
    emergency_contact:  user?.emergency_contact || "",
  }), [user]);

  const [form, setForm] = useState<Record<string, string>>(buildForm);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, val: string) => {
    setForm(p => ({ ...p, [key]: val }));
    setHasChanges(true);
  };

  const handleDiscard = () => {
    Alert.alert("Hủy thay đổi", "Bạn có chắc muốn hủy các thay đổi chưa lưu?", [
      { text: "Tiếp tục sửa", style: "cancel" },
      {
        text: "Hủy thay đổi", style: "destructive",
        onPress: () => { setForm(buildForm()); setEditingKey(null); setHasChanges(false); },
      },
    ]);
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      Alert.alert("Lỗi", "Họ và tên không được để trống.");
      return;
    }
    try {
      setSaving(true);
      await userApi.updateProfile({
        full_name:     form.full_name,
        phone:         form.phone,
        gender:        form.gender,
        date_of_birth: form.date_of_birth  || undefined,
        national_id:   form.cccd,
        cccd_date:     form.cccd_date       || undefined,
        cccd_place:    form.cccd_place      || undefined,
        address:       form.address,
        bank_account:  form.bank_account,
      });
      dispatch(updateUser({ fullName: form.full_name, phone: form.phone }));
      Alert.alert("✓ Thành công", "Đã cập nhật thông tin cá nhân.");
      setEditingKey(null);
      setHasChanges(false);
    } catch (err: any) {
      Alert.alert("Lỗi", err?.response?.data?.message || "Không thể cập nhật.");
    } finally {
      setSaving(false);
    }
  };

  const renderRow = (field: FieldConfig, isLast: boolean) => {
    const isActive = editingKey === field.key;
    const value = form[field.key];

    return (
      <View key={field.key} style={[s.row, !isLast && s.rowDivider]}>
        {/* Icon */}
        <View style={[s.iconContainer, { backgroundColor: field.iconBg }]}>
          <Text style={s.iconEmoji}>{field.icon}</Text>
        </View>

        {/* Label + Value */}
        <View style={s.rowContent}>
          <Text style={s.rowLabel}>{field.label}</Text>
          {isActive ? (
            <TextInput
              autoFocus
              style={s.rowInput}
              value={value}
              onChangeText={t => handleChange(field.key, t)}
              onBlur={() => setEditingKey(null)}
              onSubmitEditing={() => setEditingKey(null)}
              keyboardType={field.keyboard || "default"}
              returnKeyType="done"
              selectionColor={COLORS.primary}
            />
          ) : (
            <Text style={[s.rowValue, !value && s.rowValueEmpty]} numberOfLines={2}>
              {value || "Chưa cập nhật"}
            </Text>
          )}
        </View>

        {/* Edit / Done button */}
        {field.editable && (
          <TouchableOpacity
            style={[s.actionBtn, isActive && s.actionBtnActive]}
            onPress={() => setEditingKey(isActive ? null : field.key)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isActive ? (
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17l-5-5"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            ) : (
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={s.container}>

      {/* ── HEADER ── */}
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerTop}>
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Text style={s.backText}>‹</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Thông tin cá nhân</Text>
            <View style={{ width: 34 }} />
          </View>

          <View style={s.avatarRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {(user?.fullName || "U").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName}>{user?.fullName || "—"}</Text>
              <Text style={s.profileSub}>
                {user?.role || "Nhân viên"} · {user?.department_name || "—"}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* ── BODY ── */}
      <ScrollView
        style={s.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Face registration (unchanged) */}
        <View style={s.faceCard}>
          <View style={[s.faceBadge, hasFace ? s.faceOk : s.faceWarn]}>
            <Text style={[s.faceBadgeText, hasFace ? s.faceOkText : s.faceWarnText]}>
              {hasFace ? "✓  Đã đăng ký khuôn mặt" : "⚠  Chưa đăng ký khuôn mặt"}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.faceBtn, hasFace && s.faceBtnUpdate]}
            onPress={() => navigation.navigate("RegisterFace")}
          >
            <Text style={[s.faceBtnText, hasFace && s.faceBtnUpdateText]}>
              {hasFace ? "Cập nhật" : "Đăng ký"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info card */}
        <Text style={s.sectionLabel}>THÔNG TIN CÁ NHÂN</Text>
        <View style={s.card}>
          {FIELDS.map((f, idx) => renderRow(f, idx === FIELDS.length - 1))}
        </View>

        {/* Save / Discard buttons */}
        {hasChanges && (
          <>
            <TouchableOpacity
              style={[s.saveBtn, saving && s.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={s.saveBtnText}>Lưu thay đổi</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={s.discardBtn} onPress={handleDiscard}>
              <Text style={s.discardText}>Hủy thay đổi</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Logout */}
        {!hasChanges && (
          <TouchableOpacity style={s.logoutBtn} onPress={() => dispatch(logout())}>
            <Text style={s.logoutText}>🚪  Đăng xuất</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f7" },

  /* Header */
  header: { backgroundColor: NAVY, paddingBottom: 16 },
  headerTop: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 34, height: 34,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  backText: { color: "#fff", fontSize: 22, lineHeight: 26, fontWeight: "300" },
  headerTitle: {
    flex: 1, textAlign: "center",
    fontSize: 16, fontWeight: "800", color: "#fff",
  },
  avatarRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12 },
  avatar: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    borderWidth: 2.5, borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#fff" },
  profileName: { fontSize: 16, fontWeight: "800", color: "#fff" },
  profileSub:  { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 },

  body: { flex: 1 },

  /* Face section */
  faceCard: {
    backgroundColor: "#fff",
    marginTop: 16,
    borderWidth: 1, borderColor: "#e8ecf2",
    padding: 14,
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  faceBadge: { flex: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  faceOk:        { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  faceWarn:      { backgroundColor: "#fefce8", borderColor: "#fde047" },
  faceBadgeText: { fontSize: 13, fontWeight: "700" },
  faceOkText:    { color: "#16a34a" },
  faceWarnText:  { color: "#a16207" },
  faceBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: "#fef3c7", borderRadius: 6, borderWidth: 1, borderColor: "#fcd34d",
  },
  faceBtnUpdate:     { backgroundColor: "#eff6ff", borderColor: "#93c5fd" },
  faceBtnText:       { fontSize: 13, fontWeight: "700", color: "#b45309" },
  faceBtnUpdateText: { color: "#1d4ed8" },

  /* Section label */
  sectionLabel: {
    fontSize: 11, fontWeight: "800", color: "#94a3b8", letterSpacing: 0.7,
    marginTop: 20, marginBottom: 6, paddingHorizontal: 16,
  },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#e8ecf2", overflow: "hidden",
  },

  /* Row */
  row: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 12, minHeight: 58,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },

  /* Icon */
  iconContainer: {
    width: 38, height: 38,
    borderRadius: 10,
    justifyContent: "center", alignItems: "center",
    marginRight: 12, flexShrink: 0,
  },
  iconEmoji: { fontSize: 18, lineHeight: 22 },

  /* Content */
  rowContent: { flex: 1, justifyContent: "center" },
  rowLabel: {
    fontSize: 11, color: "#94a3b8", fontWeight: "500", marginBottom: 3,
  },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  rowValueEmpty: { color: "#cbd5e1", fontWeight: "400", fontStyle: "italic" },
  rowInput: {
    fontSize: 14, fontWeight: "600", color: COLORS.primary,
    borderBottomWidth: 1.5, borderBottomColor: COLORS.primary,
    paddingVertical: 2, paddingHorizontal: 0,
  },

  /* Action button (pencil / checkmark) */
  actionBtn: {
    width: 32, height: 32,
    justifyContent: "center", alignItems: "center",
    marginLeft: 4,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  actionBtnActive: {
    backgroundColor: "#eff6ff",
  },

  /* Save */
  saveBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 24,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
    elevation: 5,
  },
  saveBtnDisabled: { opacity: 0.65 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  /* Discard */
  discardBtn: {
    marginTop: 10, paddingVertical: 12, alignItems: "center",
  },
  discardText: { color: "#94a3b8", fontSize: 14, fontWeight: "600" },

  /* Logout */
  logoutBtn: {
    backgroundColor: "#fff", marginTop: 16,
    paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: "#fee2e2",
  },
  logoutText: { color: "#ef4444", fontSize: 14, fontWeight: "700" },
});
