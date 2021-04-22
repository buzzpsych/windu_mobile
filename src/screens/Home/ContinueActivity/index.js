import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import { ListItem } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ContinueActivity = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const list = [
    {
      title: "Activity 1",
      project: "Project",
    },
    {
      title: "Activity 1",
      project: "Project",
    },
  ];

  const keyExtractor = (item, index) => index.toString();

  const handleContinue = () => {
    console.log("CONTINUE");
  };

  const renderItem = ({ item }) => (
    <ListItem onPress={handleContinue} bottomDivider>
      <Image
        style={{ height: 20, width: 20, marginRight: 5 }}
        source={{
          uri:
            "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/clock_gray.png",
        }}
        resizeMode="contain"
      />
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>{item.project}</ListItem.Subtitle>
      </ListItem.Content>
      <Text style={{ color: "#62C376" }}>10:10:20</Text>
    </ListItem>
  );

  return (
    <View style={{ top: insets.top, backgroundColor: "#F0F2F5", flex: 1 }}>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ContinueActivity;
