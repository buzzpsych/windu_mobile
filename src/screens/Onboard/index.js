import React, { useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { BottomSheet } from "react-native-elements";
import Button from "../../components/Button";
import Login from "../../components/Login";
const OnBoard = ({ navigation, route }) => {
  const [isVisible, setIsVisible] = useState(false);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      marginTop: 10,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5A623",
      width: "80%",
      margin: "auto",
      height: 40,
    },
  });

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            alignItems: "center",
            height: 100,
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Image
            style={{ height: 50, width: 50 }}
            source={{
              uri:
                "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/logo.png",
            }}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            backgroundColor: "#f0f2f5",
            height: 400,
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            color: "white",
          }}
        >
          <Image
            style={{ height: "100%", width: "100%" }}
            source={{
              uri:
                "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/mobile_1.png",
            }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.container}>
          <Button
            styles={styles.button}
            color="red"
            onPress={() => setIsVisible(true)}
          >
            <Text>Login</Text>
          </Button>
          <Text style={{ marginTop: 10 }}> register at www.windu.io</Text>
        </View>
      </View>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        <Login onsubmit={(v) => setIsVisible(false)} />
      </BottomSheet>
    </>
  );
};

export default OnBoard;
