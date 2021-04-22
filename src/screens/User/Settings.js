import React from "react";
import { Text, View } from "react-native";
import Button from "../../components/Button";

import { styles } from "../../common/styles";

const Settings = () => {
  const handleLogout = () => {
    // logout
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Button onPress={handleLogout} styles={styles.button}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
};

export default Settings;
