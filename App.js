import React from "react";
import { StyleSheet, Image, Text, View, Pressable } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";

import OnBoard from "./src/screens/Onboard";
import Home from "./src/screens/Home";
import Messages from "./src/screens/Messages";
import HomeOnboard from "./src/components/HomeOnboard";
import ActiveTimers from "./src/screens/ActiveTimers";
import ActivityAction from "./src/components/ActivityAction";
import { navigationRef } from "./src/common/rootNavigation";
import User from "./src/screens/User";

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

const App = ({}) => {
  const [newUser, setNewUser] = React.useState(false);
  const [user, setUser] = React.useState(true);
  const [navState, setNavState] = React.useState({});
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  if (newUser)
    return (
      <SafeAreaProvider>
        <HomeOnboard handleOnClosePress={() => setNewUser(false)} />
      </SafeAreaProvider>
    );
  if (user)
    return (
      <RecoilRoot>
        <SafeAreaProvider>
          <NavigationContainer
            onStateChange={(state) => setNavState(state)}
            ref={navigationRef}
          >
            <ActivityAction navState={navState} />
            <Tab.Navigator
              adaptive={true}
              tabBarOptions={{
                style: styles.tabBar,
                activeTintColor: "#F5A623",
                showLabel: false,
              }}
              initialRouteName="Home"
              labeled={false}
            >
              <Tab.Screen
                options={{
                  tabBarLabel: "Activity",
                  tabBarIcon: ({ focused, color, size }) => {
                    const isActive = focused;
                    return (
                      <TabIcon
                        isActive={isActive}
                        src="https://windu.s3.us-east-2.amazonaws.com/assets/mobile/play_nav.png"
                      />
                    );
                  },
                }}
                name="Activity"
                component={Home}
              />
              <Tab.Screen
                options={{
                  tabBarLabel: "Timers",
                  tabBarIcon: ({ focused, color, size }) => {
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
                  tabBarIcon: ({ focused, color, size }) => {
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
                  tabBarIcon: ({ focused, color, size }) => {
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
        </SafeAreaProvider>
      </RecoilRoot>
    );

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
