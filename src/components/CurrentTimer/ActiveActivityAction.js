import React from "react";
import { Image, Pressable, View, Text } from "react-native";
import { useTimer } from "../../contexts/timer-context";

const ActiveActivityAction = ({ onpress, activityTitle }) => {
  const { time } = useTimer();

  return (
    <Pressable onPress={onpress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 52,
        }}
      >
        <View
          style={{
            backgroundColor: "#D8DDE6",
            width: 52,
            height: 42,
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
            marginLeft: 5,
          }}
        >
          <Image
            style={{ width: 40 }}
            source={{
              uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/nice_clock.png",
            }}
            resizeMode="contain"
          />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>
            {activityTitle}
          </Text>
          <Text style={{ fontWeight: "bold", color: "white" }}>{time}</Text>
        </View>
      </View>
    </Pressable>
  );
};
export default ActiveActivityAction;
