import React from "react";
import { View, Image, FlatList, ActivityIndicator } from "react-native";
import { ListItem, Avatar, Text } from "react-native-elements";
import { useQuery, useSubscription, useLazyQuery } from "@apollo/client";
import { head, has } from "lodash";
import { GET_RECENT_ACTIVITY } from "../../../graphql/queries/activity/getRecentActivity";
import { GET_CURRENT_ACTIVITY } from "../../../graphql/queries/activity/getCurrentActivity";
import { START_ACTIVITY } from "../../../graphql/subscriptions/startActivity";
import { STOP_ACTIVITY as STOP_ACTIVITY_SUB } from "../../../graphql/subscriptions/stopActivity";
import Button from "../../../components/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  showActivityFormState,
  activeActivityState,
} from "../../../recoil/atoms/activity";
import { userState } from "../../../recoil/atoms/user";
import { useTimer } from "../../../common/useTimer";
import styles from "./styles";

const Timer = () => {
  const [_, setShow] = useRecoilState(showActivityFormState);
  const user = useRecoilValue(userState);
  const [activity, setActivity] = useRecoilState(activeActivityState);
  const { active, data: currentActivity } = activity;

  const { startHandler, resetHandler, time, setTime } = useTimer();

  const { loading: loadingRecent, data } = useQuery(GET_RECENT_ACTIVITY, {
    onError: (error) => alert(error),
  });

  const [getCurrentActivity, { loading }] = useLazyQuery(GET_CURRENT_ACTIVITY, {
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      //console.log("join here ", error);
    },
    onCompleted: ({ getCurrentActivity }) => {
      if (has(getCurrentActivity, "time.start"))
        setActivity({
          active: true,
          data: getCurrentActivity,
        });
    },
  });

  const {
    data: startActivityData,
    error: startActivityError,
    loading: starting,
  } = useSubscription(START_ACTIVITY);

  const { data: stopActivityData, error: stopActivityError } =
    useSubscription(STOP_ACTIVITY_SUB);

  React.useEffect(() => {
    if (startActivityError) console.log(startActivityError);
    console.log("start activity subscription", startActivityData);
    if (startActivityData) {
      const { startActivity } = startActivityData;
      const { created_by } = startActivity;
      if (created_by._id === user._id && !activity.active)
        setActivity({
          active: true,
          data: startActivity,
        });
      handleRefetchingViews();
    }
  }, [startActivityError, startActivityData]);

  React.useEffect(() => {
    //if (stopActivityError) console.log(stopActivityError);
    if (stopActivityData) {
      const { stopActivity } = stopActivityData;
      const { created_by } = stopActivity;
      if (created_by._id === user._id && activity.active)
        setActivity({ data: null, active: false });

      handleRefetchingViews();
    }
  }, [stopActivityError, stopActivityData]);

  React.useEffect(() => {
    getCurrentActivity();
  }, []);

  React.useEffect(() => {
    if (active) {
      if (head(activity.data?.time?.paused)?.continue !== undefined) {
        const continueAt = last(activity?.data?.time.paused)?.continue;
        const start = moment(new Date(continueAt), "MM/DD/YY HH:mm:ss").format(
          "MM/DD/YY HH:mm:ss"
        );
        startHandler(start);
      } else {
        const start = activity?.data?.time?.start;
        console.log(start);
        startHandler(start);
      }
    } else {
      resetHandler();
    }
  }, [active]);

  const renderItem = ({ item }) => {
    const avatarSrc =
      item.created_by.avatar ||
      `https://ui-avatars.com/api/?name=${item?.created_by.full_name}`;

    return (
      <ListItem bottomDivider>
        <Text>{item.time.total_time}</Text>
        <Avatar rounded source={{ uri: avatarSrc }} />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        </ListItem.Content>
        <Text>{item.project.title}</Text>
      </ListItem>
    );
  };

  return (
    <View>
      <View
        style={{
          ...styles.timerContainer,
          backgroundColor: active ? "#4E35C2" : "#62C376",
        }}
      >
        <Text
          style={{
            ...styles.timerText,
            color: active ? "white" : "black",
          }}
        >
          {time}
        </Text>
        {active && (
          <Text h4 style={styles.activityTitle}>
            {currentActivity.title}
          </Text>
        )}
      </View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {!active && (
          <Button onPress={() => setShow(true)} styles={styles.playBtn}>
            <Image
              style={{ height: 20, width: 20 }}
              source={{
                uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/play_white.png",
              }}
              resizeMode="contain"
            />
          </Button>
        )}
        {active && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              onPress={() => console.log("PAUSE")}
              styles={{
                backgroundColor: "#F5A623",
                height: 100,
                width: 100,
                alignItems: "center",
                justifyContent: "center",
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 100,
                borderBottomRightRadius: 100,
                borderWidth: 10,
                borderColor: "#F0F2F5",
                marginTop: -50,
              }}
            >
              <Image
                style={{ height: 20, width: 20 }}
                source={{
                  uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/pause_white.png",
                }}
                resizeMode="contain"
              />
            </Button>
            <Button
              onPress={() => console.log("STOP")}
              styles={{
                backgroundColor: "#F31A2D",
                height: 100,
                width: 100,
                alignItems: "center",
                justifyContent: "center",
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 100,
                borderBottomRightRadius: 100,
                borderWidth: 10,
                borderColor: "#F0F2F5",
                marginTop: -50,
              }}
            >
              <Image
                style={{ height: 20, width: 20 }}
                source={{
                  uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/stop_white.png",
                }}
                resizeMode="contain"
              />
            </Button>
          </View>
        )}
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          height: "40%",
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Text h4 style={{ color: "#989898" }}>
            Recent Activity
          </Text>
        </View>
        {loadingRecent ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            style={{ width: "100%" }}
            data={data?.getRecentActivity?.month}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </View>
  );
};
export default Timer;
