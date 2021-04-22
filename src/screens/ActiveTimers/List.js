import React from "react";
import { View, Text, FlatList } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const List = ({}) => {
  const insets = useSafeAreaInsets();

  const list = [
    {
      name: "Amy Farha",
      avatar_url:
        "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
      subtitle: "Vice President",
    },
    {
      name: "Chris Jackson",
      avatar_url:
        "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
      subtitle: "Vice Chairman",
    },
  ];

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar source={{ uri: item.avatar_url }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
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

export default List;
