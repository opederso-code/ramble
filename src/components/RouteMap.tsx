import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { assets } from "../assets";
import { colors, shadow } from "../theme";
import { Avatar, Icon, IconButton, T } from "./ui";
export type Stage = "tour" | "back" | "rerouted";
export function RouteMap({
  stage = "tour",
  onExpand,
  detail = false,
}: {
  stage?: Stage;
  onExpand?: () => void;
  detail?: boolean;
}) {
  const updated = stage === "rerouted";
  return (
    <View style={[s.map, detail && { height: 300, borderRadius: 0 }]}>
      <Image
        source={detail ? assets.detailMap : assets.tourMap}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <Image
        source={
          detail ? assets.detailRoute : updated ? assets.newRoute : assets.route
        }
        style={{
          position: "absolute",
          width: "100%",
          height: detail ? 170 : 196,
        }}
        contentFit="fill"
      />
      <Image
        source={assets.location}
        style={{
          position: "absolute",
          left: detail ? "17.41%" : "14.12%",
          top: detail ? 130 : 140,
          width: 40,
          height: 40,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: detail ? "69.15%" : updated ? "79.1%" : "68.36%",
          top: detail ? 40 : updated ? 42 : 30,
        }}
      >
        <Avatar size={detail ? 44 : 40} border />
      </View>
      {!detail && (
        <>
          <View style={s.pill}>
            <Icon name={updated ? "car-01" : "route"} size={16} />
            <T weight="600" style={{ fontSize: 14, lineHeight: 18 }}>
              {updated
                ? "Urban Light  ·  15 min drive"
                : stage === "back"
                  ? "Crenshaw mural  ·  2 min walk"
                  : "Fatburger  ·  4 min walk"}
            </T>
          </View>
          {onExpand && (
            <IconButton
              name="expand-01"
              label="Expand route map"
              size={32}
              iconSize={16}
              onPress={onExpand}
              style={s.expand}
            />
          )}
          {updated && (
            <View style={s.updated}>
              <Icon name="star-04" color="#7d9c3e" size={14} />
              <T weight="600" style={{ fontSize: 13, lineHeight: 16 }}>
                Route updated
              </T>
            </View>
          )}
        </>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  map: {
    height: 196,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#eeece6",
    ...shadow,
  },
  pill: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    gap: 6,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,.94)",
    alignItems: "center",
    ...shadow,
  },
  expand: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,.94)",
  },
  updated: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: colors.green,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
});
