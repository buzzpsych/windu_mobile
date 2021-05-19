import React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { useMutation } from "@apollo/client";
import { upperFirst } from "lodash";
import { Formik } from "formik";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { CREATE_ACTIVITY } from "../../graphql/mutations/activity/createActivity";
import Form from "./Form";
import * as Yup from "yup";
import { useTimer } from "../../contexts/timer-context";
import { userState } from "../../recoil/atoms/user";
import styles from "./styles";

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("This field is required"),
  description: Yup.string().required("This field is required"),
  project: Yup.string().required("This field is required"),
});

export const ActivityAction = () => {
  const user = useRecoilValue(userState);
  const windowHeight = Dimensions.get("window").height;

  const { modalizeRef } = useTimer();

  const [createActivity] = useMutation(CREATE_ACTIVITY, {
    onCompleted: ({ createActivity }) => {
      toast.show(`${createActivity.title} started`, { type: "success" });
    },
    onError: (error) => toast.show(error, { type: "error" }),
  });

  const onCreateActivity = (values) => {
    const { title, description, project } = values;
    modalizeRef?.current?.close();
    createActivity({
      variables: {
        input: {
          created_by: user._id,
          title: upperFirst(title),
          description,
          project,
          date_start: moment.utc(),
          latitude: null,
          longitude: null,
        },
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
            Start an activity
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
            }}
            onSubmit={onCreateActivity}
            validationSchema={validationSchema}
          >
            {(props) => <Form {...props} />}
          </Formik>
        </View>
      </View>
    </Modalize>
  );
};
export default ActivityAction;
