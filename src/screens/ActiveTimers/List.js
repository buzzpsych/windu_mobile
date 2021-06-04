import React from "react";
import {
  View,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-elements";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { filter, size } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { GET_ACTIVE_TIMERS } from "../../graphql/queries/activity/getActiveTimers";
import { START_ACTIVITY } from "../../graphql/subscriptions/startActivity";
import { STOP_ACTIVITY } from "../../graphql/subscriptions/stopActivity";
import { userState } from "../../recoil/atoms/user";
import { activeTimersState } from "../../recoil/atoms/activity";
import AvatarTimer from "./AvatarTimer";

const List = () => {
  const user = useRecoilValue(userState);
  const [activeTimers, setActiveTimers] = useRecoilState(activeTimersState);
  const insets = useSafeAreaInsets();

  const [getActiveTimers, { loading, refetch }] = useLazyQuery(
    GET_ACTIVE_TIMERS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: ({ activeTimers }) => setActiveTimers(activeTimers),
    }
  );

  const { data: startActivityData, error: startActivityError } =
    useSubscription(START_ACTIVITY);

  const { data: stopActivityData, error: stopActivityError } =
    useSubscription(STOP_ACTIVITY);

  const addActiveUser = () => {
    const { startActivity } = startActivityData;
    const { created_by } = startActivity;

    if (user._id !== created_by._id)
      setActiveTimers([...activeTimers, startActivity]);
  };

  const removeActiveMember = () => {
    const { stopActivity } = stopActivityData;

    const filtered = filter(
      activeTimers,
      (time) => time._id !== stopActivity._id
    );
    setActiveTimers(filtered);
  };

  React.useEffect(() => {
    getActiveTimers();
  }, []);

  React.useEffect(() => {
    if (startActivityError) alert(startActivityError);
    if (startActivityData) addActiveUser();
  }, [startActivityError, startActivityData]);

  React.useEffect(() => {
    if (stopActivityError) alert(stopActivityError);
    if (stopActivityData) removeActiveMember();
  }, [stopActivityError, stopActivityData]);

  const keyExtractor = (item) => item._id;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#F5A623" />
      </View>
    );
  }

  return (
    <View style={{ top: insets.top, backgroundColor: "#F0F2F5", flex: 1 }}>
      {size(activeTimers) <= 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text h4 style={{ textAlign: "center", color: "#989898" }}>
            No active timers
          </Text>
        </View>
      ) : (
        <FlatList
          nestedScrollEnabled={true}
          keyExtractor={keyExtractor}
          data={activeTimers}
          renderItem={({ item }) => <AvatarTimer timer={item} />}
          renderScrollComponent={() => (
            <RefreshControl onRefresh={refetch} refreshing={loading} />
          )}
        />
      )}
    </View>
  );
};

export default List;
