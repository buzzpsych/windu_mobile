import React, { useRef, useEffect } from "react";
import { Modalize } from "react-native-modalize";
import { View, Dimensions } from "react-native";

import Form from "./Form";

const PlanActivityModal = ({ visible, onclose }) => {
  const modalizeRef = useRef();

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open("top");
    }
  }, [visible]);

  const handleClose = () => {
    onclose();
  };

  return (
    <Modalize
      modalStyle={{
        backgroundColor: "#62C376",
        height: "100%",
        elevation: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
      overlayStyle={{ backgroundColor: "#62C376" }}
      ref={modalizeRef}
      handlePosition="inside"
      withHandle={false}
      onClose={handleClose}
    >
      <View
        style={{
          height: Dimensions.get("window").height - 50,
        }}
      >
        <Form />
      </View>
    </Modalize>
  );
};
export default PlanActivityModal;
