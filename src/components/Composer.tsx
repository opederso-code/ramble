import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { colors, font, shadow } from "../theme";
import { Chip, IconButton, ui } from "./ui";
export function Composer({
  conversation,
  onSend,
  onVoice,
  voice,
  bottom,
}: {
  conversation?: boolean;
  onSend: (text: string) => void;
  onVoice: () => void;
  voice: boolean;
  bottom: number;
}) {
  const [value, setValue] = useState("");
  function send() {
    if (value.trim()) {
      onSend(value.trim());
      setValue("");
    }
  }
  return (
    <View style={[s.composer, { marginBottom: bottom + 4 }]}>
      <View style={[ui.row, { gap: 8 }]}>
        <TextInput
          accessibilityLabel={
            conversation ? "Reply to Kendrick" : "Ask Kendrick anything"
          }
          value={value}
          onChangeText={setValue}
          placeholder={
            conversation ? "Reply to Kendrick…" : "Ask Kendrick anything…"
          }
          placeholderTextColor={colors.muted}
          style={s.input}
          returnKeyType="send"
          onSubmitEditing={send}
          blurOnSubmit
        />
        <IconButton
          name="arrow-up"
          label="Send message"
          size={32}
          dark
          onPress={send}
        />
      </View>
      <View style={[ui.row, { gap: 8 }]}>
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          style={{ flex: 1 }}
        >
          <Chip
            title={conversation ? "Somewhere iconic" : "Grab some food"}
            icon={conversation ? "star-04" : "marker-pin-01"}
            color={conversation ? colors.yellow : colors.peach}
            onPress={() =>
              onSend(
                conversation
                  ? "Actually, can we see something iconic before sunset?"
                  : "Let’s grab some food.",
              )
            }
          />
          <Chip
            title={conversation ? "Sunset views" : "Hit the beach"}
            icon={conversation ? "sunset" : "waves"}
            color={conversation ? colors.pink : colors.blue}
            ink={conversation ? "#ef4da9" : "#4b71b9"}
            onPress={() =>
              onSend(
                conversation
                  ? "Let’s find a sunset view."
                  : "Let’s hit the beach.",
              )
            }
          />
        </ScrollView>
        <IconButton
          name="recording-01"
          label={voice ? "Turn off read aloud" : "Turn on read aloud"}
          size={32}
          onPress={onVoice}
          dark={voice}
        />
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  composer: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: 16,
    paddingBottom: 14,
    paddingLeft: 18,
    paddingRight: 14,
    borderRadius: 28,
    backgroundColor: "white",
    gap: 14,
    ...shadow,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontFamily: Platform.OS === "ios" ? "System" : font,
    fontSize: 16,
    lineHeight: 22,
    padding: 0,
    height: 32,
    outlineWidth: 0,
  },
});
