import { StyleSheet } from "react-native";

export const colors = {
  // Bakgrunder
  background: "#18181c",
  card: "#2a222d",
  cardBorder: "#544a4c",

  // Text
  text: "#eadcc4",
  textMuted: "#ab9f98",
  textFaint: "#7d7170",

  // Accenter
  accent: "#c99e45",
  danger: "#a8463f",
  xp: "#5590a9",
  success: "#678a4a",

  // Resurser
  wood: "#8f603e",
  stone: "#827e7a",
};

const CONTROL_HEIGHT = 32;

export const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 4,
  },

  card: {
    width: "100%",
    padding: 12,
    gap: 20,
    backgroundColor: colors.background,
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

  textWarning: {
    fontFamily: "monogram",
    color: colors.accent,
    fontSize: 14,
    lineHeight: 14,
  },

  // knappar
  button: {
    height: CONTROL_HEIGHT,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  buttonSelected: {
    borderColor: colors.textMuted,
    backgroundColor: colors.cardBorder,
  },

  square: {
    width: CONTROL_HEIGHT,
    height: CONTROL_HEIGHT,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  //input
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    padding: 10,
    fontFamily: "monogram",
    color: colors.text,
    fontSize: 18,
  },
});
