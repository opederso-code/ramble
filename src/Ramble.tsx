import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors, shadow } from "./theme";
import { assets } from "./assets";
import {
  Button,
  Icon,
  IconButton,
  T,
  WebHome,
  WebStatus,
  ui,
} from "./components/ui";
import { RouteMap, Stage } from "./components/RouteMap";
import { BrowseScreen, Place } from "./screens/BrowseScreen";
import { TourScreen, narration } from "./screens/TourScreen";
import { IntroScreen, ConversationScreen } from "./screens/ChatScreens";
import { LocationScreen, places } from "./screens/LocationScreen";
import { EntryScreen } from "./screens/EntryScreen";

const screens = [
  ["browse", "Discover", "Guides & places around you"],
  ["entry", "01 · Entry Point", "A tour invitation"],
  ["entry-alt", "02 · Entry Point", "Notification variation"],
  ["intro", "Tour is Starting", "Meet your guide"],
  ["tour", "On a Tour", "Walk through Los Angeles"],
  ["detail", "Location Detail", "A closer look at Fatburger"],
  ["back", "Back to the Main Tour", "Keep exploring"],
  ["conversation", "Asking a Question", "Make the tour your own"],
  ["rerouted", "New Route", "Chasing golden hour"],
] as const;
type Screen = (typeof screens)[number][0];
type Overlay = "map" | "stops" | "camera" | null;
const isScreen = (s: string | null): s is Screen =>
  screens.some(([key]) => key === s);
const savedKey = "@ramble/saved-places/v1";

