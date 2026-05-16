import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import { fmtTime, isLate } from "./helpers";
import { COLORS } from "./HistoryScreen/HistoryScreen.style";

type Props = NativeStackScreenProps<HistoryStackParamList, "DayDetail">;

export default function DayDetailScreen({ route, navigation }: Props) {
  const { detail } = route.params;
  const r = detail.record;
  const late = isLate(r);
  const isAbsent = detail.status === "absent";

  const statusLabel = isAbsent
    ? "Nghỉ không phép"
    : late
      ? "Đi muộn"
      : "Đúng giờ";
  const statusColor = isAbsent ? "#ef4444" : late ? "#ea580c" : "#16a34a";
  const statusBg = isAbsent ? "#fee2e2" : late ? "#ffedd5" : "#dcfce7";
  const statusIcon = isAbsent ? "📄" : "⏱️";

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* ── Header ── */}
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerRow}>
            <TouchableOpacity
              style={s.backBtnWrap}
              onPress={() => navigation.goBack()}
            >
              <Text style={s.backBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Chi tiết công</Text>
            <View style={{ width: 32 }} />
          </View>
          <Text style={s.headerSub}>
            {detail.dayOfWeek}, {detail.dateStr}
          </Text>
          <View style={[s.statusPill, { backgroundColor: statusBg }]}>
            <Text style={s.statusIcon}>{statusIcon}</Text>
            <Text style={[s.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* CARD 1: Tóm tắt thời gian */}
        <View style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={s.ringWrap}>
              <View style={s.ring}>
                <Text style={s.ringText}>1 giờ{"\n"}35 phút</Text>
              </View>
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={s.cardTitle}>Tóm tắt thời gian</Text>
              <Text style={s.timeLarge}>1 giờ 35 phút</Text>
              <Text style={s.textMuted}>Tổng giờ quy định: 8 giờ</Text>
            </View>
          </View>
        </View>

        {/* CARD 2: Chi tiết chấm công */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Chi tiết chấm công</Text>
          <View style={s.rowSpace}>
            <Text style={s.textNormal}>
              🕒 Giờ vào:{" "}
              <Text style={s.textBold}>
                {r?.check_in ? fmtTime(r.check_in) : "--:--"}
              </Text>
            </Text>
            <Text style={s.textNormal}>
              🕒 Giờ ra:{" "}
              <Text style={s.textBold}>
                {r?.check_out ? fmtTime(r.check_out) : "--:--"}
              </Text>
            </Text>
          </View>
          {late && (
            <View style={{ marginTop: 10 }}>
              <Text style={s.textDanger}>
                ⚠️ Đi muộn (phút): <Text style={s.textBoldDanger}>5</Text>
              </Text>
            </View>
          )}
          <View style={{ marginTop: 10 }}>
            <Text style={s.textNormal}>
              ✅ Số công hưởng lương: <Text style={s.textBold}>1</Text>
            </Text>
          </View>
        </View>

        {/* CARD 3: Tăng ca & Nghỉ */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Tăng ca & Nghỉ</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={s.textNormal}>
              🕒 Làm thêm hưởng lương (giờ): <Text style={s.textBold}>0</Text>
            </Text>
          </View>
          <View style={[s.rowSpace, { marginTop: 10 }]}>
            <Text style={s.textNormal}>
              ⏱️ Làm thêm nghỉ bù: <Text style={s.textBold}>0</Text>
            </Text>
            <Text style={s.textNormal}>
              Nghỉ/Công tác: <Text style={s.textBold}>0</Text>
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={s.textNormal}>
              💼 Về sớm (phút): <Text style={s.textBold}>0</Text>
            </Text>
          </View>
        </View>

        {/* CARD 4: Lý do đi muộn */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Lý do {isAbsent ? "nghỉ" : "đi muộn"}</Text>
          <View style={s.rowSpace}>
            <Text style={s.textMuted}>Chưa cập nhật</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("UpdateRequest", { detail })}
            >
              <Text style={s.textLink}>Thêm lý do</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* BUTTONS */}
        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => navigation.navigate("UpdateRequest", { detail })}
        >
          <Text style={s.btnPrimaryText}>Đề nghị cập nhật công</Text>
        </TouchableOpacity>

        <Text style={s.footerNote}>
          *Dữ liệu được cập nhật từ hệ thống chấm công
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: "#1c64f2",
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },
  backBtnWrap: {
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 28,
    color: "#fff",
    marginTop: -6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 12,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusIcon: { fontSize: 14 },
  statusText: { fontSize: 13, fontWeight: "700" },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  ringWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderTopColor: "#22c55e",
    borderRightColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
    lineHeight: 16,
  },
  timeLarge: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
    marginTop: 4,
  },
  textMuted: {
    fontSize: 13,
    color: "#6b7280",
  },
  rowSpace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  textNormal: {
    fontSize: 14,
    color: "#374151",
  },
  textBold: {
    fontWeight: "700",
    color: "#111827",
  },
  textDanger: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "600",
  },
  textBoldDanger: {
    fontWeight: "800",
  },
  textLink: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  footerNote: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
  },
});
