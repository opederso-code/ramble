import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { assets } from "../assets";
import { colors, shadow } from "../theme";
import { Avatar, Button, Icon, IconButton, T, ui } from "../components/ui";
import { RouteMap, Stage } from "../components/RouteMap";
import { Place } from "./BrowseScreen";
export const narration = {
  tour: {
    main: "This is Crenshaw. After long studio nights, we’d end up right here.",
    next: "Keep walking, the real spot is up ahead.",
    time: "0:42",
  },
  back: {
    main: "Good choice on the burger. Now look left, see that mural?",
    next: "We shot part of a video right there.",
    time: "0:12",
  },
  rerouted: {
    main: "Say less. Urban Light at LACMA, right in time for golden hour.",
    next: "Hop in, it’s a quick drive.",
    time: "0:05",
  },
};
export function TourHeader({
  onCompass,
  stage = "tour",
}: {
  onCompass: () => void;
  stage?: Stage;
}) {
  return (
    <View style={s.header}>
      <View style={{ gap: 4 }}>
        <T
          weight="600"
          style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.6 }}
        >
          Los Angeles
        </T>
        <View style={[ui.row, { gap: 6 }]}>
          <Avatar size={20} />
          <T style={{ fontSize: 15, lineHeight: 20, color: colors.muted }}>
            with Kendrick Lamar
          </T>
        </View>
      </View>
      <IconButton
        name="navigation-pointer-01"
        label="View tour directions"
        size={56}
        iconSize={27}
        dark
        onPress={onCompass}
        style={{
          transform: [{ rotate: stage === "tour" ? "0deg" : "-65deg" }],
        }}
      />
    </View>
  );
}
export function TourScreen({
  stage,
  top,
  bottom,
  onPlace,
  onChat,
  onMap,
  onAll,
  playing,
  togglePlayback,
  replay,
}: {
  stage: Stage;
  top: number;
  bottom: number;
  onPlace: (p: Place) => void;
  onChat: () => void;
  onMap: () => void;
  onAll: () => void;
  playing: boolean;
  togglePlayback: () => void;
  replay: () => void;
}) {
  const copy = narration[stage];
  const updated = stage === "rerouted";
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: top + 8,
        paddingBottom: bottom + 26,
      }}
    >
      <TourHeader onCompass={onMap} stage={stage} />
      <View style={{ marginHorizontal: 24, marginTop: 18 }}>
        <RouteMap stage={stage} onExpand={onMap} />
      </View>
      <View style={s.tourCard}>
        <View style={ui.between}>
          <View style={[ui.row, { gap: 10, flex: 1, minWidth: 0 }]}>
            <Avatar />
            <View style={{ gap: 2, flex: 1, minWidth: 0 }}>
              <T numberOfLines={1} weight="600" style={{ lineHeight: 20 }}>
                Kendrick Lamar
              </T>
              <View style={[ui.row, { gap: 6 }]}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: playing ? "#33a652" : colors.muted,
                  }}
                />
                <T style={s.meta}>
                  {playing ? "Speaking" : "Paused"} · {copy.time}
                </T>
              </View>
            </View>
          </View>
          <View style={[ui.row, { gap: 8 }]}>
            <IconButton
              name="refresh-ccw-01"
              label="Replay narration"
              iconSize={16}
              onPress={replay}
              style={{ backgroundColor: "white" }}
            />
            <IconButton
              name={playing ? "pause-circle" : "play"}
              label={playing ? "Pause narration" : "Play narration"}
              iconSize={16}
              onPress={togglePlayback}
              dark
            />
          </View>
        </View>
        <T style={{ fontSize: 17, lineHeight: 24 }}>
          {copy.main}{" "}
          <T style={{ color: colors.faint, fontSize: 17, lineHeight: 24 }}>
            {copy.next}
          </T>
        </T>
        <Button label="Ask Kendrick a question" onPress={onChat} style={s.ask}>
          <Icon name="microphone-01" size={18} color={colors.muted} />
          <T style={{ color: colors.muted, fontSize: 15, lineHeight: 20 }}>
            Ask a question or say “next”
          </T>
        </Button>
      </View>
      <View
        style={[
          ui.between,
          { marginHorizontal: 24, marginTop: 22, marginBottom: 10 },
        ]}
      >
        <T weight="600" style={{ lineHeight: 24 }}>
          {updated ? "On your new route" : "Nearby on your route"}
        </T>
        <Button label="See all stops" onPress={onAll}>
          <T style={{ color: colors.muted, fontSize: 14, lineHeight: 18 }}>
            See all
          </T>
        </Button>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
      >
        {([updated ? "light" : "burger", "hall"] as Place[]).map((p, i) => (
          <Button
            key={p}
            label={`View ${p === "burger" ? "Fatburger" : p === "light" ? "Urban Light" : "Concert Hall"}`}
            onPress={() => onPlace(p)}
            style={{ width: 250, gap: 8 }}
          >
            <View>
              <Image
                source={
                  p === "burger"
                    ? assets.burgerTour
                    : p === "light"
                      ? assets.lightTour
                      : assets.hallTour
                }
                style={{ width: 250, height: 140, borderRadius: 16 }}
                contentFit="cover"
              />
              <View style={{ position: "absolute", right: 10, bottom: 10 }}>
                <Avatar border />
              </View>
            </View>
            <View style={ui.between}>
              <T weight="600" style={{ fontSize: 15, lineHeight: 20 }}>
                {p === "burger"
                  ? "Fatburger"
                  : p === "light"
                    ? "Urban Light"
                    : "Concert Hall"}
              </T>
              <T
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: stage === "back" && i === 0 ? "#00ac36" : colors.muted,
                }}
              >
                {p === "light"
                  ? "15 min"
                  : p === "hall"
                    ? "12 min"
                    : stage === "back"
                      ? "Visited"
                      : "4 min"}
              </T>
            </View>
            <T style={{ color: colors.muted, fontSize: 14, lineHeight: 18 }}>
              {p === "burger"
                ? "Kendrick’s late-night spot"
                : p === "light"
                  ? "202 lamps at golden hour"
                  : "Where LA Phil meets hip-hop"}
            </T>
          </Button>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  header: {
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tourCard: {
    marginHorizontal: 24,
    marginTop: 18,
    padding: 18,
    borderRadius: 24,
    gap: 14,
    backgroundColor: colors.peach,
    ...shadow,
    shadowOpacity: 0.04,
  },
  meta: { fontSize: 13, lineHeight: 16, color: colors.muted },
  ask: {
    backgroundColor: "white",
    borderRadius: 99,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
