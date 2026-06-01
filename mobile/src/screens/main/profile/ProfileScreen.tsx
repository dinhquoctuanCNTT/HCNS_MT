import React, { useState, useCallback, useRef } from "react";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { logout, updateUser } from "../../../store/slices/authSlice";
import { userApi } from "../../../api/userApi";
import COLORS from "../../../constants/colors";

const NAVY = "#1b3b6f";
const ITEM_H = 44;
const VISIBLE = 5;

/* ── Date helpers ── */
function toDisplay(raw: string): string {
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const [y, m, d] = raw.substring(0, 10).split("-");
    return `${d}/${m}/${y}`;
  }
  if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(raw)) return raw.replace(/-/g, "/");
  return raw;
}

function toISO(display: string): string {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(display)) {
    const [d, m, y] = display.split("/");
    return `${y}-${m}-${d}`;
  }
  return display;
}

/* ── Wheel Column ── */
function WheelColumn({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  const ref = useRef<FlatList>(null);

  const onMomentumEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
    onSelect(Math.max(0, Math.min(idx, items.length - 1)));
  };

  return (
    <View style={{ flex: 1, height: ITEM_H * VISIBLE }}>
      {/* Selection highlight */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: ITEM_H * 2,
          left: 0, right: 0,
          height: ITEM_H,
          backgroundColor: "#e8f0fe",
          borderRadius: 8,
        }}
      />
      <FlatList
        ref={ref}
        data={items}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, i) => ({ length: ITEM_H, offset: ITEM_H * i, index: i })}
        initialScrollIndex={Math.max(0, selectedIndex)}
        ListHeaderComponent={<View style={{ height: ITEM_H * 2 }} />}
        ListFooterComponent={<View style={{ height: ITEM_H * 2 }} />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{ height: ITEM_H, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              ref.current?.scrollToIndex({ index, animated: true });
              onSelect(index);
            }}
          >
            <Text style={{
              fontSize: index === selectedIndex ? 16 : 14,
              fontWeight: index === selectedIndex ? "700" : "400",
              color: index === selectedIndex ? COLORS.primary : "#64748b",
            }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ── Date Picker Modal ── */
function DatePickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
  label,
}: {
  visible: boolean;
  value: string;
  onConfirm: (v: string) => void;
  onCancel: () => void;
  label: string;
}) {
  const days   = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const curYear = new Date().getFullYear();
  const years  = Array.from({ length: 80 }, (_, i) => String(curYear - i));

  const parse = (v: string) => {
    const d = toDisplay(v);
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      const [dd, mm, yyyy] = d.split("/");
      return { day: dd, month: mm, year: yyyy };
    }
    return { day: "01", month: "01", year: String(curYear - 25) };
  };

  const init = parse(value);
  const [day,   setDay]   = useState(init.day);
  const [month, setMonth] = useState(init.month);
  const [year,  setYear]  = useState(init.year);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <TouchableOpacity style={pk.overlay} activeOpacity={1} onPress={onCancel} />
      <View style={pk.sheet}>
        <View style={pk.sheetHeader}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={pk.cancel}>Huỷ</Text>
          </TouchableOpacity>
          <Text style={pk.sheetTitle}>{label}</Text>
          <TouchableOpacity onPress={() => onConfirm(`${day}/${month}/${year}`)}>
            <Text style={pk.confirm}>Xong</Text>
          </TouchableOpacity>
        </View>
        <View style={pk.colLabels}>
          <Text style={pk.colLabel}>Ngày</Text>
          <Text style={pk.colLabel}>Tháng</Text>
          <Text style={pk.colLabel}>Năm</Text>
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
          <WheelColumn items={days}   selectedIndex={days.indexOf(day)}       onSelect={i => setDay(days[i])} />
          <WheelColumn items={months} selectedIndex={months.indexOf(month)}   onSelect={i => setMonth(months[i])} />
          <WheelColumn items={years}  selectedIndex={years.indexOf(year)}     onSelect={i => setYear(years[i])} />
        </View>
      </View>
    </Modal>
  );
}

