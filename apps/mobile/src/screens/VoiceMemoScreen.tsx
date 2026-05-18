/**
 * Voice Memo Screen — Record voice notes, transcribe via Whisper
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface VoiceMemo {
  id: string;
  duration: string;
  transcript: string;
  createdAt: string;
}

const MOCK_MEMOS: VoiceMemo[] = [
  { id: "1", duration: "0:45", transcript: "3-bedroom apartment, via Roma 42, needs kitchen renovation, great view of the park...", createdAt: "2 min ago" },
  { id: "2", duration: "1:12", transcript: "Client interested in properties near Brera district, budget 400-500k, 2+ bedrooms...", createdAt: "1 hour ago" },
];

export function VoiceMemoScreen() {
  const [recording, setRecording] = useState(false);
  const [memos] = useState(MOCK_MEMOS);

  const toggleRecording = () => {
    if (recording) {
      Alert.alert("Recording Saved", "Voice memo will be transcribed via AI (Whisper)");
    }
    setRecording(!recording);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Voice Memos</Text>
      <Text style={styles.subtitle}>Record field notes — auto-transcribed by AI</Text>

      {/* Record Button */}
      <View style={styles.recordSection}>
        <TouchableOpacity
          style={[styles.recordButton, recording && styles.recordButtonActive]}
          onPress={toggleRecording}
        >
          <Text style={styles.recordIcon}>{recording ? "⏹️" : "🎙️"}</Text>
        </TouchableOpacity>
        <Text style={styles.recordLabel}>
          {recording ? "Recording... Tap to stop" : "Tap to record"}
        </Text>
      </View>

      {/* Memos List */}
      <FlatList
        data={memos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.memoCard}>
            <View style={styles.memoHeader}>
              <Text style={styles.memoDuration}>🎙️ {item.duration}</Text>
              <Text style={styles.memoTime}>{item.createdAt}</Text>
            </View>
            <Text style={styles.memoTranscript}>{item.transcript}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23" },
  title: { fontSize: 24, fontWeight: "bold", color: "#f8fafc", paddingHorizontal: 20, paddingTop: 20 },
  subtitle: { fontSize: 14, color: "#94a3b8", paddingHorizontal: 20, marginBottom: 20 },
  recordSection: { alignItems: "center", paddingVertical: 24 },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    borderWidth: 3,
    borderColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonActive: { borderColor: "#ef4444", backgroundColor: "#ef444420" },
  recordIcon: { fontSize: 32 },
  recordLabel: { fontSize: 14, color: "#94a3b8", marginTop: 12 },
  list: { padding: 20, gap: 12 },
  memoCard: { backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#2a2a3e" },
  memoHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  memoDuration: { fontSize: 14, fontWeight: "600", color: "#6366f1" },
  memoTime: { fontSize: 12, color: "#64748b" },
  memoTranscript: { fontSize: 13, color: "#cbd5e1", lineHeight: 20 },
});
