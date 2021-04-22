import React, { useState } from "react";
import { View, FlatList, Dimensions, Text, ScrollView } from "react-native";
import { Input } from "react-native-elements";

import UserMessage from "../Messages/UserMessage";
import Button from "../../components/Button";

const MessageDetails = () => {
  const [message, setMessage] = useState("");
  const signedInUser = "evan@fishyvisions.com";
  const messages = [
    {
      _id: "6075b4821223123193ea022",
      content: "what do you mean?",
      created_at: "2021-04-13T16:05:11.284Z",
      from: "tyler@fishyvisions.com",
      to: "evan@fishyvisions.com",
      unread: false,
    },
    {
      _id: "6075b48219b0b56d193ea022",
      content: "Tyler please use windu, you havent used it for wireframing !",
      created_at: "2021-04-13T15:10:58.561Z",
      from: "evan@fishyvisions.com",
      to: "tyler@fishyvisions.com",
      unread: false,
    },
    {
      content: "soon there will be a large list of active orkers",
      created_at: "2021-04-02T23:49:27.865Z",
      from: "evan@fishyvisions.com",
      to: "tyler@fishyvisions.com",
      unread: false,
      _id: "6067ad8786ed4712e3230e5d",
    },
    {
      content: "soon there will be a large list of active orkers",
      created_at: "2021-04-02T23:49:27.865Z",
      from: "evan@fishyvisions.com",
      to: "tyler@fishyvisions.com",
      unread: false,
      _id: "6067ad8786ed4712e3230e5d",
    },
    {
      content: "soon there will be a large list of active orkers",
      created_at: "2021-04-02T23:49:27.865Z",
      from: "evan@fishyvisions.com",
      to: "tyler@fishyvisions.com",
      unread: false,
      _id: "6067ad8786ed4712e3230e5d",
    },
    {
      content: "soon there will be a large list of active orkers",
      created_at: "2021-04-02T23:49:27.865Z",
      from: "evan@fishyvisions.com",
      to: "tyler@fishyvisions.com",
      unread: false,
      _id: "6067ad8786ed4712e3230e5d",
    },
    {
      content: "soon there will be a large list of active orkers",
      created_at: "2021-04-02T23:49:27.865Z",
      from: "evan@fishyvisions.com",
      to: "tyler@fishyvisions.com",
      unread: false,
      _id: "6067ad8786ed4712e3230e5d",
    },
    {
      content: "soon there will be a large list of active orkers",
      created_at: "2021-04-02T23:49:27.865Z",
      from: "evan@fishyvisions.com",
      to: "tyler@fishyvisions.com",
      unread: false,
      _id: "6067ad8786ed4712e3230e5d",
    },
    {
      _id: "6075b4821223123193ea022",
      content: "LAST",
      created_at: "2021-04-13T16:05:11.284Z",
      from: "tyler@fishyvisions.com",
      to: "evan@fishyvisions.com",
      unread: false,
    },
  ];

  const renderItem = ({ item }) => {
    const myMessage = signedInUser === item.from;

    return (
      <UserMessage
        align={myMessage ? "right" : "left"}
        content={item.content}
      />
    );
  };
  const keyExtractor = (item, index) => item.id;

  return (
    <>
      <View
        style={{
          paddingTop: 50,
          height: Dimensions.get("window").height - 200,
        }}
      >
        <FlatList
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialScrollIndex={messages.length - 1}
        />
      </View>
      <View style={{ padding: 10, flexDirection: "row" }}>
        <Input
          containerStyle={{ width: "80%" }}
          placeholder="Send a message"
          onChangeText={(value) => setMessage(value)}
          value={message}
          inputContainerStyle={{
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            borderColor: "gray",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        />
        <Button
          styles={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F5A623",
            marginLeft: "auto",
            marginRight: "auto",
            height: 40,
            padding: 10,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <Text>Send</Text>
        </Button>
      </View>
    </>
  );
};
export default MessageDetails;
