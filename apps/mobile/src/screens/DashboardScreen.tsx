/**
 * Dashboard Screen — Mobile overview with stats and quick actions
 */

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>PropertyPilot AI</Text>
        <Text style={styles.subtitle}>Your AI real estate assistant</Text>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <StatCard label="Active Leads" value="24" color="#6366f1" />
          <StatCard label="Listings" value="12" color="#22c55e" />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Viewings" value="8" color="#f59e0b" />
          <StatCard label="Offers" value="3" color="#ec4899" />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionButton label="📸 Capture" desc="Take property photos" />
          <ActionButton label="🎙️ Voice Memo" desc="Record field notes" />
          <ActionButton label="🏠 New Listing" desc="Create AI listing" />
          <ActionButton label="📊 CMA Report" desc="Run valuation" />
          <ActionButton label="🔍 Compliance" desc="Check regulations" />
          <ActionButton label="📱 WhatsApp" desc="AI conversations" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({ label, desc }: { label: string; desc: string }) {
  return (
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23" },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#f8fafc", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#94a3b8", marginBottom: 24 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
  },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#f8fafc" },
  statLabel: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#f8fafc", marginTop: 24, marginBottom: 12 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionButton: {
    width: "47%",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  actionLabel: { fontSize: 16, color: "#f8fafc", marginBottom: 4 },
  actionDesc: { fontSize: 12, color: "#94a3b8" },
});