export default function App() {
  return (
    <SafeAreaProvider>
      <Ramble />
    </SafeAreaProvider>
  );
}
function Ramble() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const desktop = Platform.OS === "web" && width >= 900;
  const top = Platform.OS === "web" ? 54 : Math.max(insets.top, 24);
  const bottom = Platform.OS === "web" ? 26 : Math.max(insets.bottom, 16);
  const params = useLocalSearchParams<{ screen?: string }>();
  const screen: Screen = isScreen(params.screen ?? null)
    ? (params.screen as Screen)
    : "browse";
  const [previousStage, setStage] = useState<Stage>(() =>
    screen === "rerouted"
      ? "rerouted"
      : screen === "back" || screen === "conversation"
        ? "back"
        : "tour",
  );
  const stage: Stage =
    screen === "tour" || screen === "back" || screen === "rerouted"
      ? screen
      : previousStage;
  const [place, setPlace] = useState<Place>("burger");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [playing, setPlaying] = useState(true);
  const [notePlaying, setNotePlaying] = useState(false);
  const [voice, setVoice] = useState(false);
  const [saved, setSaved] = useState<Place[]>([]);
  const [toast, setToast] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [response, setResponse] = useState("");
  const [lastScreen, setLastScreen] = useState(screen);
  // Reset transient UI when an external link or browser Back changes the route.
  if (lastScreen !== screen) {
    setLastScreen(screen);
    setOverlay(null);
    setPending(false);
    setNotePlaying(false);
  }
  const history = useRef<Screen[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechVersion = useRef(0);
  const saveVersion = useRef(0);

  const notify = useCallback((text: string) => {
    setToast(text);
    AccessibilityInfo.announceForAccessibility(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  }, []);
  const stopSpeech = useCallback(() => {
    speechVersion.current++;
    void Speech.stop();
    setNotePlaying(false);
  }, []);
  const speak = useCallback(
    async (text: string, note = false) => {
      const version = ++speechVersion.current;
      await Speech.stop();
      if (version !== speechVersion.current) return;
      if (note) setNotePlaying(true);
      else setPlaying(true);
      const done = () => {
        if (version === speechVersion.current) {
          if (note) setNotePlaying(false);
          else setPlaying(false);
        }
      };
      Speech.speak(text, {
        language: "en-US",
        rate: 0.94,
        onDone: done,
        onStopped: done,
        onError: () => {
          done();
          notify(
            "Read aloud is unavailable on this device. You can still read every message.",
          );
        },
      });
    },
    [notify],
  );
  const navigate = useCallback(
    (next: Screen, replace = false) => {
      Keyboard.dismiss();
      stopSpeech();
      setOverlay(null);
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      setPending(false);
      if (!replace) history.current.push(screen);

      if (next === "tour" || next === "back" || next === "rerouted") {
        setStage(next);
        setPlaying(true);
      }
      if (next === "conversation") {
        setMessage("");
        setResponse("");
      }
      const destination = { pathname: "/" as const, params: { screen: next } };
      if (replace) router.replace(destination);
      else router.navigate(destination);
    },
    [screen, stopSpeech],
  );
  const back = useCallback(() => {
    if (overlay) {
      setOverlay(null);
      return;
    }
    if (screen === "conversation") {
      navigate(stage, true);
      return;
    }
    if (screen === "detail") {
      navigate(stage === "rerouted" ? "rerouted" : "back", true);
      return;
    }
    const previous = history.current.pop();
    navigate(previous ?? "browse", true);
  }, [overlay, screen, stage, navigate]);

  useEffect(() => {
    let active = true;
    const version = saveVersion.current;
    AsyncStorage.getItem(savedKey)
      .then((value) => {
        if (active && version === saveVersion.current && value) {
          const parsed: unknown = JSON.parse(value);
          if (Array.isArray(parsed))
            setSaved(
              parsed.filter(
                (p): p is Place =>
                  p === "burger" || p === "hall" || p === "light",
              ),
            );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (screen === "browse" && !overlay) return false;
        back();
        return true;
      },
    );
    return () => subscription.remove();
  }, [screen, overlay, back]);
  useEffect(
    () => () => {
      speechVersion.current++;
      void Speech.stop();
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    },
    [screen],
  );
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      void Speech.stop();
    },
    [],
  );

  function openPlace(p: Place) {
    setPlace(p);
    navigate("detail");
  }
  function togglePlayback() {
    if (playing) {
      stopSpeech();
      setPlaying(false);
    } else void speak(`${narration[stage].main} ${narration[stage].next}`);
  }
  function toggleVoice() {
    if (voice) {
      stopSpeech();
      setPlaying(false);
    } else {
      notify("Read aloud on · using your device’s voice");
      void speak(
        screen === "intro"
          ? "Welcome to LA. My city. I’m gonna show you the places that made me, from Compton all the way to the coast. So, what’s first?"
          : narration[stage].main,
      );
    }
    setVoice(!voice);
  }
  function send(text: string) {
    if (pending) return;
    Keyboard.dismiss();
    if (screen === "intro") {
      if (/beach|coast/i.test(text)) {
        navigate("rerouted");
        notify("Let’s catch golden hour at Urban Light first.");
      } else navigate("tour");
      return;
    }
    setMessage(text);
    setResponse("");
    if (/sunset|iconic|light|golden|view|beach|route/i.test(text)) {
      setPending(true);
      timer.current = setTimeout(() => {
        setPending(false);
        navigate("rerouted");
        if (voice) void speak(narration.rerouted.main);
      }, 2200);
    } else if (/next|continue|mural/i.test(text)) {
      navigate("back");
    } else {
      const reply = /food|burger|eat/i.test(text)
        ? "Get the double with chili at Fatburger. Tap its card on the tour to take a closer look."
        : "Let’s keep exploring Crenshaw. Ask for “somewhere iconic” or “sunset views” to try a different route, or say “next” to continue.";
      setResponse(reply);
      if (voice) void speak(reply);
    }
  }
  async function toggleSave() {
    saveVersion.current++;
    const next = saved.includes(place)
      ? saved.filter((p) => p !== place)
      : [...saved, place];
    setSaved(next);
    try {
      await AsyncStorage.setItem(savedKey, JSON.stringify(next));
    } catch {
      notify("Saved for this visit. Device storage is unavailable.");
    }
  }
  async function website() {
    try {
      await Linking.openURL(places[place].website);
    } catch {
      notify("Could not open the website. Please try again.");
    }
  }
  const light = screen === "entry" || screen === "entry-alt";
  const tour = (
    <TourScreen
      stage={stage}
      top={top}
      bottom={bottom}
      onPlace={openPlace}
      onChat={() => navigate("conversation")}
      onMap={() => setOverlay("map")}
      onAll={() => setOverlay("stops")}
      playing={playing}
      togglePlayback={togglePlayback}
      replay={() =>
        void speak(`${narration[stage].main} ${narration[stage].next}`)
      }
    />
  );

  return (
    <View style={[s.app, desktop && s.desktop]}>
      <StatusBar style={light ? "light" : "dark"} />
      {desktop && (
        <View style={s.sidebar}>
          <View style={[ui.row, { gap: 12, marginBottom: 10 }]}>
            <View style={s.brandIcon}>
              <Icon name="navigation-pointer-01" color="white" size={23} />
            </View>
            <T
              weight="700"
              style={{ fontSize: 28, lineHeight: 34, letterSpacing: -1 }}
            >
              ramble
            </T>
          </View>
          <T
            style={{
              color: colors.muted,
              fontSize: 14,
              lineHeight: 21,
              marginBottom: 32,
            }}
          >
            A city. A familiar voice.{"\n"}A different way to wander.
          </T>
          <View style={{ gap: 5 }}>
            {screens.map(([key, name, description], i) => (
              <Button
                key={key}
                label={`Preview ${name}`}
                onPress={() => navigate(key)}
                selected={key === screen}
                style={[
                  s.navItem,
                  key === screen && { backgroundColor: "#e8e9e3" },
                ]}
              >
                <T
                  weight="500"
                  style={{
                    color: key === screen ? colors.ink : "#96998e",
                    fontSize: 12,
                    width: 24,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </T>
                <View>
                  <T weight="600" style={{ fontSize: 14, lineHeight: 20 }}>
                    {name}
                  </T>
                  {key === screen && (
                    <T
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        lineHeight: 18,
                      }}
                    >
                      {description}
                    </T>
                  )}
                </View>
              </Button>
            ))}
          </View>
          <T
            style={{
              color: colors.muted,
              fontSize: 12,
              lineHeight: 18,
              marginTop: 30,
            }}
          >
            Interactive design preview{"\n"}Los Angeles · Kendrick Lamar
          </T>
        </View>
      )}
      <View
        style={[
          s.phone,
          desktop && {
            width: 402,
            height: Math.min(874, height - 48),
            flex: 0,
            borderRadius: 36,
            ...shadow,
          },
        ]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {screen === "browse" && (
            <BrowseScreen
              top={top}
              bottom={bottom}
              onGuide={() => navigate("intro")}
              onPlace={openPlace}
              notify={notify}
            />
          )}
          {light && (
            <EntryScreen
              top={top}
              bottom={bottom}
              onOpen={() => navigate("intro")}
              onCamera={() => setOverlay("camera")}
            />
          )}
          {screen === "intro" && (
            <IntroScreen
              top={top}
              bottom={bottom}
              onClose={() => navigate("browse")}
              onSend={send}
              voice={voice}
              onVoice={toggleVoice}
            />
          )}
          {(screen === "tour" || screen === "back" || screen === "rerouted") &&
            tour}
          {screen === "detail" && (
            <LocationScreen
              place={place}
              top={top}
              bottom={bottom}
              onClose={() =>
                navigate(stage === "rerouted" ? "rerouted" : "back")
              }
              onMap={() => setOverlay("map")}
              onCall={() =>
                notify(
                  "No phone number is included for this demo stop. Visit the website for contact details.",
                )
              }
              onWebsite={website}
              saved={saved.includes(place)}
              onSave={() => void toggleSave()}
              playing={notePlaying}
              onPlay={() => {
                if (notePlaying) stopSpeech();
                else void speak(places[place].quote, true);
              }}
            />
          )}
          {screen === "conversation" && (
            <>
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                {tour}
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: "rgba(0,0,0,.18)" },
                  ]}
                />
              </View>
              <ConversationScreen
                top={top}
                bottom={bottom}
                onClose={() => navigate(stage)}
                onSend={send}
                voice={voice}
                onVoice={toggleVoice}
                playing={playing}
                onPlayback={togglePlayback}
                replay={(text) => void speak(text)}
                message={message}
                pending={pending}
                response={response}
              />
            </>
          )}
        </KeyboardAvoidingView>
        <View
          pointerEvents="none"
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        >
          <WebStatus light={light} />
        </View>
        {screen !== "browse" && <WebHome light={light} />}
        {overlay && (
          <View
            accessibilityViewIsModal
            style={[s.overlay, { paddingTop: top, paddingBottom: bottom }]}
          >
            <View
              style={[
                ui.between,
                { paddingHorizontal: 24, paddingVertical: 16 },
              ]}
            >
              <T weight="600" style={{ fontSize: 24, lineHeight: 30 }}>
                {overlay === "map"
                  ? "Your route"
                  : overlay === "camera"
                    ? "Los Angeles"
                    : "Your stops"}
              </T>
              <IconButton
                name="x-close"
                label="Close overlay"
                onPress={() => setOverlay(null)}
              />
            </View>
            {overlay === "map" && (
              <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
                <RouteMap stage={stage} />
                <T weight="600" style={{ fontSize: 22, lineHeight: 28 }}>
                  {stage === "rerouted"
                    ? "Next: Urban Light"
                    : stage === "back"
                      ? "Next: Crenshaw mural"
                      : "Next: Fatburger"}
                </T>
                <T style={ui.muted}>
                  {stage === "rerouted"
                    ? "15 minute drive · Wilshire Boulevard"
                    : stage === "back"
                      ? "2 minute walk · 54th Street"
                      : "4 minute walk · Crenshaw Boulevard"}
                </T>
                <T>
                  This preview follows the route in the design. Explore the
                  stops or ask Kendrick to change where you go next.
                </T>
                <Button
                  label="Continue exploring"
                  onPress={() => setOverlay(null)}
                  style={s.primary}
                >
                  <T weight="600" style={{ color: "white" }}>
                    Continue exploring
                  </T>
                </Button>
              </ScrollView>
            )}
            {overlay === "stops" && (
              <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
                {(["burger", "hall", "light"] as Place[]).map((p) => (
                  <Button
                    key={p}
                    label={`Open ${places[p].name}`}
                    onPress={() => openPlace(p)}
                    style={[
                      ui.row,
                      {
                        padding: 12,
                        backgroundColor: colors.surface,
                        borderRadius: 20,
                        gap: 14,
                      },
                    ]}
                  >
                    <Image
                      source={assets[p]}
                      style={{ width: 80, height: 80, borderRadius: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <T weight="600">{places[p].name}</T>
                      <T style={{ fontSize: 13, color: colors.muted }}>
                        {saved.includes(p)
                          ? "Saved to your places"
                          : "On your LA tour"}
                      </T>
                    </View>
                    <Icon name="chevron-right" size={18} />
                  </Button>
                ))}
              </ScrollView>
            )}
            {overlay === "camera" && (
              <>
                <Image
                  source={assets.wallpaperOverlay}
                  style={{ flex: 1, margin: 24, borderRadius: 24 }}
                  contentFit="cover"
                />
                <T
                  style={{
                    textAlign: "center",
                    marginBottom: 24,
                    color: colors.muted,
                  }}
                >
                  A little inspiration for your next walk.
                </T>
              </>
            )}
          </View>
        )}
        {!!toast && (
          <Button
            label="Dismiss message"
            onPress={() => setToast("")}
            style={[s.toast, { bottom: bottom + 12 }]}
          >
            <T
              accessibilityLiveRegion="polite"
              style={{ color: "white", fontSize: 14, lineHeight: 20 }}
            >
              {toast}
            </T>
          </Button>
        )}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: "white" },
  desktop: {
    backgroundColor: "#f3f4ef",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 64,
    padding: 24,
  },
  phone: {
    flex: 1,
    backgroundColor: "white",
    overflow: "hidden",
    width: "100%",
  },
  sidebar: { width: 260 },
  brandIcon: {
    backgroundColor: colors.ink,
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    gap: 6,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    zIndex: 20,
  },
  toast: {
    position: "absolute",
    zIndex: 30,
    left: 20,
    right: 20,
    backgroundColor: colors.ink,
    padding: 16,
    borderRadius: 18,
    ...shadow,
  },
  primary: {
    padding: 16,
    backgroundColor: colors.ink,
    borderRadius: 99,
    alignItems: "center",
  },
});
