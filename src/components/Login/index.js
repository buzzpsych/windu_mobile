import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Input, Text } from "react-native-elements";
import Button from "../Button";

const Login = ({ onsubmit }) => {
  const styles = StyleSheet.create({
    card: { flex: 1, justifyContent: "center", alignItems: "center" },
    button: {
      marginTop: 10,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5A623",
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      height: 40,
    },
  });
  const [fields, setFields] = useState({ email: "", password: "" });

  const handleInput = (v, field) => {
    setFields({ ...fields, [field]: v });
  };
  return (
    <Card styles={styles.card}>
      <Input
        containerStyle={{}}
        disabledInputStyle={{ background: "#D8DDE6" }}
        inputContainerStyle={{}}
        errorMessage="Oops! that's not correct."
        placeholder="Email"
        onChangeText={(v) => handleInput(v, "email")}
      />
      <Input
        secureTextEntry={true}
        disabledInputStyle={{ background: "#D8DDE6" }}
        inputContainerStyle={{}}
        errorMessage="Oops! that's not correct."
        placeholder="password"
        onChangeText={(v) => handleInput(v, "password")}
      />
      <View>
        <Button styles={styles.button} onPress={() => onsubmit(fields)}>
          <Text>Login</Text>
        </Button>
      </View>
    </Card>
  );
};

export default Login;