/* ── Gender Modal ── */
function GenderModal({
  visible,
  value,
  onSelect,
  onCancel,
}: {
  visible: boolean;
  value: string;
  onSelect: (v: string) => void;
  onCancel: () => void;
}) {
  const options = ["Nam", "Nữ", "Khác"];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <TouchableOpacity style={pk.overlay} activeOpacity={1} onPress={onCancel} />
      <View style={pk.sheet}>
        <View style={pk.sheetHeader}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={pk.cancel}>Huỷ</Text>
          </TouchableOpacity>
          <Text style={pk.sheetTitle}>Giới tính</Text>
          <View style={{ width: 48 }} />
        </View>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[pk.genderItem, opt === value && pk.genderItemActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[pk.genderText, opt === value && pk.genderTextActive]}>{opt}</Text>
            {opt === value && <Text style={{ color: COLORS.primary, fontSize: 18 }}>✓</Text>}
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </View>
    </Modal>
  );
}

/* ── Field config ── */
type FieldConfig = {
  key: string;
  label: string;
  icon: string;
  iconBg: string;
  editable: boolean;
  type?: "text" | "date" | "gender";
  keyboard?: "default" | "numeric" | "phone-pad" | "email-address";
};

type IconDef = { lib: "ion" | "mci"; name: string; color: string };

const FIELDS: (FieldConfig & { iconDef: IconDef })[] = [
  { key: "full_name",         label: "Họ và tên",              icon: "", iconBg: "#dbeafe", editable: true,  iconDef: { lib: "ion", name: "person",              color: "#3b82f6" } },
  { key: "date_of_birth",     label: "Ngày sinh",               icon: "", iconBg: "#fef3c7", editable: true,  type: "date",   iconDef: { lib: "ion", name: "calendar",            color: "#f59e0b" } },
  { key: "gender",            label: "Giới tính",               icon: "", iconBg: "#ede9fe", editable: true,  type: "gender", iconDef: { lib: "mci", name: "gender-male-female",  color: "#8b5cf6" } },
  { key: "cccd",              label: "Số định danh (CCCD)",     icon: "", iconBg: "#d1fae5", editable: true,  keyboard: "numeric", iconDef: { lib: "ion", name: "card",           color: "#10b981" } },
  { key: "cccd_date",         label: "Ngày cấp",                icon: "", iconBg: "#fef3c7", editable: true,  type: "date",   iconDef: { lib: "ion", name: "calendar-outline",   color: "#f59e0b" } },
  { key: "cccd_place",        label: "Nơi cấp",                 icon: "", iconBg: "#cffafe", editable: true,  iconDef: { lib: "ion", name: "business",            color: "#06b6d4" } },
  { key: "address",           label: "Địa chỉ thường trú",      icon: "", iconBg: "#dbeafe", editable: true,  iconDef: { lib: "ion", name: "home",                color: "#3b82f6" } },
  { key: "phone",             label: "Số điện thoại",           icon: "", iconBg: "#d1fae5", editable: true,  keyboard: "phone-pad", iconDef: { lib: "ion", name: "call",         color: "#10b981" } },
  { key: "email",             label: "Email",                   icon: "", iconBg: "#fee2e2", editable: false, iconDef: { lib: "ion", name: "mail",                color: "#ef4444" } },
  { key: "role",              label: "Chức vụ",                 icon: "", iconBg: "#ede9fe", editable: false, iconDef: { lib: "ion", name: "briefcase",           color: "#8b5cf6" } },
  { key: "department_name",   label: "Phòng ban",               icon: "", iconBg: "#fef3c7", editable: false, iconDef: { lib: "mci", name: "office-building",    color: "#f59e0b" } },
  { key: "joined_date",       label: "Ngày vào làm",            icon: "", iconBg: "#dbeafe", editable: false, type: "date",   iconDef: { lib: "ion", name: "time",             color: "#3b82f6" } },
  { key: "bank_account",      label: "Số tài khoản ngân hàng",  icon: "", iconBg: "#d1fae5", editable: true,  iconDef: { lib: "ion", name: "wallet",              color: "#10b981" } },
  { key: "emergency_contact", label: "Người liên hệ khẩn cấp", icon: "", iconBg: "#fef9c3", editable: true,  iconDef: { lib: "ion", name: "people",              color: "#eab308" } },
];

