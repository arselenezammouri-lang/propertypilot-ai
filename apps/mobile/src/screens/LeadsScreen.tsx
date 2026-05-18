/**
 * Leads Screen — Mobile CRM lead list
 */

import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  status: string;
  source: string;
}

const MOCK_LEADS: Lead[] = [
  { id: "1", name: "Marco Rossi", email: "marco@email.com", score: 92, status: "hot", source: "Immobiliare.it" },
  { id: "2", name: "Sophie Durand", email: "sophie@email.fr", score: 78, status: "warm", source: "SeLoger" },
  { id: "3", name: "Hans Mueller", email: "hans@email.de", score: 65, status: "warm", source: "ImmoScout24" },
  { id: "4", name: "Ana Garcia", email: "ana@email.es", score: 45, status: "cold", source: "Idealista" },
];

const STATUS_COLORS: Record<string, string> = {
  hot: "#ef4444",
  warm: "#f59e0b",
  cold: "#64748b",
};

export function LeadsScreen() {
  const [leads] = useState(MOCK_LEADS);

  const renderLead = ({ item }: { item: Lead }) => (
    <TouchableOpacity style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <View style={[styles.scoreBadge, { backgroundColor: STATUS_COLORS[item.status] + "20" }]}>
          <Text style={[styles.scoreText, { color: STATUS_COLORS[item.status] }]}>
            {item.score}
          </Text>
        </View>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{item.name}</Text>
          <Text style={styles.leadEmail}>{item.email}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
      </View>
      <View style={styles.leadFooter}>
        <Text style={styles.leadSource}>{item.source}</Text>
        <Text style={styles.leadStatus}>{item.status.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CRM Leads</Text>
        <Text style={styles.count}>{leads.length} leads</Text>
      </View>
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#f8fafc" },
  count: { fontSize: 14, color: "#94a3b8" },
  list: { padding: 20, paddingTop: 0, gap: 12 },
  leadCard: { backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#2a2a3e" },
  leadHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  scoreBadge: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  scoreText: { fontSize: 16, fontWeight: "bold" },
  leadInfo: { flex: 1 },
  leadName: { fontSize: 16, fontWeight: "600", color: "#f8fafc" },
  leadEmail: { fontSize: 12, color: "#94a3b8" },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  leadFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#2a2a3e" },
  leadSource: { fontSize: 12, color: "#94a3b8" },
  leadStatus: { fontSize: 10, fontWeight: "600", color: "#6366f1" },
});
