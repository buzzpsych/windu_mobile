import React from "react";
import { Text, View } from "react-native";
import Button from "../../components/Button";
import { clearStorage } from "../../store/utils";
import { styles } from "../../common/styles";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/user";

const Settings = () => {
  const [user, setUser] = useRecoilState(userState);

  const handleLogout = () => {
    clearStorage().then(() => {
      setUser(null);
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Button
        onPress={handleLogout}
        styles={[styles.button, { marginBottom: 50 }]}
      >
        <Text>Logout</Text>
      </Button>
    </View>
  );
};

export default Settings;
