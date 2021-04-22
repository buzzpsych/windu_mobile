import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Button from "../../components/Button";
import MessagesList from "./List";
import MessageDetails from "./Details";
const Stack = createStackNavigator();

const Messages = ({ navigation, route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={MessagesList} />
      <Stack.Screen name="Details" component={MessageDetails} />
    </Stack.Navigator>
  );
};

export default Messages;
