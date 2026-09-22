import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  cancelRegistration,
  getCompetition,
  registerForCompetition
} from "../api";
import { DEMO_COMPETITION_ID } from "../config";
import InfoRow from "../components/InfoRow";
import StatusBadge from "../components/StatusBadge";

function formatDate(value) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function CompetitionDetailsScreen() {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const result = await getCompetition(DEMO_COMPETITION_ID);
      setCompetition(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRegistration() {
    try {
      setActionLoading(true);
      setError("");

      if (competition.userParticipation?.status === "REGISTERED") {
        await cancelRegistration(DEMO_COMPETITION_ID);
      } else {
        await registerForCompetition(DEMO_COMPETITION_ID);
      }

      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading competition...</Text>
      </View>
    );
  }

  if (error && !competition) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.secondaryButton} onPress={load}>
          <Text style={styles.secondaryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const registered = competition.userParticipation?.status === "REGISTERED";
  const canRegister =
    ["OPEN"].includes(competition.lifecycle) && !registered;

  const isFull = competition.lifecycle === "FULL";

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      <Image
        source={{ uri: competition.imageUrl }}
        style={styles.hero}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <StatusBadge status={competition.lifecycle} />

        <Text style={styles.title}>{competition.title}</Text>
        <Text style={styles.description}>{competition.description}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Competition details</Text>

          <InfoRow
            label="Starts"
            value={formatDate(competition.startAt)}
          />
          <InfoRow
            label="Ends"
            value={formatDate(competition.endAt)}
          />
          <InfoRow
            label="Participants"
            value={String(competition.participantCount)}
          />
          <InfoRow
            label="Spots left"
            value={
              competition.spotsRemaining == null
                ? "Unlimited"
                : String(competition.spotsRemaining)
            }
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {registered ? (
          <Pressable
            style={[styles.button, styles.cancelButton]}
            disabled={actionLoading}
            onPress={handleRegistration}
          >
            <Text style={styles.buttonText}>
              {actionLoading ? "Please wait..." : "Cancel registration"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.button,
              (!canRegister || isFull) && styles.disabledButton
            ]}
            disabled={!canRegister || isFull || actionLoading}
            onPress={handleRegistration}
          >
            <Text style={styles.buttonText}>
              {actionLoading
                ? "Please wait..."
                : isFull
                ? "Competition full"
                : canRegister
                ? "Register now"
                : competition.lifecycle.replaceAll("_", " ")}
            </Text>
          </Pressable>
        )}

        <Text style={styles.footer}>
          Availability and registration status are checked by the backend.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  content: { padding: 18, paddingBottom: 40 },
  hero: { width: "100%", height: 220, backgroundColor: "#ddd" },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#171717",
    marginTop: 12
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#606060",
    marginTop: 8
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 20
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4
  },
  button: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#1677ff",
    paddingVertical: 15,
    alignItems: "center"
  },
  cancelButton: { backgroundColor: "#444" },
  disabledButton: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginTop: 12
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  muted: { color: "#777", marginTop: 10 },
  error: { color: "#c62828", marginTop: 12, textAlign: "center" },
  secondaryButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#eee"
  },
  secondaryText: { fontWeight: "700" }
});
