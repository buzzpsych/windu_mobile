import React from "react";
import { Image } from "react-native";
import PaperOnboarding from "@gorhom/paper-onboarding";

const data = [
  {
    title: "Track",
    description: "Start pause and stop your activities from anywhere",
    backgroundColor: "#9D8FBF",
    image: (
      <Image
        style={{ height: 300, width: 300 }}
        source={{
          uri:
            "https://windu.s3.us-east-2.amazonaws.com/assets/windu_illustrations_smart_time_tracking%402x.png",
        }}
        resizeMode="contain"
      />
    ),
  },
  {
    title: "Connected",
    description: "Stay connected with your team's activity",
    backgroundColor: "#F5A623",
    image: (
      <Image
        style={{ height: 300, width: 300 }}
        source={{
          uri:
            "https://windu.s3.us-east-2.amazonaws.com/assets/windu_illustrations_trackable_activities%402x.png",
        }}
        resizeMode="contain"
      />
    ),
  },
  {
    title: "Real-time Messaging",
    description: "Message all of your teammates",
    titleStyle: {
      color: "black",
    },
    descriptionStyle: {
      color: "black",
    },
    backgroundColor: "#ffffff",
    image: (
      <Image
        style={{ height: 300, width: 300 }}
        source={{
          uri:
            "https://windu.s3.us-east-2.amazonaws.com/assets/windu_illustrations_free_subscription100.jpg",
        }}
        resizeMode="contain"
      />
    ),
  },
];

const HomeOnboard = ({ handleOnClosePress }) => {
  return (
    <PaperOnboarding
      indicatorBorderColor="black"
      indicatorBackgroundColor="black"
      indicatorSize={24}
      data={data}
      onCloseButtonPress={handleOnClosePress}
      closeButtonText="Start"
      closeButtonTextStyle={{ color: "black" }}
    />
  );
};

export default HomeOnboard;
