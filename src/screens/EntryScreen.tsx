import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { assets } from "../assets";
import { colors } from "../theme";
import { Avatar, Button, Icon, IconButton, T, ui } from "../components/ui";
export function EntryScreen({
  top,
  bottom,
  onOpen,
  onCamera,
}: {
  top: number;
  bottom: number;
  onOpen: () => void;
  onCamera: () => void;
}) {
  const [flash, setFlash] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "#1a1a1f" }}>
      <Image
        source={assets.wallpaper}
        style={[StyleSheet.absoluteFill, { left: -110, right: -108 }]}
        contentFit="cover"
        blurRadius={1.5}
      />
      <Image
        source={assets.wallpaperOverlay}
        style={[StyleSheet.absoluteFill, { left: -110, right: -108 }]}
        contentFit="cover"
        blurRadius={1.5}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: flash
              ? "rgba(255,255,255,.35)"
              : "rgba(41,26,15,.42)",
          },
        ]}
      />
      <View style={{ alignItems: "center", paddingTop: top + 8 }}>
        <Icon name="lock-01" size={22} color="white" />
        <T
          weight="600"
          style={{
            color: "rgba(255,255,255,.92)",
            fontSize: 20,
            lineHeight: 24,
            marginTop: 14,
          }}
        >
          Saturday, October 18
        </T>
        <T
          weight="700"
          style={{
            color: "white",
            fontSize: 104,
            lineHeight: 112,
            letterSpacing: -3,
          }}
        >
          10:31
        </T>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <View style={s.stack} />
        <Button
          label="Open Kendrick’s tour notification"
          onPress={onOpen}
          style={s.notification}
        >
          <View
            style={{
              backgroundColor: colors.avatar,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Avatar size={40} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={ui.between}>
              <T weight="600" style={{ fontSize: 15, lineHeight: 20 }}>
                Kendrick Lamar
              </T>
              <T style={{ color: colors.muted, fontSize: 13, lineHeight: 16 }}>
                now
              </T>
            </View>
            <T style={{ fontSize: 15, lineHeight: 20 }}>
              Exploring LA? I put together a tour of my city. Compton, Crenshaw,
              and the best burger you’ll ever have. You pulling up?
            </T>
          </View>
        </Button>
        <T
          style={{
            color: "rgba(255,255,255,.7)",
            fontSize: 13,
            lineHeight: 16,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          1 more from Kendrick
        </T>
      </View>
      <View
        style={[
          ui.between,
          { marginHorizontal: 46, marginTop: 16, marginBottom: bottom + 18 },
        ]}
      >
        <IconButton
          name="flash"
          label={
            flash ? "Turn off preview flashlight" : "Turn on preview flashlight"
          }
          size={50}
          iconSize={22}
          onPress={() => setFlash(!flash)}
          style={{
            backgroundColor: flash
              ? "rgba(255,255,255,.75)"
              : "rgba(255,255,255,.16)",
          }}
        />
        <Button label="Preview camera view" onPress={onCamera} style={s.camera}>
          <Icon name="camera-01" size={22} color="white" />
        </Button>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  stack: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 40,
    bottom: 26,
    backgroundColor: "rgba(255,255,255,.38)",
    borderRadius: 22,
  },
  notification: {
    flexDirection: "row",
    gap: 12,
    paddingLeft: 14,
    paddingRight: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,.82)",
    borderRadius: 26,
  },
  camera: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,.16)",
    alignItems: "center",
    justifyContent: "center",
  },
});
