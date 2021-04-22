import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import List from "./List";

const Stack = createStackNavigator();

const ActiveTimers = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Active Timers" component={List} />
    </Stack.Navigator>
  );
};
export default ActiveTimers;
