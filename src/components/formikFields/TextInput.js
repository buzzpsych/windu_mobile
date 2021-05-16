import React from "react";
import _ from "lodash";
import { Input } from "react-native-elements";

const TextInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue },
  ...props
}) => {
  let errorProps = {};
  const hasError = errors[field.name] && touched[field.name];
  if (hasError) errorProps.errorMessage = errors[field.name];

  return (
    <Input
      {..._.omit(field, ["onChange", "onBlur"])}
      {...props}
      {...errorProps}
      onChangeText={(value) => setFieldValue(field.name, value)}
    />
  );
};

export default TextInput;
