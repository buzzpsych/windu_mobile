import React, { useEffect } from "react";
import { StyleSheet, Image, Text, ActivityIndicator } from "react-native";
import "react-native-gesture-handler";
import { useSubscription } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "./src/recoil/atoms/user";
import { userMessages, userSelectedState } from "./src/recoil/atoms/message";
import OnBoard from "./src/screens/Onboard";
import ActivityActions from "./src/screens/ActivityActions";
import Messages from "./src/screens/Messages";
import HomeOnboard from "./src/components/HomeOnboard";
import ActiveTimers from "./src/screens/ActiveTimers";
import ActivityAction from "./src/components/ActivityAction";
import CurrentTimer from "./src/components/CurrentTimer";
import { navigationRef } from "./src/common/rootNavigation";
import User from "./src/screens/User";
import { readData } from "./src/store/utils";
import { TimerProvider } from "./src/contexts/timer-context";
import { NEW_MESSAGE } from "./src/graphql/subscriptions/newMessage";

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

const App = () => {
  const [newUser, setNewUser] = React.useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [navState, setNavState] = React.useState(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [messages, setMessages] = useRecoilState(userMessages);
  const userSelected = useRecoilValue(userSelectedState);
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE); // for future we can make this a context message provider

  useEffect(() => {
    (async () => {
      const user = await readData("@user");
      setUser(JSON.parse(user));
      setLoadingUser(false);
    })();
  }, []);

  const addNewMessage = () => {
    const { newMessage } = messageData;
    const otherUser =
      user.email === newMessage.to ? newMessage.from : newMessage.to;

    const messagesCopy = [...messages];
    const userIndex = messages.findIndex((u) => u.email === otherUser);

    const isUserSelected = newMessage.from === userSelected.email;

    /*     if (isHidden) audio.play();
    if (isUserSelected) {
      markRead({
        variables: { from: userSelected.email, messageId: newMessage._id },
      }); // updating messages status in server if user is selected
    } else {
      increaseCounter();
    } */

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

  useEffect(() => {
    if (messageError) console.warn(messageError);
    if (messageData) addNewMessage();
  }, [messageError, messageData]);

  if (loadingUser) return <ActivityIndicator size="large" color="#F5A623" />;

  if (newUser)
    return (
      <SafeAreaProvider>
        <HomeOnboard handleOnClosePress={() => setNewUser(false)} />
      </SafeAreaProvider>
    );

  if (user) {
    return (
      <SafeAreaProvider>
        <TimerProvider initialTime={"00:00:00"} throttling={1000}>
          <ActivityAction />
          <CurrentTimer currentRoute={navState} />
          <NavigationContainer
            onStateChange={() => {
              setNavState(navigationRef.current.getCurrentRoute().name);
            }}
            ref={navigationRef}
            onReady={() =>
              setNavState(navigationRef.current.getCurrentRoute().name)
            }
          >
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
          </NavigationContainer>
        </TimerProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen
            name="OnBoard"
            component={OnBoard}
            options={{
              title: "OnBoard",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
