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
  Keyboard,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import { fmtTime } from "./helpers";
import { COLORS } from "./HistoryScreen/HistoryScreen.style";
import { explanationApi } from "../../../api/explanationApi";

type Props = NativeStackScreenProps<HistoryStackParamList, "UpdateRequest">;

/* ── Helpers ── */
function parseWorkDate(dateStr: string): string {
  // dateStr: "dd/mm/yyyy" → "yyyy-mm-dd"
  const parts = dateStr.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function toTimeInput(iso: string | null): string {
  if (!iso) return "";
  const t = iso.includes("T") ? iso.split("T")[1] : iso;
  const [h, m] = t.split(":");
  return `${h}:${m}`;
}

/* ── Sub-components ── */
function FieldLabel({
  text,
  required = false,
}: {
  text: string;
  required?: boolean;
}) {
  return (
    <Text style={fs.label}>
      {text}
      {required && <Text style={fs.required}> *</Text>}
    </Text>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={fs.infoRow}>
      <Text style={fs.infoLabel}>{label}</Text>
      <Text style={fs.infoValue}>{value}</Text>
    </View>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  required = false,
  options,
  onChange,
  zIndex = 1,
}: {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  options: string[];
  onChange: (v: string) => void;
  zIndex?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={[fs.fieldWrap, { zIndex }]}>
      <FieldLabel text={label} required={required} />
      <TouchableOpacity
        style={fs.selectRow}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(!isOpen);
        }}
        activeOpacity={0.7}
      >
        <Text style={value ? fs.selectValue : fs.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={fs.chevron}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={fs.dropdown}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[
                fs.dropdownItem,
                i === options.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              <Text style={fs.dropdownText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function TimeField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <FieldLabel text={label} required={required} />
      <View style={fs.timeInputWrap}>
        <TextInput
          value={value}
          onChangeText={onChange}
          style={fs.timeInput}
          keyboardType="numbers-and-punctuation"
          placeholder="08:00"
          placeholderTextColor="#9ca3af"
        />
        <Text style={{ fontSize: 16 }}>🕒</Text>
      </View>
    </View>
  );
}

/* ── Main Screen ── */
export default function UpdateRequestForm({ route, navigation }: Props) {
  const { detail } = route.params;
  const r = detail.record;

  const [violationType, setViolationType] = useState("");
  const [checkInTime, setCheckInTime] = useState(
    r?.check_in ? toTimeInput(r.check_in) : "08:00",
  );
  const [checkOutTime, setCheckOutTime] = useState(
    r?.check_out ? toTimeInput(r.check_out) : "17:30",
  );
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const isAbsent = detail.status === "absent";
  const isLate = detail.status === "late";

  const handleSend = async () => {
    if (!reason.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập lý do giải trình");
      return;
    }
    if (!violationType) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn loại vi phạm");
      return;
    }

    try {
      setSaving(true);
      const workDate = parseWorkDate(detail.dateStr);

      await explanationApi.create({
        workDate,
        reason: `[${violationType}] ${reason}`.trim(),
        requestedCheckIn: checkInTime ? checkInTime + ":00" : undefined,
        requestedCheckOut: checkOutTime ? checkOutTime + ":00" : undefined,
      });

      Alert.alert(
        "✅ Gửi thành công",
        "Đơn giải trình đã được gửi. Bạn có thể theo dõi trạng thái trong lịch sử.",
        [
          {
            text: "Xem lịch sử",
            onPress: () => navigation.navigate("ExplanationHistory"),
          },
          {
            text: "Quay lại",
            style: "cancel",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Không thể gửi, thử lại sau",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* ── Header ── */}
      <View style={fs.header}>
        <SafeAreaView>
          <View style={fs.headerRow}>
            <TouchableOpacity
              style={fs.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={fs.backBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={fs.headerTitle}>Giải trình chấm công</Text>
            <View style={{ width: 36 }} />
          </View>
          <Text style={fs.headerSub}>
            {detail.dayOfWeek}, {detail.dateStr}
          </Text>
        </SafeAreaView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* ── Thông tin gốc ── */}
        <View style={fs.section}>
          <Text style={fs.sectionTitle}>📋 Thông tin chấm công gốc</Text>
          <View style={fs.infoCard}>
            <InfoRow label="Ngày" value={detail.dateStr} />
            <InfoRow
              label="Trạng thái"
              value={
                isAbsent ? "Vắng mặt" : isLate ? "Đi muộn" : "Lỗi chấm công"
              }
            />
            <InfoRow
              label="Giờ vào gốc"
              value={r?.check_in ? fmtTime(r.check_in) : "Chưa có"}
            />
            <InfoRow
              label="Giờ ra gốc"
              value={r?.check_out ? fmtTime(r.check_out) : "Chưa có"}
            />
          </View>
        </View>

        {/* ── Form giải trình ── */}
        <View style={fs.section}>
          <Text style={fs.sectionTitle}>✏️ Thông tin giải trình</Text>

          <SelectField
            label="Loại vi phạm"
            required
            value={violationType}
            placeholder="Chọn loại vi phạm..."
            options={["Đi muộn", "Về sớm", "Quên check-out", "Vắng có lý do"]}
            onChange={setViolationType}
            zIndex={3000}
          />

          {/* Giờ đề xuất */}
          <View style={[fs.fieldWrap, { zIndex: 2000 }]}>
            <FieldLabel text="Giờ đề xuất" required />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TimeField
                label="Vào ca"
                value={checkInTime}
                onChange={setCheckInTime}
              />
              <TimeField
                label="Ra ca"
                value={checkOutTime}
                onChange={setCheckOutTime}
              />
            </View>
          </View>

          {/* Lý do */}
          <View style={[fs.fieldWrap, { zIndex: 1000 }]}>
            <FieldLabel text="Lý do giải trình" required />
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Mô tả chi tiết lý do (ví dụ: hỏng xe, quên check-out, đi gặp khách hàng...)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              style={fs.textArea}
              textAlignVertical="top"
            />
            <Text style={fs.charCount}>{reason.length} ký tự</Text>
          </View>
        </View>

        {/* ── Lưu ý ── */}
        <View style={fs.noteBox}>
          <Text style={fs.noteText}>
            💡 Đơn giải trình sẽ được gửi đến quản lý để xem xét. Bạn có thể
            theo dõi trạng thái trong mục "Lịch sử giải trình".
          </Text>
        </View>

        {/* ── Buttons ── */}
        <View style={fs.btnRow}>
          <TouchableOpacity
            style={fs.btnCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={fs.btnCancelText}>Huỷ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[fs.btnSubmit, saving && { opacity: 0.7 }]}
            onPress={handleSend}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={fs.btnSubmitText}>📤 Gửi giải trình</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const fs = StyleSheet.create({
  /* Header */
  header: {
    backgroundColor: "#1c64f2",
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: { fontSize: 24, color: "#fff", marginTop: -3 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },

  /* Section */
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  /* Info card */
  infoCard: { gap: 8 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: { fontSize: 13, color: "#6b7280" },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#111827" },

  /* Field */
  fieldWrap: { marginTop: 14 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  required: { color: "#ef4444" },

  /* Select */
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#fff",
  },
  selectValue: { fontSize: 14, color: "#111827", flex: 1 },
  selectPlaceholder: { fontSize: 14, color: "#9ca3af", flex: 1 },
  chevron: { fontSize: 12, color: "#6b7280" },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999,
    marginTop: 2,
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownText: { fontSize: 14, color: "#374151", fontWeight: "500" },

  /* Time */
  timeInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    gap: 8,
  },
  timeInput: { flex: 1, fontSize: 15, color: "#111827", padding: 0 },

  /* Textarea */
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    minHeight: 110,
    backgroundColor: "#fff",
    lineHeight: 20,
  },
  charCount: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "right",
    marginTop: 4,
  },

  /* Note */
  noteBox: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  noteText: { fontSize: 12.5, color: "#1d4ed8", lineHeight: 18 },

  /* Buttons */
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 20,
  },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnCancelText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  btnSubmit: {
    flex: 2,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  btnSubmitText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
