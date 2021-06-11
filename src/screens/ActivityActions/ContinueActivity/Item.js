import React from "react";
import { Text, Image, View, TouchableOpacity, Alert } from "react-native";
import { ListItem } from "react-native-elements";
import { map, last } from "lodash";
import moment from "moment";
import utility from "../../../common/utility";
import playIcon from "../../../../assets/play_svg.png";
import checkIcon from "../../../../assets/check_svg.png";

const Item = ({ item, continueActivity, stopActivity }) => {
  const [expanded, setExpanded] = React.useState(false);

  const {
    time: { paused },
  } = item;

  const totalPauses = map(paused, (pauses) => pauses.total);
  const timeSpent = utility.calculateTimeTotal(totalPauses);

  const handleContinueActivity = (id) => {
    setExpanded(false);
    continueActivity({
      variables: { id, time: moment.utc(new Date()) },
    });
  };

  const handleStopActivity = (activity) => {
    const {
      _id,
      time: { paused },
    } = activity;

    console.log(_id);
    console.log(last(paused).time);

    stopActivity({
      variables: {
        input: {
          activity_id: _id,
          date_end: last(paused).time,
        },
      },
    });
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
          <Text style={{ color: "#989898" }}>{item.project.title}</Text>
          <Text style={{ color: "#62C376", marginLeft: 10 }}>{timeSpent}</Text>
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
          <TouchableOpacity onPress={() => confirmContinue(item)}>
            <Image
              style={{ height: 30, width: 30 }}
              source={playIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmStop(item)}>
            <Image
              style={{ height: 30, width: 30 }}
              source={checkIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ListItem>
    </ListItem.Accordion>
  );
};
export default Item;
