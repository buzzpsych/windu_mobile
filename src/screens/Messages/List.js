import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ListItem, Avatar, SearchBar } from "react-native-elements";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const MessagesList = ({ navigation }) => {
  const [search, setSearch] = useState("");
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

  const handleDetails = () => {
    navigation.navigate("Details", { names: ["Brent", "Satya", "Michaś"] });
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  const renderItem = ({ item }) => (
    <ListItem onPress={handleDetails} bottomDivider>
      <Avatar source={{ uri: item.avatar_url }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const Members = () => (
    <FlatList keyExtractor={keyExtractor} data={list} renderItem={renderItem} />
  );

  const Clients = () => (
    <FlatList keyExtractor={keyExtractor} data={list} renderItem={renderItem} />
  );

  const styles = StyleSheet.create({
    tabBackground: {
      backgroundColor: "#F0F2F5",
      shadowOpacity: 0,
      elevation: 0,
    },
    indicator: { backgroundColor: "#F5A623" },
  });

  return (
    <View style={{ backgroundColor: "#F0F2F5", flex: 1 }}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
      />
      <Tab.Navigator
        tabBarOptions={{
          showIcon: true,
          style: styles.tabBackground,
          tabStyle: styles.tab,
          activeTintColor: "#F5A623",
          indicatorStyle: styles.indicator,
        }}
        style={styles.container}
      >
        <Tab.Screen name="Members" component={Members} />
        <Tab.Screen name="Clients" component={Clients} />
      </Tab.Navigator>
    </View>
  );
};
export default MessagesList;
