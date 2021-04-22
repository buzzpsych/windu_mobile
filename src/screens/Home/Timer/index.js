import React, { useState } from "react";
import { View, Image, Text, FlatList, Dimensions } from "react-native";
import Button from "../../../components/Button";
import { useRecoilState } from "recoil";
import {
  showActivityFormState,
  activeActivityState,
} from "../../../recoil/atoms/activity";

const recentActivity = [
  {
    total_time: "00:20:10",
    project: "project ",
  },
  {
    total_time: "00:20:10",
    project: "project ",
  },
  {
    total_time: "00:20:10",
    project: "project ",
  },
  {
    total_time: "00:20:10",
    project: "project ",
  },
  {
    total_time: "00:20:10",
    project: "project ",
  },
  {
    total_time: "00:20:10",
    project: "project ",
  },
  {
    total_time: "00:20:10",
    project: "project ",
  },
];

const Timer = () => {
  const [show, setShow] = useRecoilState(showActivityFormState);
  const [active, setActive] = useRecoilState(activeActivityState);

  const renderItem = ({ item }) => (
    <View
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
            uri:
              "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/clock_gray.png",
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
          backgroundColor: active ? "#4E35C2" : "#62C376",
          height: "50%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: active ? "white" : "black",
            fontSize: 40,
            fontWeight: "bold",
          }}
        >
          00:00:00
        </Text>
        {active && <Text style={{ marginTop: 20, color: "white" }}>Title</Text>}
      </View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {!active && (
          <Button
            onPress={() => setShow(true)}
            styles={{
              backgroundColor: "#62C376",
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
                uri:
                  "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/play_white.png",
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
                  uri:
                    "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/pause_white.png",
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
                  uri:
                    "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/stop_white.png",
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
        <FlatList
          style={{ width: "80%" }}
          data={recentActivity}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};
export default Timer;
