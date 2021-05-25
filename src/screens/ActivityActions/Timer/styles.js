import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  activityTitle: { marginTop: 20, color: "white" },
  playBtn: {
    backgroundColor: "#62C376",
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderWidth: 10,
    borderColor: "#F0F2F5",
    marginTop: -50,
  },
  pauseBtn: {
    backgroundColor: "#F5A623",
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderWidth: 10,
    borderColor: "#F0F2F5",
    marginTop: -50,
  },
  stopBtn: {
    backgroundColor: "#F31A2D",
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderWidth: 10,
    borderColor: "#F0F2F5",
    marginTop: -50,
  },
  actionImg: {
    height: 20,
    width: 20,
  },
  recentContainer: {
    flex: 1.5,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});