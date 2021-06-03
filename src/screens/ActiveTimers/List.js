import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { ListItem } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExpandableListView } from "react-native-expandable-listview";
import { map, filter } from "lodash";
import { useRecoilValue } from "recoil";
import { GET_ACTIVE_TIMERS } from "../../graphql/queries/activity/getActiveTimers";
import { START_ACTIVITY } from "../../graphql/subscriptions/startActivity";
import { STOP_ACTIVITY } from "../../graphql/subscriptions/stopActivity";
import { userState } from "../../recoil/atoms/user";
import AvatarTimer from "./AvatarTimer";

const List = () => {
  const user = useRecoilValue(userState);
  const [activeTimers, setActiveTimers] = React.useState([]);
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

  const renderItem = (timer) => {
    return {
      id: timer.created_by._id, // required, id of item
      customItem: <AvatarTimer timer={timer} />,
      subCategory: [
        // required, array containing inner objects
        {
          customInnerItem: (
            <ListItem style={{ width: "100%" }}>
              <ListItem.Content>
                <ListItem.Title>{timer.title}</ListItem.Title>
                <ListItem.Subtitle>{timer.description}</ListItem.Subtitle>
              </ListItem.Content>
              <Text style={{ color: "#62C376" }}>{timer.project.title}</Text>
            </ListItem>
          ),
          id: timer._id, // required, of inner object
        },
      ],
    };
  };

  return (
    <View style={{ top: insets.top, backgroundColor: "#F0F2F5", flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={() => refetch()} refreshing={loading} />
        }
      >
        <ExpandableListView
          data={map(activeTimers, (timer) => renderItem(timer))} // required
          ExpandableListViewStyles={{}}
          itemContainerStyle={{ padding: 0 }}
          itemLabelStyle={{}}
          renderItemSeparator={true}
          renderInnerItemSeparator={true}
          innerItemContainerStyle={{
            borderBottomWidth: 0.3,
            paddingHorizontal: 20,
            backgroundColor: "white",
          }}
        />
      </ScrollView>
    </View>
  );
};

export default List;
