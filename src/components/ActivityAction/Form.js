import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Input, Button as ButtonElements } from "react-native-elements";
import { useQuery } from "@apollo/client";
import { map, uniqBy } from "lodash";
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

const Form = ({ onSubmit }) => {
  const [fieldData, setFieldData] = useState({
    title: "",
    description: "",
    project: "",
  });
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

  const handleSubmit = () => {
    onSubmit(fieldData);
  };
  const handleChange = (field, value) => {
    setFieldData({ ...fieldData, [field]: value });
  };
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Input
        inputContainerStyle={{ borderBottomColor: "#F5A623" }}
        label="Activity Title"
        placeholder="Title"
        onChangeText={(v) => handleChange("title", v)}
      />
      <Input
        inputContainerStyle={{ borderBottomColor: "#F5A623" }}
        label="Activity Description"
        placeholder="Description"
        onChangeText={(v) => handleChange("description", v)}
      />

      {loadingProjects ? (
        <ActivityIndicator size="large" color="#F5A623" />
      ) : (
        <Picker
          selectedValue={fieldData.project}
          style={{
            height: 50,
            width: 150,
            marginBottom: 50,
            alignSelf: "center",
          }}
          onValueChange={(itemValue) => handleChange("project", itemValue)}
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

      <ButtonElements
        buttonStyle={styles.button}
        onPress={handleSubmit}
        title="Start"
      />
    </View>
  );
};
export default Form;
