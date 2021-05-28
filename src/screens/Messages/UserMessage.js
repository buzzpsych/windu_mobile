import React from "react";
import { Avatar } from "react-native-elements";
import { View, Text } from "react-native";
import moment from "moment";
import styles from "./styles";

export const TIME_FORMAT = "MM/DD/YY HH:mm";

const UserMessage = ({ message, userInfo, sent }) => {
  const avatarSrc =
    userInfo.avatar ||
    `https://ui-avatars.com/api/?name=${userInfo?.full_name}`;

  return (
    <View
      style={[
        styles.container,
        { justifyContent: sent ? "flex-end" : "flex-start" },
      ]}
    >
      {!sent && (
        <View style={styles.memberPicture}>
          <Avatar
            rounded
            source={{
              uri: avatarSrc,
            }}
          />
        </View>
      )}
      <View style={styles.bubbleSize}>
        <View
          style={[
            styles.bubble,
            { backgroundColor: sent ? "#e2e8f0" : "#4e35c2" },
          ]}
        >
          <View style={{ flexShrink: 1 }}>
            <Text
              style={[styles.messageText, { color: sent ? "black" : "white" }]}
            >
              {message.content}
            </Text>
          </View>

          <View style={styles.bubbleTime}>
            <Text style={[styles.bubbleTimeText, { color: "#9D9FA3" }]}>
              {moment(message.created_at).format(TIME_FORMAT)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserMessage;
