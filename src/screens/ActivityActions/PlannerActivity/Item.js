import React from "react";
import { Text, Image, View, TouchableOpacity, Alert } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { map, last } from "lodash";
import moment from "moment";
import utility from "../../../common/utility";
import playIcon from "../../../../assets/play_svg.png";
import checkIcon from "../../../../assets/check_svg.png";

const Item = ({ item }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleContinueActivity = (id) => {
    setExpanded(false);
  };

  const handleStopActivity = (activity) => {
    const {
      _id,
      time: { paused },
    } = activity;
  };

  const confirmContinue = (item) =>
    Alert.alert(item.title, "Do you want to continue the activity", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Continue", onPress: () => handleContinueActivity(item._id) },
    ]);

  const confirmStop = (item) =>
    Alert.alert(item.title, "Do you want to finish the activity", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Finish", onPress: () => handleStopActivity(item) },
    ]);

  return (
    <ListItem.Accordion
      content={
        <>
          <Image
            style={{ height: 20, width: 20, marginRight: 10 }}
            source={{
              uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/clock_gray.png",
            }}
            resizeMode="contain"
          />
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
          </ListItem.Content>
        </>
      }
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
    >
      <ListItem
        style={{
          paddingHorizontal: 20,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Icon
            name="calendar"
            type="font-awesome"
            color="#F5A623"
            size={30}
            onPress={() => console.log("hello")}
          />
          <TouchableOpacity onPress={() => confirmContinue(item)}>
            <Image
              style={{ height: 30, width: 30 }}
              source={playIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Icon
            name="trash"
            type="font-awesome"
            color="red"
            size={30}
            onPress={() => console.log("hello")}
          />
        </View>
      </ListItem>
    </ListItem.Accordion>
  );
};
export default Item;
