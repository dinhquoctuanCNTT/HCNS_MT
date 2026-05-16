import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { attendanceApi } from "../../../api/attendanceApi";
import { explanationApi } from "../../../api/explanationApi";
import COLORS from "../../../constants/colors";

const NAVY = "#1b3b6f";

/* ── Badge Status ────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const cfg: any = {
    pending:  { label: "Active",  color: "#fff", bg: "#4285f4" }, // Blue like "Active" in image
    approved: { label: "Success", color: "#fff", bg: "#34a853" }, // Green
    rejected: { label: "Closed",  color: "#fff", bg: "#ea4335" }, // Red
  };
  const c = cfg[status] || cfg.pending;
  const label = status === "pending" ? "Chờ duyệt" : status === "approved" ? "Đã duyệt" : "Từ chối";

  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.badgeText, { color: c.color }]}>{label}</Text>
    </View>
  );
}

export default function RequestCenterScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "done">("all");
  const [requests,  setRequests]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leaveRes, explRes] = await Promise.all([
        attendanceApi.getLeaveRequests(),
        explanationApi.getMy(),
      ]);

      const leaves = (leaveRes.data?.data || []).map((i: any) => ({ ...i, type: "leave" }));
      const expls  = (explRes.data || []).map((i: any) => ({ ...i, type: "explanation" }));

      const combined = [...leaves, ...expls].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRequests(combined);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "done")    return r.status !== "pending";
    return true;
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ══ HEADER ══ */}
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerRow}>
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Text style={s.backText}>‹</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Trung tâm Đơn từ</Text>
            <View style={{ width: 34 }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={s.body} showsVerticalScrollIndicator={false}>
        
        {/* ── KPI CARDS (Dashboard style) ────────────────────────── */}
        <View style={s.kpiGrid}>
          <View style={[s.kpiCard, { backgroundColor: "#34a853" }]}>
            <Text style={s.kpiLabel}>Tất cả</Text>
            <Text style={s.kpiValue}>{counts.total}</Text>
          </View>
          <View style={[s.kpiCard, { backgroundColor: "#4285f4" }]}>
            <Text style={s.kpiLabel}>Đang chờ</Text>
            <Text style={s.kpiValue}>{counts.pending}</Text>
          </View>
          <View style={[s.kpiCard, { backgroundColor: "#ea4335" }]}>
            <Text style={s.kpiLabel}>Từ chối</Text>
            <Text style={s.kpiValue}>{counts.rejected}</Text>
          </View>
          <View style={[s.kpiCard, { backgroundColor: "#9aa0a6" }]}>
            <Text style={s.kpiLabel}>Đã duyệt</Text>
            <Text style={s.kpiValue}>{counts.approved}</Text>
          </View>
        </View>

        {/* ── Section Title ────────────────────────────────────────── */}
        <View style={s.listHeader}>
          <Text style={s.listTitle}>Danh sách chi tiết</Text>
          <View style={s.tabRow}>
            {(["all", "pending", "done"] as const).map(t => (
              <TouchableOpacity 
                key={t} 
                onPress={() => setActiveTab(t)}
                style={[s.tab, activeTab === t && s.tabActive]}
              >
                <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>
                  {t === "all" ? "Tất cả" : t === "pending" ? "Chờ" : "Xong"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── List Area ───────────────────────────────────────────── */}
        <View style={s.listContent}>
          {loading ? (
            <ActivityIndicator color={NAVY} style={{ marginTop: 30 }} />
          ) : filteredRequests.length === 0 ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>Không tìm thấy đơn phù hợp</Text>
            </View>
          ) : (
            filteredRequests.map((req, idx) => (
              <TouchableOpacity key={idx} style={s.card} activeOpacity={0.7}>
                <View style={s.cardRow}>
                  <View style={s.cardInfo}>
                    <Text style={s.reqType}>
                      {req.type === "leave" ? "🏖️ Nghỉ phép" : "📝 Giải trình"}
                    </Text>
                    <Text style={s.reqDate}>
                      Ngày: {req.type === "leave" 
                          ? `${new Date(req.from_date).toLocaleDateString("vi-VN")}`
                          : `${new Date(req.work_date).toLocaleDateString("vi-VN")}`
                        }
                    </Text>
                  </View>
                  <StatusBadge status={req.status} />
                </View>
                
                <Text style={s.reqReason} numberOfLines={1}>
                  {req.reason || "Không có lý do"}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  
  /* Header */
  header: { backgroundColor: NAVY, paddingBottom: 10 },
  headerRow: { 
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 10
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 0,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },
  backText: { color: "#fff", fontSize: 20, fontWeight: "300" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },

  body: { flex: 1 },

  /* KPI Grid */
  kpiGrid: { 
    flexDirection: "row", flexWrap: "wrap", 
    padding: 0, gap: 0 
  },
  kpiCard: { 
    flex: 1, minWidth: "50%", borderRadius: 0, padding: 15,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 0, elevation: 3
  },
  kpiLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" },
  kpiValue: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 4 },

  /* List Header */
  listHeader: { 
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, marginTop: 15, marginBottom: 10
  },
  listTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  
  tabRow: { flexDirection: "row", paddingHorizontal: 0, marginBottom: 10, gap: 0 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 0, backgroundColor: "#e0e0e0", alignItems: 'center' },
  tabActive: { backgroundColor: NAVY },
  tabText: { fontSize: 11, fontWeight: "700", color: "#666" },
  tabTextActive: { color: "#fff" },

  /* Card */
  listContent: { paddingHorizontal: 0 },
  card: { 
    backgroundColor: "#fff", borderRadius: 0, padding: 14, marginBottom: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 0, elevation: 2
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardInfo: { flex: 1 },
  reqType: { fontSize: 14, fontWeight: "700", color: "#333", marginBottom: 2 },
  reqDate: { fontSize: 12, color: "#888" },
  
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 0 },
  badgeText: { fontSize: 11, fontWeight: "800" },

  reqReason: { fontSize: 12, color: "#666", marginTop: 8, fontStyle: "italic" },

  emptyBox: { padding: 50, alignItems: "center" },
  emptyText: { color: "#999", fontSize: 13 },
});
