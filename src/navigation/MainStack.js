import React from "react";
import { StyleSheet, Image, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRecoilValue, useRecoilState } from "recoil";
import { useSubscription, useMutation, useApolloClient } from "@apollo/client";
import { registerPushNotifications } from "../common/registerPushNotification";
import ActivityActions from "../screens/ActivityActions";
import Messages from "../screens/Messages";
import ActiveTimers from "../screens/ActiveTimers";
import User from "../screens/User";
import { NEW_MESSAGE } from "../graphql/subscriptions/newMessage";
import { MARK_AS_READ } from "../graphql/mutations/messages/markAsReadMessages";
import { userState } from "../recoil/atoms/user";
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
  const userSelected = useRecoilValue(userSelectedState);
  const [messages, setMessages] = useRecoilState(userMessages);

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE); // for future we can make this a context message provider

  const [markRead] = useMutation(MARK_AS_READ);

  const addNewMessage = () => {
    const { newMessage } = messageData;
    const otherUser =
      user.email === newMessage.to ? newMessage.from : newMessage.to;

    const messagesCopy = [...messages];
    const userIndex = messages.findIndex((u) => u.email === otherUser);

    const isUserSelected = newMessage.from === userSelected.email;

    if (isUserSelected) {
      markRead({
        variables: { from: userSelected.email, messageId: newMessage._id },
      }); // updating messages status in server if user is selected
    }

    if (userIndex >= 0) {
      let newUser = {
        ...messagesCopy[userIndex],
        messages: messagesCopy[userIndex]?.messages
          ? [newMessage, ...messagesCopy[userIndex].messages]
          : null,
      };

      messagesCopy[userIndex] = newUser;

      setMessages(messagesCopy);
    }
  };

  React.useEffect(() => {
    if (messageError) console.warn(messageError);
    if (messageData) addNewMessage();
  }, [messageError, messageData]);

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
            return (
              <TabIcon
                isActive={isActive}
                src="https://windu.s3.us-east-2.amazonaws.com/assets/mobile/timers_nav.png"
              />
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
              <TabIcon
                isActive={isActive}
                src="https://windu.s3.us-east-2.amazonaws.com/assets/mobile/messages_nav.png"
              />
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
