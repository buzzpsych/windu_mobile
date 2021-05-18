import React from "react";
import { Modalize } from "react-native-modalize";
import { useRecoilValue } from "recoil";
import * as RootNavigation from "../../common/rootNavigation";
import { activeActivityState } from "../../recoil/atoms/activity";
import ActiveActivityAction from "./ActiveActivityAction";

export const CurrentTimer = ({ currentRoute }) => {
  const activity = useRecoilValue(activeActivityState);
  const { active, data } = activity;
  const modalizeRef = React.useRef();

  React.useEffect(() => {
    if (
      (active && ["Timer", "Details", "Plan"].includes(currentRoute)) ||
      !active
    ) {
      modalizeRef.current.close();
      return;
    }

    if (active) modalizeRef.current.open();
  }, [active, currentRoute]);

  const color = "#F5A623";

  return (
    <Modalize
      modalStyle={{
        backgroundColor: color,
        elevation: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
      alwaysOpen={100}
      ref={modalizeRef}
      handlePosition="inside"
      panGestureEnabled={false}
      withHandle={false}
    >
      <ActiveActivityAction
        onpress={() => RootNavigation.navigate("ActivityActions")}
        activityTitle={data?.title}
      />
    </Modalize>
  );
};
export default CurrentTimer;
