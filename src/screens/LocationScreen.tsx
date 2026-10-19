import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { assets } from "../assets";
import { colors, shadow } from "../theme";
import {
  Avatar,
  Button,
  Handle,
  Icon,
  IconButton,
  T,
  ui,
} from "../components/ui";
import { RouteMap } from "../components/RouteMap";
import { Place } from "./BrowseScreen";
export const places = {
  burger: {
    name: "Fat Burger",
    subtitle: "Burger joint  ·  Crenshaw, Los Angeles",
    address: "Crenshaw Blvd, Los Angeles, CA",
    quote:
      "“We’d pull up here after the studio. Get the double with chili, grab the window seat. The whole neighborhood comes through eventually.”",
    image: assets.burgerDetail,
    website: "https://fatburger.com/",
  },
  hall: {
    name: "Concert Hall",
    subtitle: "Architecture  ·  Downtown, Los Angeles",
    address: "111 S Grand Ave, Los Angeles, CA",
    quote:
      "“Look at those curves. This city has a sound of its own. Right here is where LA Phil meets hip-hop.”",
    image: assets.hallTour,
    website: "https://www.laphil.com/",
  },
  light: {
    name: "Urban Light",
    subtitle: "Public art  ·  LACMA, Los Angeles",
    address: "5905 Wilshire Blvd, Los Angeles, CA",
    quote:
      "“202 lamps, one unforgettable view. This is the spot for golden hour. Take your time here.”",
    image: assets.lightTour,
    website: "https://www.lacma.org/",
  },
};
export function LocationScreen({
  place,
  top,
  bottom,
  onClose,
  onMap,
  onWebsite,
  onCall,
  saved,
  onSave,
  playing,
  onPlay,
}: {
  place: Place;
  top: number;
  bottom: number;
  onClose: () => void;
  onMap: () => void;
  onWebsite: () => void;
  onCall: () => void;
  saved: boolean;
  onSave: () => void;
  playing: boolean;
  onPlay: () => void;
}) {
  const data = places[place];
  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
        <RouteMap detail />
      </View>
      <View style={[s.sheet, { marginTop: top + 96 }]}>
        <Handle />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View style={{ marginHorizontal: 24, marginTop: 13 }}>
            <View style={ui.between}>
              <T
                weight="600"
                style={{ fontSize: 28, lineHeight: 34, letterSpacing: -0.4 }}
              >
                {data.name}
              </T>
              <IconButton
                name="x-close"
                label="Close place details"
                onPress={onClose}
                size={32}
                iconSize={16}
              />
            </View>
            <T
              style={{
                fontSize: 15,
                lineHeight: 20,
                marginTop: 2,
                color: colors.muted,
              }}
            >
              {data.subtitle}
            </T>
            <View style={[ui.row, { gap: 6, marginTop: 8 }]}>
              <Icon name="star-01" color="#fb8835" size={14} />
              <T weight="600" style={s.meta}>
                {place === "burger" ? "4.6" : "4.8"}
              </T>
              <T style={[s.meta, ui.muted]}>
                (2.1k) · {place === "burger" ? "$" : "Free"} ·
              </T>
              <T weight="600" style={[s.meta, { color: "#33a652" }]}>
                Open
              </T>
              <T style={[s.meta, ui.muted]}>until 11 PM</T>
            </View>
            <View style={[ui.row, { gap: 8, marginTop: 16 }]}>
              {(
                [
                  {
                    title: "Directions",
                    icon: "navigation-pointer-01",
                    action: onMap,
                  },
                  { title: "Call", icon: "phone", action: onCall },
                  { title: "Website", icon: "globe-01", action: onWebsite },
                  {
                    title: saved ? "Saved" : "Save",
                    icon: saved ? "bookmark-check" : "bookmark",
                    action: onSave,
                  },
                ] as const
              ).map((a, i) => (
                <Button
                  key={i}
                  label={a.title}
                  onPress={a.action}
                  selected={i === 3 ? saved : undefined}
                  style={[
                    s.action,
                    { backgroundColor: i === 0 ? colors.ink : colors.surface },
                  ]}
                >
                  <Icon
                    name={a.icon}
                    size={20}
                    color={i === 0 ? "white" : colors.ink}
                  />
                  <T
                    weight="600"
                    style={{
                      fontSize: 12,
                      lineHeight: 16,
                      color: i === 0 ? "white" : colors.ink,
                    }}
                  >
                    {a.title}
                  </T>
                </Button>
              ))}
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              gap: 8,
              marginTop: 14,
            }}
          >
            <Image
              source={data.image}
              style={{ width: 170, height: 150, borderRadius: 16 }}
              contentFit="cover"
            />
            <View
              style={{
                width: 220,
                height: 150,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                source={data.image}
                style={{
                  position: "absolute",
                  width: "222.22%",
                  height: "181.82%",
                  left: "-111.11%",
                  top: "-72.73%",
                }}
                contentFit="fill"
              />
            </View>
          </ScrollView>
          <View style={s.take}>
            <View style={ui.between}>
              <View style={[ui.row, { gap: 10 }]}>
                <Avatar size={36} />
                <View style={{ gap: 2 }}>
                  <T weight="600" style={{ lineHeight: 20 }}>
                    Kendrick’s take
                  </T>
                  <T
                    style={{
                      fontSize: 13,
                      lineHeight: 16,
                      color: colors.muted,
                    }}
                  >
                    {playing ? "Playing" : "Voice note"} · 0:38
                  </T>
                </View>
              </View>
              <IconButton
                name={playing ? "pause-circle" : "play"}
                label={playing ? "Pause voice note" : "Play voice note"}
                size={40}
                iconSize={16}
                style={{ backgroundColor: "white" }}
                onPress={onPlay}
              />
            </View>
            <T style={{ lineHeight: 23 }}>{data.quote}</T>
          </View>
          <Button
            label="View address on map"
            onPress={onMap}
            style={[ui.row, { marginHorizontal: 24, marginTop: 18, gap: 10 }]}
          >
            <Icon name="marker-pin-01" size={18} color={colors.muted} />
            <T style={{ flex: 1, fontSize: 15, lineHeight: 20 }}>
              {data.address}
            </T>
            <Icon name="chevron-right" size={18} color={colors.muted} />
          </Button>
        </ScrollView>
        <Button
          label="Back to tour"
          onPress={onClose}
          style={[s.back, { marginBottom: bottom + 8 }]}
        >
          <Icon name="navigation-pointer-01" size={16} color="white" />
          <T weight="600" style={{ color: "white", fontSize: 17 }}>
            Back to tour
          </T>
        </Button>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    ...shadow,
  },
  meta: { fontSize: 14, lineHeight: 18 },
  action: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 4,
    borderRadius: 16,
  },
  take: {
    marginTop: 20,
    marginHorizontal: 24,
    backgroundColor: colors.peach,
    paddingTop: 16,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderRadius: 20,
    gap: 12,
  },
  back: {
    height: 56,
    marginHorizontal: 24,
    backgroundColor: colors.ink,
    borderRadius: 99,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadow,
  },
});
