import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@apollo/client";
import { size } from "lodash";
import Item from "./Item";
import { updateContinueActivityList } from "../../../common/cacheUtilities";
import { GET_PAUSED_ACTIVITY } from "../../../graphql/queries/activity/getPausedActivity";
import { CONTINUE_ACTIVITY } from "../../../graphql/mutations/activity/continueActivity";

const ContinueActivity = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const {
    data: pausedActivityRequest,
    loading,
    refetch,
  } = useQuery(GET_PAUSED_ACTIVITY, {
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      toast.show(String(error), { type: "error" });
    },
  });

  const [continueActivity, { loading: continuing }] = useMutation(
    CONTINUE_ACTIVITY,
    {
      onCompleted: ({ continueActivity }) => {
        toast.show(`Continuing ${continueActivity.title}`, { type: "success" });
        navigation.navigate("Timer");
      },
      onError: (error) => {
        toast.show(String(error), { type: "error" });
      },
      update: (cache, { data: { continueActivity } }) => {
        updateContinueActivityList(cache, continueActivity, "continue");
      },
    }
  );

  const keyExtractor = (item) => item._id;

  if (loading || continuing) {
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

  const { getPausedActivity } = pausedActivityRequest;
  return (
    <View style={{ top: insets.top, backgroundColor: "#F0F2F5", flex: 1 }}>
      {size(getPausedActivity) <= 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text h4 style={{ textAlign: "center", color: "#989898" }}>
            No activities
          </Text>
        </View>
      ) : (
        <FlatList
          nestedScrollEnabled={true}
          keyExtractor={keyExtractor}
          data={getPausedActivity}
          renderItem={({ item }) => (
            <Item item={item} continueActivity={continueActivity} />
          )}
          renderScrollComponent={() => (
            <RefreshControl onRefresh={refetch} refreshing={loading} />
          )}
        />
      )}
    </View>
  );
};

export default ContinueActivity;
