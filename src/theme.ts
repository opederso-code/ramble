import { Platform } from "react-native";
export const colors = {
  ink: "#20221d",
  muted: "#73776d",
  faint: "#b2b5b0",
  white: "#ffffff",
  surface: "#f4f4f2",
  peach: "#ffede2",
  avatar: "#e6a681",
  blue: "#d3fbff",
  pink: "#fcecff",
  green: "#e8ffdc",
  yellow: "#fff4e1",
  border: "#e8e8e5",
};
export const font = Platform.select({
  ios: "ui-rounded",
  web: "ui-rounded, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  default: "sans-serif",
});
export const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 3,
};
