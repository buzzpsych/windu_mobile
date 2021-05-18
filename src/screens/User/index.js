import React from "react";
import { Button } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import { useMutation } from "@apollo/client";
import { clearStorage } from "../../store/utils";
import { useRecoilState } from "recoil";
import { LOGOUT } from "../../graphql/mutations/user/logout";
import { userState } from "../../recoil/atoms/user";
import Settings from "./Settings";

const Stack = createStackNavigator();

const User = () => {
  const [_, setUser] = useRecoilState(userState);

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      clearStorage().then(() => {
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
