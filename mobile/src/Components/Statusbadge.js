import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StatusBadge({ status }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{status.replaceAll("_", " ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#eef6ff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  text: {
    color: "#1976d2",
    fontWeight: "700",
    fontSize: 12
  }
});
