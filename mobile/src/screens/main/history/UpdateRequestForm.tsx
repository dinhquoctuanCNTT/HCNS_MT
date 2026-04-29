import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import { fmtTime } from "./helpers";
import { COLORS, H_PAD } from "./HistoryScreen.style";
import BackButton from "./BackButton";

type Props = NativeStackScreenProps<HistoryStackParamList, "UpdateRequest">;

export default function UpdateRequestForm({ route, navigation }: Props) {
  const { detail } = route.params;

  const [violationType, setViolationType] = useState("");
  const [checkInTime, setCheckInTime] = useState(
    detail.record?.check_in ? fmtTime(detail.record.check_in) : "08:30",
  );
  const [checkOutTime, setCheckOutTime] = useState(
    detail.record?.check_out ? fmtTime(detail.record.check_out) : "17:30",
  );
  const [shiftType, setShiftType] = useState("");
  const [approver, setApprover] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSend = async (draft = false) => {
    if (!reason.trim() && !draft) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập lý do giải trình");
      return;
    }
    try {
      setSaving(true);
      Alert.alert("Thành công", draft ? "Đã lưu nháp" : "Đã gửi giải trình", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Lỗi", "Không thể gửi, thử lại sau");
    } finally {
      setSaving(false);
    }
  };

  const FieldLabel = ({
    text,
    required = false,
  }: {
    text: string;
    required?: boolean;
  }) => (
    <Text style={fs.label}>
      {text}
      {required && <Text style={fs.required}> *</Text>}
    </Text>
  );

  const SelectField = ({
    label,
    value,
    placeholder,
    required = false,
    onPress,
  }: any) => (
    <View style={fs.fieldWrap}>
      <FieldLabel text={label} required={required} />
      <TouchableOpacity
        style={fs.selectBox}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={value ? fs.selectVal : fs.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={fs.arrow}>▾</Text>
      </TouchableOpacity>
    </View>
  );

  const TimeField = ({ label, value, onChange, required = false }: any) => (
    <View style={{ flex: 1 }}>
      <FieldLabel text={label} required={required} />
      <View style={fs.timeBox}>
        <TextInput
          value={value}
          onChangeText={onChange}
          style={fs.timeInput}
          keyboardType="numbers-and-punctuation"
          placeholderTextColor={COLORS.textLight}
        />
        <Text style={fs.clock}>🕐</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* ── Header ── */}
      <View style={fs.header}>
        <SafeAreaView>
          <View style={fs.headerRow}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={fs.headerTitle}>Giải trình</Text>
            <View style={{ width: 40 }} />
          </View>
          <Text style={fs.headerSub}>
            {detail.dayOfWeek}, {detail.dateStr}
          </Text>
        </SafeAreaView>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={fs.body}>
          {/* Ngày giải trình */}
          <View style={fs.fieldWrap}>
            <FieldLabel text="Ngày giải trình" required />
            <View style={fs.dateBox}>
              <Text style={fs.dateVal}>{detail.dateStr}</Text>
              <Text style={{ fontSize: 18 }}>📅</Text>
            </View>
          </View>

          <SelectField
            label="Loại vi phạm"
            required
            value={violationType}
            placeholder="Chọn loại vi phạm"
            onPress={() =>
              Alert.alert("Loại vi phạm", "", [
                { text: "Đi muộn", onPress: () => setViolationType("Đi muộn") },
                { text: "Về sớm", onPress: () => setViolationType("Về sớm") },
                {
                  text: "Quên chấm công",
                  onPress: () => setViolationType("Quên chấm công"),
                },
                {
                  text: "Vắng không phép",
                  onPress: () => setViolationType("Vắng không phép"),
                },
                { text: "Huỷ", style: "cancel" },
              ])
            }
          />

          <View style={fs.fieldWrap}>
            <View style={fs.timeRow}>
              <TimeField
                label="Giờ vào"
                required
                value={checkInTime}
                onChange={setCheckInTime}
              />
              <View style={{ width: 12 }} />
              <TimeField
                label="Giờ ra"
                required
                value={checkOutTime}
                onChange={setCheckOutTime}
              />
            </View>
          </View>

          <SelectField
            label="Kiểu công"
            required
            value={shiftType}
            placeholder="Chọn kiểu công"
            onPress={() =>
              Alert.alert("Kiểu công", "", [
                {
                  text: "Ca hành chính",
                  onPress: () => setShiftType("Ca hành chính"),
                },
                { text: "Ca sáng", onPress: () => setShiftType("Ca sáng") },
                { text: "Ca chiều", onPress: () => setShiftType("Ca chiều") },
                { text: "Ca tối", onPress: () => setShiftType("Ca tối") },
                { text: "Huỷ", style: "cancel" },
              ])
            }
          />

          <SelectField
            label="Người phê duyệt"
            required
            value={approver}
            placeholder="Chọn người phê duyệt"
            onPress={() =>
              Alert.alert("Người phê duyệt", "", [
                {
                  text: "Quản lý trực tiếp",
                  onPress: () => setApprover("Quản lý trực tiếp"),
                },
                {
                  text: "Trưởng phòng",
                  onPress: () => setApprover("Trưởng phòng"),
                },
                { text: "Giám đốc", onPress: () => setApprover("Giám đốc") },
                { text: "Huỷ", style: "cancel" },
              ])
            }
          />

          <View style={fs.fieldWrap}>
            <FieldLabel text="Lý do" required />
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Nhập lý do giải trình..."
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
              style={fs.textArea}
            />
          </View>
        </View>

        <View style={fs.btnRow}>
          <TouchableOpacity
            style={fs.btnOutline}
            onPress={() => handleSend(true)}
            disabled={saving}
          >
            <Text style={fs.btnOutlineText}>Lưu nháp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={fs.btnSolid}
            onPress={() => handleSend(false)}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={fs.btnSolidText}>Gửi yêu cầu</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const fs = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingHorizontal: H_PAD,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    flex: 1,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  body: { padding: H_PAD, backgroundColor: COLORS.white, paddingBottom: 8 },
  fieldWrap: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  required: { color: COLORS.danger },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: COLORS.white,
  },
  dateVal: { fontSize: 14, color: COLORS.textDark, fontWeight: "500" },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: COLORS.white,
  },
  selectVal: { fontSize: 14, color: COLORS.textDark, flex: 1 },
  selectPlaceholder: { fontSize: 14, color: COLORS.textLight, flex: 1 },
  arrow: { fontSize: 12, color: COLORS.textLight },
  timeRow: { flexDirection: "row" },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: COLORS.white,
  },
  timeInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  clock: { fontSize: 16 },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: COLORS.white,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: H_PAD,
    paddingVertical: 16,
    paddingBottom: 40,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnSolid: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnOutlineText: { fontSize: 14, color: COLORS.primary, fontWeight: "700" },
  btnSolidText: { fontSize: 14, color: COLORS.white, fontWeight: "700" },
});
