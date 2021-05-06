import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Input, Text } from "react-native-elements";
import { Formik } from "formik";
import * as Yup from "yup";

import Button from "../Button";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

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

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={onsubmit}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleSubmit, errors }) => (
        <Card styles={styles.card}>
          <Input
            containerStyle={{}}
            disabledInputStyle={{ background: "#D8DDE6" }}
            errorMessage={errors.email}
            placeholder="Email"
            onChangeText={handleChange("email")}
          />
          <Input
            secureTextEntry={true}
            disabledInputStyle={{ background: "#D8DDE6" }}
            errorMessage={errors.password}
            placeholder="password"
            onChangeText={handleChange("password")}
          />
          <View>
            <Button styles={styles.button} onPress={handleSubmit}>
              <Text>Login</Text>
            </Button>
          </View>
        </Card>
      )}
    </Formik>
  );
};

export default Login;
