import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee"
  },
  label: {
    color: "#777",
    fontSize: 14
  },
  value: {
    color: "#222",
    fontWeight: "600",
    fontSize: 14,
    maxWidth: "60%",
    textAlign: "right"
  }
});