/* ── Main Screen ── */
export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user) as any;
  const hasFace = !!(user?.has_registered_face);

  const buildForm = useCallback((): Record<string, string> => ({
    full_name:          user?.fullName          || "",
    date_of_birth:      toDisplay(user?.date_of_birth  || ""),
    gender:             user?.gender            || "",
    cccd:               user?.national_id       || "",
    cccd_date:          toDisplay(user?.cccd_date       || ""),
    cccd_place:         user?.cccd_place        || "",
    address:            user?.address           || "",
    phone:              user?.phone             || "",
    email:              user?.email             || "",
    role:               user?.role              || "",
    department_name:    user?.department_name   || "",
    joined_date:        toDisplay(user?.joined_date     || ""),
    bank_account:       user?.bank_account      || "",
    emergency_contact:  user?.emergency_contact || "",
  }), [user]);

  const [form, setForm]             = useState<Record<string, string>>(buildForm);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [datePicker, setDatePicker] = useState<{ key: string; label: string } | null>(null);
  const [genderOpen, setGenderOpen] = useState(false);

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
        date_of_birth: form.date_of_birth ? toISO(form.date_of_birth) : undefined,
        national_id:   form.cccd,
        cccd_date:     form.cccd_date     ? toISO(form.cccd_date)     : undefined,
        cccd_place:    form.cccd_place    || undefined,
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
    const isDate   = field.type === "date";
    const isGender = field.type === "gender";

    return (
      <View key={field.key} style={[s.row, !isLast && s.rowDivider]}>
        <View style={[s.iconContainer, { backgroundColor: field.iconBg }]}>
          {field.iconDef.lib === "ion"
            ? <Ionicons name={field.iconDef.name as any} size={18} color={field.iconDef.color} />
            : <MaterialCommunityIcons name={field.iconDef.name as any} size={18} color={field.iconDef.color} />
          }
        </View>

        <View style={s.rowContent}>
          <Text style={s.rowLabel}>{field.label}</Text>
          {isActive && !isDate && !isGender ? (
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
            <Text style={[s.rowValue, !value && s.rowValueEmpty]} numberOfLines={1}>
              {value || "Chưa cập nhật"}
            </Text>
          )}
        </View>

        {field.editable && (
          <TouchableOpacity
            style={[s.actionBtn, isActive && s.actionBtnActive]}
            onPress={() => {
              if (isDate)   { setDatePicker({ key: field.key, label: field.label }); return; }
              if (isGender) { setGenderOpen(true); return; }
              setEditingKey(isActive ? null : field.key);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isActive && !isDate && !isGender ? (
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M20 6L9 17l-5-5" stroke={COLORS.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            ) : (
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={s.container}>
      {/* Date Picker Modal */}
      {datePicker && (
        <DatePickerModal
          visible={!!datePicker}
          value={form[datePicker.key]}
          label={datePicker.label}
          onConfirm={(v) => {
            handleChange(datePicker.key, v);
            setDatePicker(null);
          }}
          onCancel={() => setDatePicker(null)}
        />
      )}

      {/* Gender Modal */}
      <GenderModal
        visible={genderOpen}
        value={form.gender}
        onSelect={(v) => { handleChange("gender", v); setGenderOpen(false); }}
        onCancel={() => setGenderOpen(false)}
      />

      {/* ── HEADER ── */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <View style={s.headerTop}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Thông tin cá nhân</Text>
          <View style={{ width: 34 }} />
        </View>
        <View style={s.avatarRow}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{(user?.fullName || "U").charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.profileName}>{user?.fullName || "—"}</Text>
            <Text style={s.profileSub}>{user?.role || "Nhân viên"} · {user?.department_name || "—"}</Text>
          </View>
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView
        style={s.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.faceCard}>
          <View style={[s.faceBadge, hasFace ? s.faceOk : s.faceWarn]}>
            <Text style={[s.faceBadgeText, hasFace ? s.faceOkText : s.faceWarnText]}>
              {hasFace ? "Đã đăng ký khuôn mặt" : "Chưa đăng ký khuôn mặt"}
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

        <Text style={s.sectionLabel}>THÔNG TIN CÁ NHÂN</Text>
        <View style={s.card}>
          {FIELDS.map((f, idx) => renderRow(f, idx === FIELDS.length - 1))}
        </View>

        {hasChanges && (
          <>
            <TouchableOpacity style={[s.saveBtn, saving && s.saveBtnDisabled]} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
              {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveBtnText}>Lưu thay đổi</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={s.discardBtn} onPress={handleDiscard}>
              <Text style={s.discardText}>Hủy thay đổi</Text>
            </TouchableOpacity>
          </>
        )}

        {!hasChanges && (
          <TouchableOpacity style={s.logoutBtn} onPress={() => dispatch(logout())}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 6 }} />
            <Text style={s.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

/* ── Styles ── */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f7" },
  header: { backgroundColor: NAVY, paddingBottom: 16 },
  headerTop: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 34, height: 34, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  backText: { color: "#fff", fontSize: 22, lineHeight: 26, fontWeight: "300" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "800", color: "#fff" },
  avatarRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#2563eb", borderWidth: 2.5, borderColor: "rgba(255,255,255,0.5)", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#fff" },
  profileName: { fontSize: 16, fontWeight: "800", color: "#fff" },
  profileSub: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 },
  body: { flex: 1 },
  faceCard: { backgroundColor: "#fff", marginTop: 16, borderWidth: 1, borderColor: "#e8ecf2", padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  faceBadge: { flex: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  faceOk: { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  faceWarn: { backgroundColor: "#fefce8", borderColor: "#fde047" },
  faceBadgeText: { fontSize: 13, fontWeight: "700" },
  faceOkText: { color: "#16a34a" },
  faceWarnText: { color: "#a16207" },
  faceBtn: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#fef3c7", borderRadius: 6, borderWidth: 1, borderColor: "#fcd34d" },
  faceBtnUpdate: { backgroundColor: "#eff6ff", borderColor: "#93c5fd" },
  faceBtnText: { fontSize: 13, fontWeight: "700", color: "#b45309" },
  faceBtnUpdateText: { color: "#1d4ed8" },
  sectionLabel: { fontSize: 11, fontWeight: "800", color: "#94a3b8", letterSpacing: 0.7, marginTop: 20, marginBottom: 6, paddingHorizontal: 16 },
  card: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e8ecf2", overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12, minHeight: 58 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  iconContainer: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12, flexShrink: 0 },
  iconEmoji: { fontSize: 18, lineHeight: 22 },
  rowContent: { flex: 1, justifyContent: "center" },
  rowLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "500", marginBottom: 3 },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  rowValueEmpty: { color: "#cbd5e1", fontWeight: "400", fontStyle: "italic" },
  rowInput: { fontSize: 14, fontWeight: "600", color: COLORS.primary, borderBottomWidth: 1.5, borderBottomColor: COLORS.primary, paddingVertical: 2, paddingHorizontal: 0 },
  actionBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center", marginLeft: 4, borderRadius: 8, backgroundColor: "#f1f5f9" },
  actionBtnActive: { backgroundColor: "#eff6ff" },
  saveBtn: { backgroundColor: COLORS.primary, marginTop: 24, paddingVertical: 16, alignItems: "center", shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveBtnDisabled: { opacity: 0.65 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  discardBtn: { marginTop: 10, paddingVertical: 12, alignItems: "center" },
  discardText: { color: "#94a3b8", fontSize: 14, fontWeight: "600" },
  logoutBtn: { backgroundColor: "#fff", marginTop: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#fee2e2" },
  logoutText: { color: "#ef4444", fontSize: 14, fontWeight: "700" },
});

const pk = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  sheetTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  cancel: { fontSize: 15, color: "#94a3b8" },
  confirm: { fontSize: 15, fontWeight: "700", color: COLORS.primary },
  colLabels: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  colLabel: { flex: 1, textAlign: "center", fontSize: 11, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" },
  genderItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  genderItemActive: { backgroundColor: "#eff6ff" },
  genderText: { fontSize: 15, color: "#374151" },
  genderTextActive: { fontWeight: "700", color: COLORS.primary },
});
