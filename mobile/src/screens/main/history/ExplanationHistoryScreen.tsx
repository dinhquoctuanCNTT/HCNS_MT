import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Platform,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import { explanationApi } from "../../../api/explanationApi";
import BackButton from "./BackButton";

type Props = NativeStackScreenProps<HistoryStackParamList, "ExplanationHistory">;

export default function ExplanationHistoryScreen({ navigation }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await explanationApi.getMy();
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "#dcfce7", color: "#16a34a", label: "Đã duyệt" };
      case "rejected":
        return { bg: "#fee2e2", color: "#dc2626", label: "Từ chối" };
      default:
        return { bg: "#fef3c7", color: "#d97706", label: "Chờ duyệt" };
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerRow}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={s.headerTitle}>Lịch sử giải trình</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1c64f2" size="large" />
      ) : data.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 40 }}>📋</Text>
          <Text style={s.emptyText}>Bạn chưa gửi yêu cầu giải trình nào</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {data.map((item) => {
            const st = getStatusStyle(item.status);
            return (
              <View key={item.id} style={s.card}>
                <View style={s.cardHeader}>
                  <Text style={s.workDate}>
                    Ngày công: {new Date(item.work_date).toLocaleDateString("vi-VN")}
                  </Text>
                  <View style={[s.badge, { backgroundColor: st.bg }]}>
                    <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>

                <View style={s.cardBody}>
                  <Text style={s.reasonLabel}>Lý do giải trình:</Text>
                  <Text style={s.reasonText}>{item.reason}</Text>

                  {(item.corrected_check_in || item.corrected_check_out) && (
                    <View style={s.timeRow}>
                      <Text style={s.timeText}>
                        Yêu cầu: {item.corrected_check_in?.slice(0, 5) || "--"} → {item.corrected_check_out?.slice(0, 5) || "--"}
                      </Text>
                    </View>
                  )}

                  {item.admin_note && (
                    <View style={s.adminNoteBox}>
                      <Text style={s.adminNoteLabel}>Phản hồi từ Admin:</Text>
                      <Text style={s.adminNoteText}>{item.admin_note}</Text>
                    </View>
                  )}
                </View>

                <View style={s.cardFooter}>
                  <Text style={s.createdAt}>
                    Gửi ngày: {new Date(item.created_at).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#1c64f2",
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 8,
  },
  workDate: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  cardBody: { marginBottom: 12 },
  reasonLabel: { fontSize: 12, color: "#64748b", marginBottom: 4 },
  reasonText: { fontSize: 14, color: "#334155", lineHeight: 20 },
  timeRow: { marginTop: 8, backgroundColor: "#f8fafc", padding: 8, borderRadius: 6 },
  timeText: { fontSize: 13, color: "#1e293b", fontWeight: "600" },
  adminNoteBox: {
    marginTop: 12,
    backgroundColor: "#fff7ed",
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#f97316",
  },
  adminNoteLabel: { fontSize: 11, fontWeight: "700", color: "#9a3412", marginBottom: 2 },
  adminNoteText: { fontSize: 13, color: "#7c2d12" },
  cardFooter: { borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 8 },
  createdAt: { fontSize: 11, color: "#94a3b8", textAlign: "right" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 14, color: "#64748b", textAlign: "center" },
});
