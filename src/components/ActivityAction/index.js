import React, { useRef, useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import { Modalize } from "react-native-modalize";
import Form from "./Form";
import ActiveActivityAction from "./ActiveActivityAction";
import * as RootNavigation from "../../common/rootNavigation";
import {
  showActivityFormState,
  activeActivityState,
} from "../../recoil/atoms/activity";
import { useRecoilState } from "recoil";

export const ActivityAction = ({ navState }) => {
  const modalizeRef = useRef();
  const [show, setShow] = useRecoilState(showActivityFormState);
  const [active, setActive] = useRecoilState(activeActivityState);
  const [hide, setHide] = useState(false);

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
          }}
        >
          <Form />
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
