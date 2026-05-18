/**
 * Settings Screen — Account, plan, preferences
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "../lib/supabase";

export function SettingsScreen() {
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) Alert.alert("Error", error.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsItem label="Profile" value="Edit" />
          <SettingsItem label="Plan" value="Pro — €497/mo" />
          <SettingsItem label="Email" value="agent@agency.it" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingsItem label="Language" value="Italiano" />
          <SettingsItem label="Country" value="Italy 🇮🇹" />
          <SettingsItem label="Notifications" value="On" />
          <SettingsItem label="Dark Mode" value="Always" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <SettingsItem label="Offline Photos" value="24 photos" />
          <SettingsItem label="Voice Memos" value="8 memos" />
          <SettingsItem label="Clear Cache" value="" />
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>PropertyPilot AI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsItem({ label, value }: { label: string; value: string }) {
  return (
    <TouchableOpacity style={styles.settingsItem}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23" },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#f8fafc", marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  itemLabel: { fontSize: 14, color: "#f8fafc" },
  itemValue: { fontSize: 14, color: "#94a3b8" },
  signOutButton: {
    backgroundColor: "#ef444420",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ef444440",
  },
  signOutText: { fontSize: 16, fontWeight: "600", color: "#ef4444" },
  version: { textAlign: "center", fontSize: 12, color: "#475569", marginTop: 24 },
});
