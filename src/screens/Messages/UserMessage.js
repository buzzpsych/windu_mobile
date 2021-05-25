import React from "react";
import { Avatar } from "react-native-elements";
import { View, Text, Dimensions } from "react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  message: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

const UserMessage = ({ message, userInfo, sent, withAvatar }) => {
  const avatarSrc =
    userInfo.avatar ||
    `https://ui-avatars.com/api/?name=${userInfo?.full_name}`;

  return (
    <View style={styles.message}>
      {withAvatar && !sent && (
        <Avatar
          rounded
          source={{
            uri: avatarSrc,
          }}
        />
      )}
      <View
        style={[
          {
            borderTopLeftRadius: sent ? 10 : 0,
            borderTopRightRadius: !sent ? 10 : 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            padding: 10,
            justifyContent: "center",
            marginLeft: !sent && !withAvatar ? 40 : 0,
            width: Dimensions.get("window").width - 60,
            backgroundColor: sent ? "#e2e8f0" : "#4e35c2",
          },
        ]}
      >
        <Text style={{ color: sent ? "black" : "white" }}>
          {message.content}
        </Text>
      </View>
      {withAvatar && sent && (
        <Avatar
          rounded
          source={{
            uri: avatarSrc,
          }}
        />
      )}
    </View>
  );
};

export default UserMessage;
