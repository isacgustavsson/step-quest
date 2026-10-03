import { StyleSheet } from "react-native";

export const colors = {
  // Bakgrunder
  background: "#1c181a", // nästan svart, varm med plommonton
  card: "#2b2528", // djup mullvadsbrun
  cardBorder: "#544a4c", // mörkt grå-rosa trä

  // Text
  text: "#eadcc4", // pergament, något dämpad
  textMuted: "#968a84",

  // Accenter
  accent: "#c99e45", // mörkare, mattare guld
  danger: "#a8463f",
  xp: "#5590a9", // djupare dämpad blå
  success: "#678a4a", // mörkare mossgrön

  // Resurser
  wood: "#8f603e",
  stone: "#827e7a",
};

const CONTROL_HEIGHT = 32;

export const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    margin: 12,
    alignItems: "center",
  },

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
