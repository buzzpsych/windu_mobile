import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import React from "react";

import OnBoard from "./src/screens/Onboard";
import Home from "./src/screens/Home";
import Messages from "./src/screens/Messages";

export default function App() {
  const [user, setUser] = React.useState(false);
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  if (user)
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Onboard">
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Messages" component={Messages} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen
            name="OnBoard"
            component={OnBoard}
            options={{ title: "OnBoard" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
