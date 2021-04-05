import React, { useState } from "react";
import { StyleSheet, View, Image, Modal } from "react-native";
import { BottomSheet, ListItem, Button } from "react-native-elements";

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
    },
  });
  const list = [
    { title: "List Item 1" },
    { title: "List Item 2" },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

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
            borderRadius: "1em",
            marginLeft: "auto",
            marginRight: "auto",
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
        <View style={styles.button}>
          <Button
            buttonStyle={{
              backgroundColor: "red",
              width: "80%",
            }}
            title="Login"
            onPress={() => setIsVisible(true)}
          />
        </View>
      </View>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        {list.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </>
  );
};

export default OnBoard;
