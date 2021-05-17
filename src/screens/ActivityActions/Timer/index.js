import React from "react";
import { View, Image, FlatList, ActivityIndicator } from "react-native";
import { ListItem, Avatar, Text } from "react-native-elements";
import {
  useQuery,
  useSubscription,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { head, has } from "lodash";
import moment from "moment";
import { GET_RECENT_ACTIVITY } from "../../../graphql/queries/activity/getRecentActivity";
import { GET_CURRENT_ACTIVITY } from "../../../graphql/queries/activity/getCurrentActivity";
import { START_ACTIVITY } from "../../../graphql/subscriptions/startActivity";
import { STOP_ACTIVITY as STOP_ACTIVITY_SUB } from "../../../graphql/subscriptions/stopActivity";
import { STOP_ACTIVITY } from "../../../graphql/mutations/activity/stopActivity";
import { PAUSE_ACTIVITY } from "../../../graphql/mutations/activity/pauseActivity";
import Button from "../../../components/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import { playImg, pauseImg, stopImg } from "../../../common/constants";
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

  const { startHandler, resetHandler, time } = useTimer();

  const { loading: loadingRecent, data } = useQuery(GET_RECENT_ACTIVITY, {
    onError: (error) => toast.show(error, { type: "error" }),
  });

  const [getCurrentActivity, { loading }] = useLazyQuery(GET_CURRENT_ACTIVITY, {
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getCurrentActivity }) => {
      if (has(getCurrentActivity, "time.start"))
        setActivity({
          active: true,
          data: getCurrentActivity,
        });
    },
  });

  const [stopActivity, { loading: stopping }] = useMutation(STOP_ACTIVITY, {
    onCompleted: ({ stopActivity }) => {
      toast.show(`${stopActivity.title} stopped`, { type: "success" });
    },
    onError: (error) => toast.show(error, { type: "error" }),
  });

  const [pauseActivity, { loading: pausing }] = useMutation(PAUSE_ACTIVITY, {
    onCompleted: ({ pauseActivity }) => {
      toast.show(`${pauseActivity.title} paused`, { type: "success" });
    },
    onError: (error) => toast.show(error, { type: "error" }),
  });

  const { data: startActivityData, error: startActivityError } =
    useSubscription(START_ACTIVITY);

  const { data: stopActivityData, error: stopActivityError } =
    useSubscription(STOP_ACTIVITY_SUB);

  React.useEffect(() => {
    if (startActivityError) console.log(startActivityError);
    if (startActivityData) {
      const { startActivity } = startActivityData;
      const { created_by } = startActivity;
      if (created_by._id === user._id && !activity.active)
        setActivity({
          active: true,
          data: startActivity,
        });
    }
  }, [startActivityError, startActivityData]);

  React.useEffect(() => {
    if (stopActivityError) console.log(stopActivityError);
    if (stopActivityData) {
      const { stopActivity } = stopActivityData;
      const { created_by } = stopActivity;
      if (created_by._id === user._id && activity.active)
        setActivity({ data: null, active: false });
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
        startHandler(start);
      }
    } else {
      resetHandler();
    }
  }, [active]);

  const handleStop = () => {
    stopActivity({
      variables: {
        input: {
          activity_id: currentActivity._id,
          date_end: moment.utc(),
        },
      },
    });
  };

  const handlePause = () => {
    pauseActivity({
      variables: { id: currentActivity._id, time: moment.utc() },
    });
  };

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
    <View style={{ flex: 1 }}>
      <View
        style={{
          ...styles.timerContainer,
          backgroundColor: active ? "#4E35C2" : "#62C376",
        }}
      >
        {loading || stopping || pausing ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <>
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
          </>
        )}
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {!active && (
          <Button onPress={() => setShow(true)} styles={styles.playBtn}>
            <Image
              style={styles.actionImg}
              source={{
                uri: playImg,
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
            <Button onPress={() => handlePause()} styles={styles.pauseBtn}>
              <Image
                style={styles.actionImg}
                source={{
                  uri: pauseImg,
                }}
                resizeMode="contain"
              />
            </Button>
            <Button onPress={() => handleStop()} styles={styles.stopBtn}>
              <Image
                style={styles.actionImg}
                source={{
                  uri: stopImg,
                }}
                resizeMode="contain"
              />
            </Button>
          </View>
        )}
      </View>
      <View style={styles.recentContainer}>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Text h4 style={{ color: "#989898" }}>
            Recent Activity
          </Text>
        </View>
        {loadingRecent ? (
          <ActivityIndicator size="large" color="#F5A623" />
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
