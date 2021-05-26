import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoard from "../screens/Onboard";

const AuthStack = createStackNavigator();

export const AuthStackScreens = () => (
  <AuthStack.Navigator initialRouteName="Login">
    <AuthStack.Screen
      name="OnBoard"
      component={OnBoard}
      options={{
        title: "OnBoard",
      }}
    />
  </AuthStack.Navigator>
);
