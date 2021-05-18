import React from "react";
import { Text } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "./Settings";

const Stack = createStackNavigator();

const User = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerRight: () => (
            <Text style={{ marginRight: 20, fontWeight: "700", fontSize: 20 }}>
              Logout
            </Text>
          ),
        }}
      />
    </Stack.Navigator>
  );
};
export default User;
