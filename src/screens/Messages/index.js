import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MessagesList from "./List";
import MessageDetails from "./Details";
const Stack = createStackNavigator();

const Messages = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={MessagesList} />
      <Stack.Screen name="Details" component={MessageDetails} />
    </Stack.Navigator>
  );
};

export default Messages;
