import React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { useMutation } from "@apollo/client";
import { upperFirst } from "lodash";
import { Formik } from "formik";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { PLAN_ACTIVITY } from "../../graphql/mutations/activity/planActivity";
import { GET_PLANNED_ACTIVITY } from "../../graphql/queries/activity/getPlannedActivity";
import Form from "./Form";
import * as Yup from "yup";
import { userState } from "../../recoil/atoms/user";
import styles from "./styles";

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("This field is required"),
  description: Yup.string().required("This field is required"),
  project: Yup.string().required("This field is required"),
});

export const PlanActivityModal = ({ modalizeRef, selectedDate }) => {
  const user = useRecoilValue(userState);
  const windowHeight = Dimensions.get("window").height;

  const [planActivity] = useMutation(PLAN_ACTIVITY, {
    onCompleted: ({ planActivity }) => {
      toast.show(`${planActivity.title} started`, { type: "success" });
    },
    onError: (error) => toast.show(error, { type: "error" }),
    refetchQueries: [
      {
        query: GET_PLANNED_ACTIVITY,
      },
    ],
  });

  const onPlanActivity = (values) => {
    const { title, description, project, planned_date } = values;
    modalizeRef?.current?.close();
    const payload = {
      planned_date: moment.utc(planned_date),
      project,
      description,
      title: upperFirst(title),
      created_by: user._id,
    };

    planActivity({ variables: { input: { ...payload } } });
  };

  const color = "#62C376";

  return (
    <Modalize
      modalStyle={{
        backgroundColor: color,
        elevation: 0,
      }}
      alwaysOpen={0} // 0 is not visible, 100 is the height for showing the timer preview
      overlayStyle={{ backgroundColor: color }}
      ref={modalizeRef}
      handlePosition="inside"
      withHandle={false}
    >
      <View
        style={{
          flexDirection: "column",
          height: windowHeight,
        }}
      >
        <View style={styles.titleContainer}>
          <Text h4 style={styles.titleColor}>
            Plan an activity
          </Text>
        </View>
        <View
          style={{
            flex: 4,
          }}
        >
          <Formik
            initialValues={{
              title: "",
              description: "",
              project: null,
              planned_date: selectedDate,
            }}
            onSubmit={onPlanActivity}
            validationSchema={validationSchema}
          >
            {(props) => <Form {...props} />}
          </Formik>
        </View>
      </View>
    </Modalize>
  );
};
export default PlanActivityModal;
