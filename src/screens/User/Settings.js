import React from "react";
import { Text, View } from "react-native";
import { useMutation } from "@apollo/client";
import Button from "../../components/Button";
import { clearStorage } from "../../store/utils";
import { styles } from "../../common/styles";
import { useRecoilState } from "recoil";
import { LOGOUT } from "../../graphql/mutations/user/logout";
import { userState } from "../../recoil/atoms/user";

const Settings = () => {
  const [_, setUser] = useRecoilState(userState);

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      clearStorage().then(() => {
        setUser(null);
      });
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Button
        onPress={() => logout()}
        styles={[styles.button, { marginBottom: 50 }]}
      >
        <Text>Logout</Text>
      </Button>
    </View>
  );
};

export default Settings;
