import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button, Card } from "react-native-elements";
import { useQuery } from "@apollo/client";
import CalendarStrip from "react-native-calendar-strip";
import { Field } from "formik";
import moment from "moment";
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

const Form = ({
  handleSubmit,
  setFieldValue,
  values,
  isSubmitting,
  isEditing,
}) => {
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

  const datesBlacklistFunc = (date) => {
    const today = moment(new Date()).format("MM/DD/YY");
    const calendarDate = moment(new Date(date)).format("MM/DD/YY");
    return moment(calendarDate).isBefore(today);
  };

  const onChange = (date) => {
    setFieldValue("planned_date", date);
    setShowCalendar(false);
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
        disabled={isEditing}
      />
      <Field
        inputContainerStyle={{ borderBottomColor: "#F5A623" }}
        component={TextInput}
        placeholder="Description"
        label="Activity Description"
        name="description"
        disabled={isEditing}
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
          enabled={!isEditing}
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
          borderColor: "#F5A623",
        }}
        titleStyle={{ color: "#F5A623" }}
      />
      {showCalendar && (
        <CalendarStrip
          calendarAnimation={{ type: "sequence", duration: 30 }}
          daySelectionAnimation={{
            type: "border",
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: "#4E35C2",
          }}
          style={{
            height: 100,
            paddingTop: 20,
            paddingBottom: 10,
            marginTop: 20,
          }}
          calendarHeaderStyle={{ color: "white" }}
          calendarColor={"#F5A623"}
          dateNumberStyle={{ color: "white" }}
          dateNameStyle={{ color: "white" }}
          highlightDateNumberStyle={{ color: "#4E35C2" }}
          highlightDateNameStyle={{ color: "#4E35C2" }}
          disabledDateNameStyle={{ color: "grey" }}
          disabledDateNumberStyle={{ color: "grey" }}
          iconContainer={{ flex: 0.1 }}
          scrollable={true}
          selectedDate={moment(values.planned_date)}
          onDateSelected={onChange}
          datesBlacklist={datesBlacklistFunc}
        />
      )}

      {!showCalendar && ( // disappear button when calendar is shown
        <Button
          buttonStyle={styles.button}
          onPress={() => handleSubmit()}
          title={isEditing ? "Save" : "Create"}
          loading={isSubmitting}
        />
      )}
    </Card>
  );
};
export default Form;
