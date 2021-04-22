import React, { useState } from "react";
import { Overlay, ListItem } from "react-native-elements";
import { FlatList, View, Text } from "react-native";
import Button from "../../components/Button";

const OverlayMenu = ({ onClose, visible, options, onPress }) => {
  const listItems = options?.map((item) => {
    return (
      <Button onPress={() => onPress(item?.id)}>
        <Text>{item?.label}</Text>
      </Button>
    );
  });
  return (
    <Overlay isVisible={visible} onBackdropPress={onClose}>
      <View>{listItems}</View>
    </Overlay>
  );
};
export default OverlayMenu;
