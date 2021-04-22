import React, { useState } from "react";
import { Input } from "react-native-elements";
import { View, Text } from "react-native";
import Button from "../../components/Button";
import { styles } from "../../common/styles";
import { Picker } from "@react-native-picker/picker";

const Form = () => {
  const [fieldData, setFieldData] = useState({
    title: "",
    description: "",
    project: "",
  });
  const handleSubmit = () => {
    console.log(fieldData);
  };
  const handleChange = (field, value) => {
    setFieldData({ ...fieldData, [field]: value });
  };
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Input
        containerStyle={{ width: "80%" }}
        inputContainerStyle={{ borderBottomColor: "#F5A623" }}
        placeholderTextColor="black"
        labelStyle={{ color: "black" }}
        label="Activity Title"
        placeholder="Title"
        onChangeText={(v) => handleChange("title", v)}
      />
      <Input
        containerStyle={{ width: "80%" }}
        placeholderTextColor="black"
        inputContainerStyle={{ borderBottomColor: "#F5A623" }}
        labelStyle={{ color: "black" }}
        label="Activity Description"
        placeholder="Description"
        onChangeText={(v) => handleChange("description", v)}
      />

      <Picker
        selectedValue={fieldData.project}
        style={{ height: 50, width: 150, marginBottom: 50 }}
        onValueChange={(itemValue, itemIndex) =>
          handleChange("project", itemValue)
        }
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
      <Button onPress={handleSubmit} styles={styles.button}>
        <Text>Submit</Text>
      </Button>
    </View>
  );
};
export default Form;
