import React from "react";
import { Button } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import { useMutation } from "@apollo/client";
import { clearStorage } from "../../store/utils";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { LOGOUT } from "../../graphql/mutations/user/logout";
import { userState } from "../../recoil/atoms/user";
import { userMessages } from "../../recoil/atoms/message";
import Settings from "./Settings";

const Stack = createStackNavigator();

const User = () => {
  const setUser = useSetRecoilState(userState);
  const resetMessages = useResetRecoilState(userMessages);

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      clearStorage().then(() => {
        resetMessages();
        setUser(null);
      });
    },
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerRight: () => (
            <Button
              title="Logout"
              type="clear"
              onPress={() => logout()}
              titleStyle={{
                marginRight: 10,
                fontWeight: "700",
                fontSize: 20,
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
export default User;
