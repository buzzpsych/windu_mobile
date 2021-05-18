import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Input, Button, Card } from "react-native-elements";
import { useQuery } from "@apollo/client";
import { Field } from "formik";
import { map, uniqBy } from "lodash";
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

  const { loading: loadingProjects } = useQuery(GET_PROJECTS, {
    variables: { input: queryParameters },
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getProjects }) => {
      setProjects(
        uniqBy([...new Set([...projects, ...getProjects.data])], "_id")
      );
    },
  });

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
        buttonStyle={styles.button}
        onPress={() => handleSubmit()}
        title="Start"
        loading={isSubmitting}
      />
    </Card>
  );
};
export default Form;
