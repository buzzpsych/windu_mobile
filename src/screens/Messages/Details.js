import React from "react";
import { View, FlatList, Dimensions, TextInput } from "react-native";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Icon, Button } from "react-native-elements";
import _ from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { userSelectedState, userMessages } from "../../recoil/atoms/message";
import { userState } from "../../recoil/atoms/user";
import { GET_MESSAGES } from "../../graphql/queries/messages/getMessages";
import { MARK_AS_READ } from "../../graphql/mutations/messages/markAsReadMessages";
import UserMessage from "../Messages/UserMessage";

const limit = 50;
const page = 0;

const MessageDetails = () => {
  const [newMessage, setNewMessage] = React.useState("");
  const userSelected = useRecoilValue(userSelectedState);
  const userSession = useRecoilValue(userState);
  const [messages, setMessages] = useRecoilState(userMessages);

  const [markRead] = useMutation(MARK_AS_READ);

  const [getMessages, { data, loading }] = useLazyQuery(GET_MESSAGES, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getMessages }) => {
      let messagesCopy = _.cloneDeep(messages);
      const index = _.findIndex(
        messagesCopy,
        (message) => message.email === userSelected.email
      );

      if (index >= 0) {
        const gatherMessages = _.unionBy(
          messagesCopy[index].messages,
          getMessages,
          "_id"
        );
        const messagesMarked = markAsRead(gatherMessages);
        messagesCopy[index] = {
          ...messagesCopy[index],
          messages: messagesMarked,
        };
      } else {
        const messagesMarked = markAsRead(getMessages);
        messagesCopy = [
          ...messagesCopy,
          {
            email: userSelected.email,
            messages: messagesMarked,
            limit,
            page,
          },
        ];
      }

      setMessages(messagesCopy);
    },
  });

  const markAsRead = (messages) => {
    const messagesCopy = _.cloneDeep(messages);
    const messagesUpdated = _.map(messagesCopy, (message) => {
      if (message.unread) message.unread = false;

      return message;
    });

    markRead({ variables: { from: userSelected.email } }); // updating messages status in server

    return messagesUpdated;
  };

  const getUserMessages = () => {
    const userMessages = _.find(
      messages,
      (message) => message.email === userSelected.email
    );

    if (!userMessages) {
      getMessages({
        variables: {
          from: userSelected.email,
          limit,
          page: userMessages?.page || 0,
        },
      });
      return;
    }

    const hasUnreadMessages = _.filter(
      userMessages.messages,
      (message) => message.unread === true && message.to === user.email
    );

    if (userMessages && _.size(hasUnreadMessages) > 0) {
      markRead({
        variables: { from: userSelected.email },
      }); // updating messages status in server if user is selected
    }
  };

  React.useEffect(() => {
    if (!_.isEmpty(userSelected)) getUserMessages();
  }, [userSelected]);

  const keyExtractor = (item) => item._id;

  const getMessagesUserSelected = _.find(
    messages,
    (message) => message.email === userSelected.email
  );

  const renderItem = ({ item, index }) => {
    const sent = item.from === userSession.email;
    const userInfo =
      item.from === userSession.email ? userSession : userSelected;
    const withAvatar =
      item.from !== getMessagesUserSelected?.messages[index + 1]?.from;

    return (
      <UserMessage
        message={item}
        userInfo={userInfo}
        sent={sent}
        withAvatar={withAvatar}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: Dimensions.get("window").height - 180,
        }}
      >
        <FlatList
          inverted
          data={getMessagesUserSelected?.messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialScrollIndex={messages.length - 1}
          initialNumToRender={50}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 2.5 }}>
          <TextInput
            placeholder="Send a message"
            onChangeText={(value) => setNewMessage(value)}
            value={newMessage}
            style={{
              height: 40,
              marginHorizontal: 10,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              borderColor: "gray",
              backgroundColor: "white",
              paddingHorizontal: 10,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          />
        </View>
        <View style={{ flex: 0.5 }}>
          <Button
            buttonStyle={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F5A623",
              marginRight: 10,
              height: 40,
            }}
            icon={
              <Icon name="send" type="font-awesome" size={20} color="white" />
            }
          />
        </View>
      </View>
    </View>
  );
};
export default MessageDetails;
