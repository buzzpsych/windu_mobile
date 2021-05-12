import React from "react";
import { Card, Input, Button } from "react-native-elements";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./styles";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const Login = ({ onsubmit, loading }) => {
  return (
    <Formik
      initialValues={{
        email: "windu.testing@gmail.com",
        password: "Vic21121105*",
      }}
      onSubmit={onsubmit}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleSubmit, errors }) => (
        <Card styles={styles.card}>
          <Input
            name="email"
            containerStyle={{}}
            disabledInputStyle={{ background: "#D8DDE6" }}
            errorMessage={errors.email}
            placeholder="Email"
            onChangeText={handleChange("email")}
          />
          <Input
            name="password"
            secureTextEntry={true}
            disabledInputStyle={{ background: "#D8DDE6" }}
            errorMessage={errors.password}
            placeholder="password"
            onChangeText={handleChange("password")}
          />
          <Button
            buttonStyle={styles.button}
            onPress={handleSubmit}
            loading={loading}
            title="Login"
          />
        </Card>
      )}
    </Formik>
  );
};

export default Login;
