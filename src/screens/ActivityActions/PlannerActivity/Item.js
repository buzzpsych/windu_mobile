import React from "react";
import { Image, View, TouchableOpacity, Alert } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import moment from "moment";
import playIcon from "../../../../assets/play_svg.png";

const Item = ({ item, onRemove, onStart }) => {
  const [expanded, setExpanded] = React.useState(false);

  const confirmStart = (item) => {
    const isOutDate = moment(new Date(item.planned_date)).isBefore(new Date());

    if (isOutDate) {
      toast.show("Date is expired, Please update the activity date", {
        type: "info",
      });
      return;
    }

    return Alert.alert(item.title, "Do you want to start the activity", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Start", onPress: () => onStart(item._id) },
    ]);
  };

  const confirmRemove = (item) =>
    Alert.alert(item.title, "Do you want to remove the activity", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Remove", onPress: () => onRemove(item._id) },
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
          <TouchableOpacity onPress={() => confirmStart(item)}>
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
            onPress={() => confirmRemove(item)}
          />
        </View>
      </ListItem>
    </ListItem.Accordion>
  );
};
export default Item;
