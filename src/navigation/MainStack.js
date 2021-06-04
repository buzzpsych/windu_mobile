import React from "react";
import { StyleSheet, Image, Text, LogBox } from "react-native";
import { Badge } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRecoilValue, useRecoilState } from "recoil";
import _ from "lodash";
import { useSubscription, useMutation, useApolloClient } from "@apollo/client";
import { registerPushNotifications } from "../common/registerPushNotification";
import ActivityActions from "../screens/ActivityActions";
import Messages from "../screens/Messages";
import ActiveTimers from "../screens/ActiveTimers";
import User from "../screens/User";
import { NEW_MESSAGE } from "../graphql/subscriptions/newMessage";
import { READ_MESSAGE } from "../graphql/subscriptions/readMessage";
import { MARK_AS_READ } from "../graphql/mutations/messages/markAsReadMessages";
import { userState } from "../recoil/atoms/user";
import { activeTimersState } from "../recoil/atoms/activity";
import { userMessages, userSelectedState } from "../recoil/atoms/message";

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    zIndex: 9999999999,
  },
  active: {
    backgroundColor: "#4E35C2",
    width: 50,
    height: 2,
    position: "absolute",
    top: 0,
  },
});

const TabIcon = ({ isActive, src, node }) => {
  return (
    <>
      {isActive && <Text style={styles.active}></Text>}
      {src && (
        <Image
          style={{ height: 30, width: 30 }}
          source={{
            uri: src,
          }}
          resizeMode="contain"
        />
      )}
      {!src && node}
    </>
  );
};

export const MainStackScreens = () => {
  const [user, setUser] = useRecoilState(userState);
  const userSelected = useRecoilValue(userSelectedState);
  const activeTimers = useRecoilValue(activeTimersState);
  const [messages, setMessages] = useRecoilState(userMessages);

  LogBox.ignoreLogs(["Setting a timer"]);

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE); // for future we can make this a context message provider

  const { data: messageRead, error: messageReadError } =
    useSubscription(READ_MESSAGE);

  const [markRead] = useMutation(MARK_AS_READ);

  const decreaseCounter = () => {
    const { markReadMessages } = messageRead;

    if (user.unreadMessages > 0)
      setUser({
        ...user,
        unreadMessages: user.unreadMessages - markReadMessages.messagesUpdated,
      });
  };

  const increaseCounter = () => {
    const { newMessage } = messageData;
    if (
      (_.isEmpty(userSelected) && newMessage.from !== user.email) ||
      (userSelected.email !== newMessage.from && newMessage.from !== user.email)
    )
      setUser({ ...user, unreadMessages: user.unreadMessages + 1 });
  };

  const addNewMessage = () => {
    const { newMessage } = messageData;
    const otherUser =
      user.email === newMessage.to ? newMessage.from : newMessage.to;

    const messagesCopy = _.cloneDeep(messages);
    const userIndex = messages.findIndex((u) => u.email === otherUser);

    const isUserSelected = newMessage.from === userSelected.email;

    if (isUserSelected) {
      markRead({
        variables: { from: userSelected.email, messageId: newMessage._id },
      }); // updating messages status in server if user is selected
    }

    if (!isUserSelected) increaseCounter();

    if (userIndex >= 0) {
      let newUser = {
        ...messagesCopy[userIndex],
        messages: messagesCopy[userIndex]?.messages && [
          newMessage,
          ...messagesCopy[userIndex].messages,
        ],
      };

      messagesCopy[userIndex] = newUser;

      setMessages(messagesCopy);
    }
  };

  React.useEffect(() => {
    if (messageError) console.warn(messageError);
    if (messageData) addNewMessage();
  }, [messageError, messageData]);

  React.useEffect(() => {
    if (messageReadError) console.warn(messageReadError);
    if (messageRead) decreaseCounter();
  }, [messageReadError, messageRead]);

  return (
    <Tab.Navigator
      adaptive={true}
      tabBarOptions={{
        style: styles.tabBar,
        activeTintColor: "#F5A623",
        showLabel: false,
      }}
      initialRouteName="ActivityActions"
      labeled={false}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            const isActive = focused;

            return (
              <TabIcon
                isActive={isActive}
                src="https://windu.s3.us-east-2.amazonaws.com/assets/mobile/play_nav.png"
              />
            );
          },
        }}
        name="ActivityActions"
        component={ActivityActions}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "Timers",
          tabBarIcon: ({ focused }) => {
            const isActive = focused;
            const nroTimers = _.size(activeTimers);
            return (
              <>
                <TabIcon
                  isActive={isActive}
                  src="https://windu.s3.us-east-2.amazonaws.com/assets/mobile/timers_nav.png"
                />
                {nroTimers > 0 && (
                  <Badge
                    value={nroTimers}
                    containerStyle={{ position: "absolute", top: 0, right: 30 }}
                    badgeStyle={{ backgroundColor: "#F5A623" }}
                  />
                )}
              </>
            );
          },
        }}
        name="Timers"
        component={ActiveTimers}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ focused }) => {
            const isActive = focused;
            return (
              <>
                <TabIcon
                  isActive={isActive}
                  src="https://windu.s3.us-east-2.amazonaws.com/assets/mobile/messages_nav.png"
                />
                {user.unreadMessages > 0 && (
                  <Badge
                    value={user.unreadMessages}
                    containerStyle={{ position: "absolute", top: 0, right: 30 }}
                    badgeStyle={{ backgroundColor: "#F5A623" }}
                  />
                )}
              </>
            );
          },
        }}
        name="Messages"
        component={Messages}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "User",
          tabBarIcon: ({ focused }) => {
            const isActive = focused;
            return (
              <TabIcon
                isActive={isActive}
                src="https://windu.s3.us-east-2.amazonaws.com/assets/mobile/user_nav.png"
              />
            );
          },
        }}
        name="User"
        component={User}
      />
    </Tab.Navigator>
  );
};

export const WrapperMainStack = () => {
  const user = useRecoilValue(userState);
  const client = useApolloClient();

  React.useEffect(() => {
    registerPushNotifications(client, user._id);
  }, []);

  return <MainStackScreens />;
};
