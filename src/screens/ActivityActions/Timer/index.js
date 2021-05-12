import React from "react";
import { View, Image, Text, FlatList } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_RECENT_ACTIVITY } from "../../../graphql/queries/activity/getRecentActivity";
import Button from "../../../components/Button";
import { useRecoilState } from "recoil";
import {
  showActivityFormState,
  activeActivityState,
} from "../../../recoil/atoms/activity";
import styles from "./styles";

const recentActivity = [
  {
    key: 1,
    total_time: "00:20:10",
    project: "project ",
  },
  {
    key: 2,
    total_time: "00:20:10",
    project: "project ",
  },
  {
    key: 3,
    total_time: "00:20:10",
    project: "project ",
  },
  {
    key: 4,
    total_time: "00:20:10",
    project: "project ",
  },
  {
    key: 5,
    total_time: "00:20:10",
    project: "project ",
  },
  {
    key: 6,
    total_time: "00:20:10",
    project: "project ",
  },
  {
    key: 7,
    total_time: "00:20:10",
    project: "project ",
  },
];

const Timer = () => {
  const [show, setShow] = useRecoilState(showActivityFormState);
  const [active, setActive] = useRecoilState(activeActivityState);

  const { loading, data } = useQuery(GET_RECENT_ACTIVITY);
  console.log(data);

  const renderItem = ({ item }) => (
    <View
      key={item.key}
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        marginBottom: 10,
        width: "100%",
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{ height: 20, width: 20, marginRight: 5 }}
          source={{
            uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/clock_gray.png",
          }}
          resizeMode="contain"
        />
        <Text style={{ fontWeight: "bold" }}>{item.total_time}</Text>
      </View>
      <Text style={{ color: "#AFB0B1" }}>{item.project}</Text>
    </View>
  );

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
          00:00:00
        </Text>
        {active && <Text style={styles.activityTitle}>Title</Text>}
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
          paddingTop: 20,
          height: "40%",
          paddingBottom: 20,
        }}
      >
        <View style={{ width: "80%" }}>
          <Text style={{ color: "#989898" }}>Recent Activity</Text>
        </View>
        {/*     <FlatList
          style={{ width: "80%" }}
          data={recentActivity}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        /> */}
      </View>
    </View>
  );
};
export default Timer;
