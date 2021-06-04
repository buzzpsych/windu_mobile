import React, { useState } from "react";
import { View, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { truncate, findIndex, cloneDeep, orderBy, isEmpty } from "lodash";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { useIsFocused } from "@react-navigation/native";
import {
  ListItem,
  Avatar,
  SearchBar,
  Badge,
  FAB,
  Icon,
} from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { useQuery, useSubscription } from "@apollo/client";
import moment from "moment";
import { usersList, userState } from "../../recoil/atoms/user";
import { userSelectedState } from "../../recoil/atoms/message";
import { NEW_MESSAGE } from "../../graphql/subscriptions/newMessage";
import { GET_OTHER_USERS_MESSAGES } from "../../graphql/queries/messages/getOtherUsersMessages";
import { USER_STATUS_CHANGE } from "../../graphql/subscriptions/userStatusChange";

const MessagesList = ({ navigation }) => {
  const [users, setUsers] = useRecoilState(usersList);
  const [userSelected, setUserSelected] = useRecoilState(userSelectedState);
  const resetUserSelected = useResetRecoilState(userSelectedState); // method to reset recoil state wihtout re-render
  const userSession = useRecoilValue(userState);
  const [search, setSearch] = useState("");
  const modalizeRef = React.useRef();
  const isFocused = useIsFocused();
  const windowHeight = Dimensions.get("window").height;

  const onOpen = () => modalizeRef.current?.open();
  const onClose = () => modalizeRef.current?.close();

  const { loading, refetch } = useQuery(GET_OTHER_USERS_MESSAGES, {
    variables: { search },
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getOtherUsersMessages }) => {
      setUsers(getOtherUsersMessages);
    },
  });

  const { data: messageData, loading: loadingNewMessage } =
    useSubscription(NEW_MESSAGE);

  const { data: userStatus, error: userStatusError } =
    useSubscription(USER_STATUS_CHANGE);

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

  const updateUserStatus = () => {
    const { userStatusChange } = userStatus;

    const usersCopy = cloneDeep(users);

    const index = findIndex(
      usersCopy,
      (user) => user._id === userStatusChange.id
    );

    if (index >= 0) {
      usersCopy[index] = {
        ...usersCopy[index],
        isOnline: userStatusChange.isOnline,
      };

      setUsers(usersCopy);
    }
  };

  React.useEffect(() => {
    if (userStatusError) console.warn(userStatusError);
    if (userStatus) updateUserStatus();
  }, [userStatusError, userStatus]);

  React.useEffect(() => {
    if (messageData && !loadingNewMessage) updateList();
  }, [messageData]);

  React.useEffect(() => {
    if (!isEmpty(userSelected)) navigation.navigate("Details");
  }, [userSelected]);

  React.useEffect(() => {
    // if list is focused and select user has value we reset it
    if (isFocused && !isEmpty(userSelected)) resetUserSelected();
  }, [isFocused]);

  const keyExtractor = (_, index) => index.toString();

  const handleDetails = (user) => setUserSelected(user);

  const renderItem = ({ item }) => {
    const avatarSrc =
      item.avatar || `https://ui-avatars.com/api/?name=${item?.full_name}`;

    return (
      <ListItem onPress={() => handleDetails(item)} bottomDivider>
        <View>
          <Avatar rounded source={{ uri: avatarSrc }} />
          <Badge
            badgeStyle={{ backgroundColor: item.isOnline ? "green" : "gray" }}
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
    <View style={{ flex: 1 }}>
      <SearchBar
        placeholder="Search"
        onChangeText={(search) => setSearch(search)}
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
          nestedScrollEnabled={true}
          keyExtractor={keyExtractor}
          data={users}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={() => refetch()}
        />
      )}
      <FAB
        buttonStyle={{ borderRadius: 100, backgroundColor: "#F5A623" }}
        placement={"right"}
        icon={<Icon name="plus" size={20} color="white" type="font-awesome" />}
        onPress={() => onOpen()}
      />
      <Modalize
        ref={modalizeRef}
        withHandle={true}
        modalTopOffset={windowHeight / 3}
      >
        <View style={{ flex: 1, backgroundColor: "blue", height: "100%" }}>
          <SearchBar
            placeholder="Search"
            onChangeText={(search) => setSearch(search)}
            value={search}
            lightTheme={true}
            inputStyle={{ color: "black" }}
          />
        </View>
      </Modalize>
    </View>
  );
};
export default MessagesList;
