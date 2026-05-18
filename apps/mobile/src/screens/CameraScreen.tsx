/**
 * Camera Screen — Property photo capture with AI enhancement
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function CameraScreen() {
  const [photoCount, setPhotoCount] = useState(0);

  const handleCapture = () => {
    // In production: use expo-camera
    setPhotoCount((c) => c + 1);
    Alert.alert("Photo Captured", `${photoCount + 1} photos taken. AI enhancement available.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.cameraIcon}>📸</Text>
        <Text style={styles.cameraText}>Camera Preview</Text>
        <Text style={styles.cameraSubtext}>
          Capture property photos for AI staging & enhancement
        </Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.photoCounter}>
          <Text style={styles.counterText}>{photoCount} photos</Text>
        </View>

        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <View style={styles.modeSelector}>
          {["Photo", "Panorama", "Floor Plan"].map((mode) => (
            <TouchableOpacity key={mode} style={styles.modeButton}>
              <Text style={styles.modeText}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23" },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    margin: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: { fontSize: 64, marginBottom: 16 },
  cameraText: { fontSize: 18, fontWeight: "600", color: "#f8fafc" },
  cameraSubtext: { fontSize: 13, color: "#94a3b8", marginTop: 8, textAlign: "center", paddingHorizontal: 40 },
  controls: { padding: 20, alignItems: "center", gap: 16 },
  photoCounter: { backgroundColor: "#1a1a2e", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  counterText: { fontSize: 14, color: "#6366f1", fontWeight: "600" },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#6366f1" },
  modeSelector: { flexDirection: "row", gap: 12 },
  modeButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#1a1a2e" },
  modeText: { fontSize: 12, color: "#94a3b8" },
});
