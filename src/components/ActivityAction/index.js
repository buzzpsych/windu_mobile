import React, { useRef, useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { useMutation } from "@apollo/client";
import { upperFirst } from "lodash";
import moment from "moment";
import { useRecoilState, useRecoilValue } from "recoil";
import { CREATE_ACTIVITY } from "../../graphql/mutations/activity/createActivity";
import Form from "./Form";
import ActiveActivityAction from "./ActiveActivityAction";
import * as RootNavigation from "../../common/rootNavigation";
import {
  showActivityFormState,
  activeActivityState,
} from "../../recoil/atoms/activity";
import { userState } from "../../recoil/atoms/user";

export const ActivityAction = ({ navState }) => {
  const modalizeRef = useRef();
  const user = useRecoilValue(userState);
  const [show, setShow] = useRecoilState(showActivityFormState);
  const [activity] = useRecoilState(activeActivityState);
  const [hide, setHide] = useState(false);

  const [createActivity, { loading: creating }] = useMutation(CREATE_ACTIVITY, {
    onCompleted: ({ createActivity }) => {
      console.log("on completed ", createActivity);
      setShow(false);
    },
    onError: (error) => alert(error),
  });

  const { active } = activity;
  useEffect(() => {
    if (
      active &&
      ["Timer", "Details", "Plan"].includes(
        RootNavigation.navigationRef.current?.getCurrentRoute()?.name
      )
    ) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [RootNavigation.navigationRef.current, navState]);

  useEffect(() => {
    if (show) {
      modalizeRef.current?.open("top");
    } else if (!active) {
      modalizeRef.current?.close("bottom");
      setShow(false);
    }
  }, [show]);

  const handleChange = (pos) => {
    if (pos === "initial") {
      setShow(false);
    }
  };

  const onCreateActivity = (values) => {
    const { title, description, project } = values;
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

  const color = active ? "#F5A623" : "#62C376";
  return (
    <Modalize
      modalStyle={{
        backgroundColor: color,
        height: "100%",
        elevation: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
      overlayStyle={{ backgroundColor: color }}
      ref={modalizeRef}
      handlePosition="inside"
      withHandle={false}
      alwaysOpen={!hide ? 100 : 1}
      panGestureEnabled={!active || show}
      onPositionChange={handleChange}
    >
      {show && (
        <View
          style={{
            height: Dimensions.get("window").height - 50,
            display: "flex",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 100,
            }}
          >
            <Text h4 style={{ color: "white" }}>
              Start an activity
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              height: "50%",
              width: "100%",
              marginHorizontal: 20,
              paddingHorizontal: 20,
            }}
          >
            <Form onSubmit={onCreateActivity} />
          </View>
        </View>
      )}

      {active && (
        <ActiveActivityAction
          onpress={() =>
            RootNavigation.navigate("Activity", {
              screen: "Timer",
            })
          }
        />
      )}
    </Modalize>
  );
};
export default ActivityAction;
