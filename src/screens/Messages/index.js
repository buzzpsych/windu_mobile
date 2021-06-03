import React from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import { useRecoilValue } from "recoil";
import MessagesList from "./List";
import MessageDetails from "./Details";
import { userSelectedState } from "../../recoil/atoms/message";
const Stack = createStackNavigator();

const Messages = () => {
  const userSelected = useRecoilValue(userSelectedState);
  const avatarSrc =
    userSelected.avatar ||
    `https://ui-avatars.com/api/?name=${userSelected?.full_name}`;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={MessagesList} />
      <Stack.Screen
        name="Details"
        component={MessageDetails}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: -10,
              }}
            >
              <Avatar
                rounded
                source={{
                  uri: avatarSrc,
                }}
              />
              <Text style={{ fontSize: 18, marginLeft: 10 }}>
                {userSelected.full_name}
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default Messages;
