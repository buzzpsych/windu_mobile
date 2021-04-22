import React from "react";
import { Avatar } from "react-native-elements";
import { View, Text, Dimensions } from "react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  message: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
    padding: 10,
  },
});

const UserMessage = ({ style, content, align }) => {
  if (align === "left") {
    return (
      <View style={styles.message}>
        <Avatar
          rounded
          source={{
            uri:
              "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
          }}
        />
        <View
          style={[
            style,
            {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              padding: 10,
              justifyContent: "center",
              width: Dimensions.get("window").width - 80,
              backgroundColor: "#4e35c2",
            },
          ]}
        >
          <Text style={{ color: "white" }}>{content}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.message}>
      <View
        style={[
          style,
          {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            padding: 10,
            justifyContent: "center",
            width: Dimensions.get("window").width - 80,
            backgroundColor: "#e2e8f0",
          },
        ]}
      >
        <Text style={{ color: "black" }}>{content}</Text>
      </View>
      <Avatar
        rounded
        source={{
          uri:
            "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
        }}
      />
    </View>
  );
};

export default UserMessage;
