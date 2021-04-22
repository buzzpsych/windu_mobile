import React from "react";
import { TouchableOpacity } from "react-native";

const Button = ({ children, styles, onPress }) => {
  return (
    <TouchableOpacity style={styles} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;
