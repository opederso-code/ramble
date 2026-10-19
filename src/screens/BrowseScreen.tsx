import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { assets } from "../assets";
import { colors, shadow } from "../theme";
import { Avatar, Button, Chip, Handle, T, ui } from "../components/ui";
import { IconName } from "../icons";
export type Place = "burger" | "hall" | "light";
const guides = [
  {
    name: "Kendrick Lamar",
    source: assets.kendrick,
    color: colors.avatar,
    type: ["Artists", "Local"],
  },
  {
    name: "The Grinch",
    source: assets.grinch,
    color: "#96f187",
    type: ["Actors", "Comedians"],
  },
  {
    name: "Doremon",
    source: assets.doremon,
    color: "#fff",
    type: ["Actors", "Creators"],
  },
];
const categories: {
  title: string;
  icon: IconName;
  color: string;
  ink: string;
}[] = [
  {
    title: "Artists",
    icon: "microphone-01",
    color: colors.peach,
    ink: "#f59a00",
  },
  { title: "Local", icon: "marker-pin-01", color: "#f9a7a7", ink: "#fa2341" },
  { title: "Actors", icon: "film-01", color: colors.pink, ink: "#f044a8" },
  {
    title: "Athletes",
    icon: "trophy-01",
    color: colors.yellow,
    ink: "#ff8326",
  },
  {
    title: "Comedians",
    icon: "face-smile",
    color: colors.blue,
    ink: "#4b71b9",
  },
  {
    title: "Creators",
    icon: "video-recorder",
    color: colors.green,
    ink: "#819e46",
  },
];
export function BrowseScreen({
  top,
  bottom,
  onGuide,
  onPlace,
  notify,
}: {
  top: number;
  bottom: number;
  onGuide: () => void;
  onPlace: (p: Place) => void;
  notify: (message: string) => void;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = guides.filter((g) => !filter || g.type.includes(filter));
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottom + 20 }}
    >
      <View style={{ height: 226 + top - 54, overflow: "hidden" }}>
        <Image
          source={assets.browseMap}
          style={{
            position: "absolute",
            left: -63,
            top: -60,
            width: 744,
            height: 467,
          }}
          contentFit="cover"
        />
        <Image
          source={assets.browseLocation}
          style={{
            position: "absolute",
            left: "24.38%",
            top: top + 112,
            width: 36,
            height: 36,
          }}
        />
        <Button
          label="Tour with Kendrick Lamar"
          onPress={onGuide}
          style={[s.pin, { left: "4.2%", top: top + 8 }]}
        >
          <View style={s.tile}>
            <Avatar size={42} />
          </View>
          <T weight="600" style={s.pinTitle}>
            Kendrick Lamar
          </T>
          <T weight="600" style={s.pinSubtitle}>
            +3 stops
          </T>
        </Button>
        <Button
          label="Explore Fatburger"
          onPress={() => onPlace("burger")}
          style={[s.pin, { left: "36.6%", top: top + 42 }]}
        >
          <View style={{ width: 66, height: 52 }}>
            <Image
              source={assets.hall}
              style={[
                s.tile,
                {
                  position: "absolute",
                  left: 20,
                  top: 2,
                  transform: [{ rotate: "6deg" }],
                },
              ]}
            />
            <Image source={assets.burger} style={[s.tile, { top: 4 }]} />
          </View>
          <T weight="600" style={s.pinTitle}>
            Fatburger
          </T>
          <T weight="600" style={s.pinSubtitle}>
            +1 more
          </T>
        </Button>
        <Button
          label="The Grinch holiday tour"
          onPress={() =>
            notify(
              "The Grinch’s holiday tour is coming soon. Try Kendrick’s LA tour.",
            )
          }
          style={[s.pin, { left: "76.1%", top: top + 6 }]}
        >
          <View style={[s.tile, { backgroundColor: "#96f187", padding: 3 }]}>
            <Image source={assets.grinch} style={{ width: 36, height: 36 }} />
          </View>
          <T weight="600" style={s.pinTitle}>
            The Grinch
          </T>
          <T weight="600" style={s.pinSubtitle}>
            Holiday tour
          </T>
        </Button>
        <Button
          label="Explore Urban Light"
          onPress={() => onPlace("light")}
          style={[s.pin, { left: "65.2%", top: top + 94 }]}
        >
          <Image source={assets.light} style={s.tile} />
          <T weight="600" style={s.pinTitle}>
            Urban Light
          </T>
        </Button>
      </View>
      <View style={s.sheet}>
        <Handle wide />
        <View style={[ui.row, s.location]}>
          <View style={s.cityIcon}>
            <Image
              source={assets.building}
              style={{ width: 60.29, height: 60.29, marginTop: 8.42 }}
            />
          </View>
          <View style={{ gap: 4 }}>
            <T weight="600" style={{ fontSize: 20, lineHeight: 24 }}>
              Downtown
            </T>
            <T style={{ color: colors.muted, fontSize: 14, lineHeight: 17 }}>
              Los Angeles, California
            </T>
          </View>
        </View>
        <T weight="600" style={s.heading}>
          {filter ? `${filter} guides` : "Suggested Guides"}
        </T>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.cards}
        >
          {filtered.map((g) => (
            <Button
              key={g.name}
              label={`Select ${g.name}`}
              onPress={() =>
                g.name === "Kendrick Lamar"
                  ? onGuide()
                  : notify(
                      `${g.name}’s tour is coming soon. Try Kendrick’s LA tour.`,
                    )
              }
              style={{ width: 128, gap: 8 }}
            >
              <View style={[s.guideImage, { backgroundColor: g.color }]}>
                <Image
                  source={g.source}
                  style={
                    g.name === "The Grinch"
                      ? {
                          width: 98,
                          height: 89.8,
                          marginTop: 19,
                          alignSelf: "center",
                        }
                      : { width: 128, height: 128 }
                  }
                />
              </View>
              <T style={s.label}>{g.name}</T>
            </Button>
          ))}
          {filtered.length === 0 && (
            <View style={{ height: 153, justifyContent: "center", width: 330 }}>
              <T weight="600">More guides are on the way.</T>
              <T style={ui.muted}>Choose another category to explore LA.</T>
            </View>
          )}
        </ScrollView>
        <T
          weight="600"
          style={[s.heading, { marginTop: 30, marginBottom: 14 }]}
        >
          Guides by Type
        </T>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <View style={{ gap: 10 }}>
            <View style={[ui.row, { gap: 8 }]}>
              {categories.slice(0, 4).map((c) => (
                <Chip
                  key={c.title}
                  {...c}
                  large
                  selected={filter === c.title}
                  onPress={() => setFilter(filter === c.title ? null : c.title)}
                />
              ))}
            </View>
            <View style={[ui.row, { gap: 8 }]}>
              {categories.slice(4).map((c) => (
                <Chip
                  key={c.title}
                  {...c}
                  large
                  selected={filter === c.title}
                  onPress={() => setFilter(filter === c.title ? null : c.title)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
        <T weight="600" style={[s.heading, { marginTop: 31 }]}>
          Suggested Locations
        </T>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.cards}
        >
          {(["burger", "hall", "light"] as Place[]).map((p, i) => (
            <Button
              key={p}
              label={`View ${["Fatburger", "Concert Hall", "Urban Light"][i]}`}
              onPress={() => onPlace(p)}
              style={{ width: 128, gap: 8 }}
            >
              <View>
                <Image
                  source={assets[p]}
                  style={{ width: 128, height: 128, borderRadius: 16 }}
                  contentFit="cover"
                />
                <View style={{ position: "absolute", bottom: 4, right: 4 }}>
                  <Avatar size={48} />
                </View>
              </View>
              <View style={{ gap: 2 }}>
                <View style={ui.between}>
                  <T style={s.label}>
                    {["FatBurger", "Location 2", "FatBurger"][i]}
                  </T>
                  <T style={[s.label, ui.muted]}>2 min</T>
                </View>
                <T style={[s.label, ui.muted]}>Ice Cube</T>
              </View>
            </Button>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "white",
    marginTop: 0,
    ...shadow,
  },
  location: { marginTop: 23, paddingHorizontal: 24, gap: 13, marginBottom: 28 },
  cityIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#bde8ff",
    borderRadius: 7,
    overflow: "hidden",
    alignItems: "center",
  },
  heading: { marginHorizontal: 24, lineHeight: 24, marginBottom: 14 },
  cards: { paddingHorizontal: 24, gap: 16 },
  guideImage: { width: 128, height: 128, borderRadius: 14, overflow: "hidden" },
  label: { fontSize: 14, lineHeight: 17 },
  pin: { position: "absolute", alignItems: "center" },
  tile: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "white",
    overflow: "hidden",
    ...shadow,
  },
  pinTitle: {
    fontSize: 13,
    lineHeight: 16,
    marginTop: 5,
    backgroundColor: "rgba(255,255,255,.72)",
  },
  pinSubtitle: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
    backgroundColor: "rgba(255,255,255,.72)",
  },
});
