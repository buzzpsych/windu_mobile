import React from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  PanResponder,
  KeyboardAvoidingView,
} from "react-native";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { Icon } from "react-native-elements";
import _ from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { userSelectedState, userMessages } from "../../recoil/atoms/message";
import { userState, usersList } from "../../recoil/atoms/user";
import { SEND_MESSAGE } from "../../graphql/mutations/messages/sendMessage";
import { READ_MESSAGE } from "../../graphql/subscriptions/readMessage";
import { GET_MESSAGES } from "../../graphql/queries/messages/getMessages";
import { MARK_AS_READ } from "../../graphql/mutations/messages/markAsReadMessages";
import UserMessage from "../Messages/UserMessage";
import styles from "./styles";

const limit = 50;
const page = 0;

const MessageDetails = () => {
  const [listEnd, setListEnd] = React.useState(false);
  const [users, setUsers] = useRecoilState(usersList);
  const [newMessage, setNewMessage] = React.useState("");
  const userSelected = useRecoilValue(userSelectedState);
  const userSession = useRecoilValue(userState);
  const [messages, setMessages] = useRecoilState(userMessages);

  const { data: messageRead, error: messageReadError } =
    useSubscription(READ_MESSAGE);

  const [markRead] = useMutation(MARK_AS_READ);
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const [getMessages, { loading, refetch }] = useLazyQuery(GET_MESSAGES, {
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getMessages }) => {
      if (_.size(getMessages) <= 0) {
        setListEnd(true);
        return;
      }
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

  const onSend = () => {
    if (newMessage.trim() === "") return;

    sendMessage({
      variables: { to: userSelected.email, content: newMessage },
    });
    setNewMessage("");
  };

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
      (message) => message.unread === true && message.to === userSession.email
    );

    if (userMessages && _.size(hasUnreadMessages) > 0) {
      markRead({
        variables: { from: userSelected.email },
      }); // updating messages status in server if user is selected
    }
  };

  const loadMore = () => {
    if (listEnd) return;
    let messagesCopy = _.cloneDeep(messages);
    const index = _.findIndex(
      messagesCopy,
      (message) => message.email === userSelected.email
    );

    if (index >= 0) {
      messagesCopy[index] = {
        ...messagesCopy[index],
        page: messagesCopy[index].page + 1,
      };

      if (!loading) {
        getMessages({
          variables: {
            from: userSelected.email,
            limit: messagesCopy[index].limit,
            page: messagesCopy[index].page,
          },
        });
        setMessages(messagesCopy);
      }
    }
  };

  const updateListCounter = () => {
    // updating counter in member/client list
    const { markReadMessages } = messageRead;

    const userIndex = _.findIndex(
      users,
      (user) => user.email === markReadMessages.from
    );

    if (userIndex >= 0) {
      const usersCopy = _.cloneDeep(users);
      const currentUnreadMessages = usersCopy[userIndex].unreadMessages;
      usersCopy[userIndex].unreadMessages =
        currentUnreadMessages === 0
          ? currentUnreadMessages
          : currentUnreadMessages - markReadMessages.messagesUpdated;

      setUsers(usersCopy);
    }
  };

  React.useEffect(() => {
    if (!_.isEmpty(userSelected)) getUserMessages();
  }, [userSelected]);

  React.useEffect(() => {
    if (messageReadError) alert(messageReadError);
    if (messageRead) updateListCounter();
  }, [messageReadError, messageRead]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
      }),
    []
  );

  const keyExtractor = (item) => item._id;

  const getUserSelectedMessages = () => {
    const getMessagesUserSelected = _.find(
      messages,
      (message) => message.email === userSelected.email
    );

    if (getMessagesUserSelected) return getMessagesUserSelected.messages;

    return [];
  };

  const renderItem = ({ item }) => {
    const sent = item.from === userSession.email;
    const userInfo =
      item.from === userSession.email ? userSession : userSelected;

    return <UserMessage message={item} userInfo={userInfo} sent={sent} />;
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <FlatList
        inverted={true}
        data={getUserSelectedMessages() || []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.7}
        refreshing={loading}
        onRefresh={() => refetch()}
        {...panResponder.panHandlers}
      />
      <View style={styles.accessoryContainer}>
        <TextInput
          multiline
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
          placeholder={"Message"}
          placeholderTextColor={"#9D9FA3"}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => onSend()}
          style={[styles.buttonSend, { opacity: newMessage ? 1 : 0.5 }]}
          disabled={!newMessage}
        >
          <Icon name="send" type="font-awesome" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageDetails;
