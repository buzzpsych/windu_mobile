import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";
import { Formik, Field } from "formik";
import TextInput from "../formikFields/TextInput";
import * as Yup from "yup";
import styles from "./styles";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("This field is required")
    .email("This is not a valid email"),
  password: Yup.string().required("This field is required"),
});

const Login = ({ onsubmit, loading }) => {
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={onsubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
        <View style={styles.container}>
          <Text h4 style={{ alignSelf: "center", marginVertical: 20 }}>
            Login
          </Text>
          <Field
            component={TextInput}
            placeholder="Enter your email"
            name="email"
          />
          <Field
            component={TextInput}
            placeholder="Enter your password"
            name="password"
            secureTextEntry={true}
          />
          <Button
            buttonStyle={styles.button}
            onPress={handleSubmit}
            loading={loading}
            title="Login"
          />
        </View>
      )}
    </Formik>
  );
};

export default Login;
