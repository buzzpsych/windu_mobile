import * as React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

export default function LoginScreen({ navigation }) {
  const onLogin = () => {
    navigation.navigate("Home");
  };

  const onRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>Login Page</Text>
        <Text style={styles.getStartedText}>login page for windu</Text>
        <Button
          onPress={onLogin}
          title="Login"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={onRegister}
          title="Register"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </View>
  );
}

LoginScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
});
