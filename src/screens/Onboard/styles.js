import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f0f2f5",
  },
  logoContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: { flex: 3, justifyContent: "center" },
  button: {
    marginTop: 20,
    width: "50%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#F5A623",
    color: "white",
  },
  img: {
    height: "100%",
    width: "100%",
  },
  logo: {
    height: 50,
    width: 50,
  },
  loginText: {
    color: "white",
    fontWeight: "700",
  },
});
