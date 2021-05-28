import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { truncate, findIndex, cloneDeep, orderBy, isEmpty } from "lodash";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { useIsFocused } from "@react-navigation/native";
import { ListItem, Avatar, SearchBar, Badge } from "react-native-elements";
import { useQuery, useSubscription } from "@apollo/client";
import moment from "moment";
import { usersList, userState } from "../../recoil/atoms/user";
import { userSelectedState } from "../../recoil/atoms/message";
import { NEW_MESSAGE } from "../../graphql/subscriptions/newMessage";
import { GET_OTHER_USERS_MESSAGES } from "../../graphql/queries/messages/getOtherUsersMessages";

const MessagesList = ({ navigation }) => {
  const [users, setUsers] = useRecoilState(usersList);
  const [userSelected, setUserSelected] = useRecoilState(userSelectedState);
  const resetUserSelected = useResetRecoilState(userSelectedState); // method to reset recoil state wihtout re-render
  const userSession = useRecoilValue(userState);
  const [search, setSearch] = useState("");

  const isFocused = useIsFocused();

  const { loading, refetch } = useQuery(GET_OTHER_USERS_MESSAGES, {
    variables: { search },
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getOtherUsersMessages }) => {
      setUsers(getOtherUsersMessages);
    },
  });

  const { data: messageData, loading: loadingNewMessage } =
    useSubscription(NEW_MESSAGE);

  const updateList = () => {
    const {
      newMessage: { from, to },
    } = messageData;

    const index = findIndex(
      users,
      (user) => user.email === from || user.email === to
    );

    if (index >= 0) {
      const arrayCopy = cloneDeep(users);

      const userUpdate = {
        ...arrayCopy[index],
        latestMessage: messageData.newMessage,
        unreadMessages:
          from === userSession.email || from === userSelected.email
            ? arrayCopy[index].unreadMessages
            : arrayCopy[index].unreadMessages + 1,
      };

      arrayCopy[index] = userUpdate;

      const arraySorted = orderBy(
        arrayCopy,
        "latestMessage.created_at",
        "desc"
      );

      setUsers(arraySorted);
    } else {
      refetch();
    }
  };

  React.useEffect(() => {
    if (messageData && !loadingNewMessage) updateList();
  }, [messageData]);

  React.useEffect(() => {
    // if list is focused and select user has value we reset it
    if (isFocused && !isEmpty(userSelected)) resetUserSelected();
  }, [isFocused]);

  const keyExtractor = (_, index) => index.toString();

  const handleDetails = (user) => {
    setUserSelected(user);
    navigation.navigate("Details");
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  const renderItem = ({ item }) => {
    const avatarSrc =
      item.avatar || `https://ui-avatars.com/api/?name=${item?.full_name}`;

    return (
      <ListItem onPress={() => handleDetails(item)} bottomDivider>
        <View>
          <Avatar rounded source={{ uri: avatarSrc }} />
          <Badge
            status="success"
            containerStyle={{ position: "absolute", top: -2, right: -2 }}
          />
        </View>
        <ListItem.Content>
          <ListItem.Title>{item.full_name}</ListItem.Title>
          <ListItem.Subtitle>
            {truncate(item.latestMessage.content, { length: 50 })}
          </ListItem.Subtitle>
          <ListItem.Subtitle>
            {moment(item.latestMessage.created_at).fromNow()}
          </ListItem.Subtitle>
        </ListItem.Content>
        {item.unreadMessages > 0 && (
          <Badge
            value={item.unreadMessages}
            badgeStyle={{ backgroundColor: "#F5A623" }}
          />
        )}
        <ListItem.Chevron color="black" />
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
        inputStyle={{ color: "black" }}
      />
      {loading ? (
        <View
          style={{
            flex: 0.9,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
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
