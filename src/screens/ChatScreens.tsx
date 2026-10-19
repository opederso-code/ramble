import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { colors } from "../theme";
import { assets } from "../assets";
import {
  Avatar,
  Button,
  Handle,
  Icon,
  IconButton,
  T,
  ui,
} from "../components/ui";
import { Composer } from "../components/Composer";
const intro = [
  "Welcome to LA. My city.",
  "I’m gonna show you the places that made me, from Compton all the way to the coast. Real spots, real stories.",
  "So… what’s first?",
];
const messages = [
  "Fatburger’s been feeding this block since ’52. Get the double with chili, trust me.",
  "Next up is the mural on 54th. Two minutes that way.",
];
export function IntroScreen({
  top,
  bottom,
  onClose,
  onSend,
  voice,
  onVoice,
}: {
  top: number;
  bottom: number;
  onClose: () => void;
  onSend: (text: string) => void;
  voice: boolean;
  onVoice: () => void;
}) {
  return (
    <View style={{ flex: 1, paddingTop: top }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View style={[ui.between, { marginHorizontal: 24, marginTop: 8 }]}>
          <IconButton
            name="x-close"
            label="Close introduction"
            onPress={onClose}
          />
          <IconButton
            name="recording-01"
            label={voice ? "Turn off read aloud" : "Turn on read aloud"}
            onPress={onVoice}
            dark={voice}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 14 }}>
          <Avatar size={84} />
          <T
            weight="600"
            style={{
              fontSize: 22,
              lineHeight: 28,
              marginTop: 20,
              letterSpacing: -0.35,
            }}
          >
            Your LA tour with Kendrick
          </T>
          <T
            style={{
              color: colors.muted,
              fontSize: 15,
              lineHeight: 20,
              marginTop: 6,
            }}
          >
            About 2 hrs · Walk + drive · 6 stops
          </T>
        </View>
        <T
          style={{
            fontSize: 12,
            lineHeight: 16,
            color: colors.muted,
            textAlign: "center",
            marginTop: 28,
            marginBottom: 14,
          }}
        >
          Today 10:32 AM
        </T>
        <View style={s.guideMessages}>
          <Avatar size={32} />
          <View style={s.bubbleColumn}>
            {intro.map((text, i) => (
              <View
                key={text}
                style={[s.bubble, i === 1 && { alignSelf: "stretch" }]}
              >
                <T>{text}</T>
              </View>
            ))}
          </View>
        </View>
        <View style={[ui.row, { marginLeft: 62, gap: 6, marginTop: 10 }]}>
          <Icon name="recording-01" size={14} color={colors.muted} />
          <T style={s.small}>
            {voice ? "Kendrick is speaking…" : "Kendrick is ready to explore…"}
          </T>
        </View>
      </ScrollView>
      <Composer
        onSend={onSend}
        onVoice={onVoice}
        voice={voice}
        bottom={bottom}
      />
    </View>
  );
}
export function ConversationScreen({
  top,
  bottom,
  onClose,
  onSend,
  voice,
  onVoice,
  playing,
  onPlayback,
  replay,
  message,
  pending,
  response,
}: {
  top: number;
  bottom: number;
  onClose: () => void;
  onSend: (text: string) => void;
  voice: boolean;
  onVoice: () => void;
  playing: boolean;
  onPlayback: () => void;
  replay: (text: string) => void;
  message: string;
  pending: boolean;
  response: string;
}) {
  return (
    <View style={[s.sheet, { marginTop: top + 82 }]}>
      <Handle />
      <View
        style={[
          ui.between,
          { marginTop: 11, marginHorizontal: 24, marginBottom: 24 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <T weight="600" style={{ fontSize: 20, lineHeight: 26 }}>
            Conversation
          </T>
          <T style={[s.small, { marginTop: 2 }]}>
            Tap Replay to hear any message again
          </T>
        </View>
        <View style={[ui.row, { gap: 8 }]}>
          <IconButton
            name={playing ? "pause-circle" : "play"}
            label={playing ? "Pause conversation" : "Play conversation"}
            dark
            onPress={onPlayback}
            iconSize={14}
          />
          <IconButton
            name="chevron-down"
            label="Close conversation"
            onPress={onClose}
          />
        </View>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28, gap: 16 }}
      >
        <View style={s.guideMessages}>
          <Avatar size={32} />
          <View style={s.bubbleColumn}>
            {messages.map((text, i) => (
              <View
                key={text}
                style={[s.bubble, { alignSelf: "stretch", gap: 8 }]}
              >
                <T>{text}</T>
                <Button
                  label={`Replay message ${i + 1}`}
                  onPress={() => replay(text)}
                  style={[ui.row, { gap: 6 }]}
                >
                  <Icon name="refresh-ccw-01" size={14} color={colors.muted} />
                  <T style={s.small}>Replay · {i === 0 ? "0:11" : "0:06"}</T>
                </Button>
              </View>
            ))}
          </View>
        </View>
        {!!message && (
          <View
            style={[
              ui.row,
              {
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginHorizontal: 20,
                gap: 10,
              },
            ]}
          >
            <View
              style={[
                s.bubble,
                { backgroundColor: colors.ink, maxWidth: 270, flexShrink: 1 },
              ]}
            >
              <T style={{ color: "white" }}>{message}</T>
            </View>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.blue,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="user-01" size={16} color="#4b71b9" />
            </View>
          </View>
        )}
        {pending && (
          <View style={[s.guideMessages, { alignItems: "flex-start" }]}>
            <Avatar size={32} />
            <View style={{ flex: 1, gap: 8 }}>
              <Image source={assets.typing} style={{ width: 66, height: 40 }} />
              <View style={[ui.row, { gap: 6 }]}>
                <Icon name="star-04" size={14} color="#819e46" />
                <T
                  accessibilityLiveRegion="polite"
                  style={[s.small, { flex: 1 }]}
                >
                  Finding a golden hour spot and rerouting…
                </T>
              </View>
            </View>
          </View>
        )}
        {!!response && !pending && (
          <View style={[s.guideMessages, { alignItems: "flex-start" }]}>
            <Avatar size={32} />
            <View style={[s.bubble, { flex: 1 }]}>
              <T accessibilityLiveRegion="polite">{response}</T>
            </View>
          </View>
        )}
      </ScrollView>
      <Composer
        conversation
        onSend={onSend}
        onVoice={onVoice}
        voice={voice}
        bottom={bottom}
      />
    </View>
  );
}
const s = StyleSheet.create({
  guideMessages: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginHorizontal: 20,
  },
  bubbleColumn: { gap: 6, flex: 1, maxWidth: 292 },
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignSelf: "flex-start",
  },
  small: { fontSize: 13, lineHeight: 16, color: colors.muted },
  sheet: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
});
