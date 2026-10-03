import { StyleSheet } from "react-native";

export const colors = {
  // Bakgrunder
  background: "#2c2729", // var #353033
  card: "#40383b", // var #4b4245
  cardBorder: "#716466", // var #7e7072

  // Text
  text: "#f2e6d0",
  textMuted: "#a89b94",

  // Accenter
  accent: "#e3b75a",
  danger: "#c8574e",
  xp: "#6eaec9",
  success: "#7fa35e",

  // Resurser
  wood: "#b07b52",
  stone: "#a09c98",
};

const CONTROL_HEIGHT = 32;

export const styles = StyleSheet.create({
  // Layout
  card: {
    width: "100%",
    padding: 12,
    gap: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowBetween: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // text
  text: {
    fontFamily: "monogram",
    fontSize: 24,
    lineHeight: 24,
    color: colors.text,
  },

  // knappar
  button: {
    height: CONTROL_HEIGHT,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.background,
  },

  square: {
    width: CONTROL_HEIGHT,
    height: CONTROL_HEIGHT,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
