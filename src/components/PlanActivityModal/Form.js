import React, { useState } from "react";
import { View, Text } from "react-native";
import { Input, Chip } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import Button from "../Button";
import DatePicker from "react-native-datepicker";

import { styles } from "../../common/styles";

const Form = () => {
  const [date, setDate] = React.useState(moment());
  const [openDatePicker, setOpenDatePicker] = React.useState(false);

  const [fieldData, setFieldData] = useState({
    title: "",
    description: "",
    project: "",
  });
  const handleChange = (field, value) => {
    setFieldData({ ...fieldData, [field]: value });
  };

  const handleSubmit = () => {
    console.log(fieldData);
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
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          marginBottom: 50,
        }}
      >
        <DatePicker
          style={{ width: 200 }}
          date={date}
          mode="date"
          placeholder="selected date"
          format="MM/DD/YY"
          minDate={moment()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              borderColor: "#F5A623",
            },
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => setDate(date)}
        />
      </View>

      <Button onPress={handleSubmit} styles={styles.button}>
        <Text>Submit</Text>
      </Button>
    </View>
  );
};
export default Form;
