import React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { useMutation } from "@apollo/client";
import { upperFirst, isEmpty } from "lodash";
import { Formik } from "formik";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { PLAN_ACTIVITY } from "../../graphql/mutations/activity/planActivity";
import { GET_PLANNED_ACTIVITY } from "../../graphql/queries/activity/getPlannedActivity";
import { CHANGE_DATE_PLAN_ACTIVITY } from "../../graphql/mutations/activity/planDateChange";
import Form from "./Form";
import * as Yup from "yup";
import { userState } from "../../recoil/atoms/user";
import styles from "./styles";

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("This field is required"),
  description: Yup.string().required("This field is required"),
  project: Yup.string().required("This field is required"),
});

export const PlanActivityModal = ({
  modalizeRef,
  selectedDate,
  activitySelected,
}) => {
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

  const [plannedActivityDateChange] = useMutation(CHANGE_DATE_PLAN_ACTIVITY, {
    onError: (error) => {
      toast.show(error, { type: "error" });
    },
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

  const onChangeDate = (values) => {
    const { planned_date } = values;
    plannedActivityDateChange({
      variables: {
        activity: activitySelected._id,
        date: moment.utc(new Date(planned_date)),
      },
    });
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
              title: activitySelected?.title || "",
              description: activitySelected?.description || "",
              project: activitySelected?.project._id || null,
              planned_date: activitySelected?.planned_date || selectedDate,
            }}
            onSubmit={(values) =>
              !isEmpty(activitySelected)
                ? onChangeDate(values)
                : onPlanActivity(values)
            }
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form {...props} isEditing={!isEmpty(activitySelected)} />
            )}
          </Formik>
        </View>
      </View>
    </Modalize>
  );
};
export default PlanActivityModal;
