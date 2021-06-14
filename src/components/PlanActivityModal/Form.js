import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button, Card } from "react-native-elements";
import { useQuery } from "@apollo/client";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Field } from "formik";
import moment from "moment";
import { map, uniqBy, isEmpty } from "lodash";
import TextInput from "../formikFields/TextInput";
import { GET_PROJECTS } from "../../graphql/queries/project/getProjects";
import { styles } from "../../common/styles";
import { Picker } from "@react-native-picker/picker";

const sizePerPage = 10;
const initialOffset = 0;
const initialSearch = "";

const defaultProjectFilters = {
  status: "",
  sort: `{"updated_at": -1}`,
  relationship: "",
};

const Form = ({ handleSubmit, setFieldValue, values, isSubmitting }) => {
  const [queryParameters, setQueryParameters] = useState({
    size: sizePerPage,
    offset: initialOffset,
    search: initialSearch,
    filters: defaultProjectFilters,
  });
  const [projects, setProjects] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const { loading: loadingProjects } = useQuery(GET_PROJECTS, {
    variables: { input: queryParameters },
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getProjects }) => {
      setProjects(
        uniqBy([...new Set([...projects, ...getProjects.data])], "_id")
      );
    },
  });

  const onChange = ({ type, nativeEvent }) => {
    if (!isEmpty(nativeEvent)) {
      setShowCalendar(false);
      setFieldValue("planned_date", nativeEvent.timestamp);
    }

    if (type === "dismissed") setShowCalendar(false);
  };

  return (
    <Card
      containerStyle={{
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 20,
      }}
    >
      <Field
        inputContainerStyle={{ borderBottomColor: "#F5A623" }}
        component={TextInput}
        placeholder="Title"
        label="Activity Title"
        name="title"
      />
      <Field
        inputContainerStyle={{ borderBottomColor: "#F5A623" }}
        component={TextInput}
        placeholder="Description"
        label="Activity Description"
        name="description"
      />
      {loadingProjects ? (
        <ActivityIndicator
          size="large"
          color="#F5A623"
          style={{ height: 50, marginBottom: 20 }}
        />
      ) : (
        <Picker
          selectedValue={values.project}
          style={{
            height: 50,
            width: 150,
            marginBottom: 20,
            alignSelf: "center",
          }}
          onValueChange={(itemValue) => setFieldValue("project", itemValue)}
        >
          {map(projects, (project) => (
            <Picker.Item
              key={project._id}
              label={project.title}
              value={project._id}
            />
          ))}
        </Picker>
      )}
      <Button
        title={moment(values.planned_date).format("MM/DD/YY")}
        type="outline"
        onPress={() => setShowCalendar(true)}
        buttonStyle={{
          marginBottom: 10,
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      {showCalendar && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(values.planned_date)}
          mode={"date"}
          display="default"
          onChange={(value) => onChange(value)}
          textColor={"red"}
        />
      )}
      <Button
        buttonStyle={styles.button}
        onPress={() => handleSubmit()}
        title="Create"
        loading={isSubmitting}
      />
    </Card>
  );
};
export default Form;
