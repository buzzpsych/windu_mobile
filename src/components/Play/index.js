import React from "react";
import { StyleSheet, View, Image } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";

const styles = StyleSheet.create({
  search: {
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },

  header: {
    backgroundColor: "#f7f5eee8",
    shadowColor: "#000000",
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#318bfb",
    alignItems: "center",
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  photo: {
    width: "100%",
    height: 225,
    marginTop: 30,
  },
});

const Play = () => {
  const renderContent = () => (
    <View
      style={{
        backgroundColor: "#62C376",
        padding: 16,
        height: "100%",
      }}
    ></View>
  );

  const sheetRef = React.useRef(null);
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  return (
    <View
      style={{
        backgroundColor: "#62C376",
        height: "2%",
      }}
    >
      <BottomSheet
        ref={sheetRef}
        initialSnap={1}
        snapPoints={[500, 250, 20]}
        borderRadius={10}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />
    </View>
  );
};

export default Play;
