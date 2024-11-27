import { StyleSheet } from "react-native";

export const ICON_SIZE = 26;

export const DEFAULT_COLOURS = {
  secondary: "#A9A9A9",
  primary: "#9E599A",
  tertiary: "0F7173",
  // TODO: change name of this
  secondarySubmit: "#272932",
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  headerContainer: {
    paddingTop: 50,
    paddingLeft: 20,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
    paddingHorizontal: 20,
    paddingTop: 80,
    marginBottom: 16,
  },
  submitButton: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 80,
    backgroundColor: DEFAULT_COLOURS.primary,
    alignSelf: "center",
    marginTop: 20,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#EDEDED",
    marginTop: 20,
    borderRadius: 10,
  },
  submitText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  errorText: {
    fontSize: 16,
    lineHeight: 21,
    color: "red",
    letterSpacing: 0.25,
    alignSelf: "center",
    marginRight: 20,
    marginTop: 20,
    flexWrap: "wrap",
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#EDEDED",
  },
  linkText: {
    fontSize: 16,
    lineHeight: 21,
    color: "#3d85c6",
    letterSpacing: 0.25,
    alignSelf: "center",
    marginRight: 20,
    marginTop: 20,
  },
  primaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: "black",
    letterSpacing: 0.25,
  },
  secondaryText: {
    fontSize: 12,
    color: "black",
  },
});
