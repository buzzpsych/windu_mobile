import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRecoilState } from "recoil";
import { ListItem, Avatar, SearchBar, Badge } from "react-native-elements";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { usersList } from "../../recoil/atoms/user";
import { GET_OTHER_USERS_MESSAGES } from "../../graphql/queries/messages/getOtherUsersMessages";

const MessagesList = ({ navigation }) => {
  const [users, setUsers] = useRecoilState(usersList);
  const [search, setSearch] = useState("");

  const { loading, refetch } = useQuery(GET_OTHER_USERS_MESSAGES, {
    variables: { search },
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getOtherUsersMessages }) => {
      setUsers(getOtherUsersMessages);
    },
  });

  const keyExtractor = (_, index) => index.toString();

  const handleDetails = () => {
    navigation.navigate("Details", { names: ["Brent", "Satya", "Michaś"] });
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  const renderItem = ({ item }) => {
    const avatarSrc =
      item.avatar || `https://ui-avatars.com/api/?name=${item?.full_name}`;

    return (
      <ListItem onPress={handleDetails} bottomDivider>
        <View>
          <Avatar rounded source={{ uri: avatarSrc }} />
          <Badge
            status="success"
            containerStyle={{ position: "absolute", top: -2, right: -2 }}
          />
        </View>
        <ListItem.Content>
          <ListItem.Title>{item.full_name}</ListItem.Title>
          <ListItem.Subtitle>{item.latestMessage.content}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Subtitle>
            {moment(item.latestMessage.created_at).fromNow()}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <View style={{ backgroundColor: "#F0F2F5", flex: 1 }}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        lightTheme={true}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#F5A623" />
      ) : (
        <FlatList
          keyExtractor={keyExtractor}
          data={users}
          renderItem={renderItem}
          renderScrollComponent={() => (
            <RefreshControl onRefresh={refetch} refreshing={loading} />
          )}
        />
      )}
    </View>
  );
};
export default MessagesList;
