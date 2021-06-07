import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "react-native-elements";
import { filter, size, isEmpty, lowerCase } from "lodash";
import { ListItem, Avatar, SearchBar, Badge } from "react-native-elements";
import { useQuery } from "@apollo/client";
import { useRecoilValue, useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/user";
import { userSelectedState } from "../../recoil/atoms/message";
import { RELATED_USER_SEARCH } from "../../graphql/queries/user/relatedUserSearch";

const SearchList = ({ navigation }) => {
  const userSession = useRecoilValue(userState);
  const [userSelected, setUserSelected] = useRecoilState(userSelectedState);
  const [relatedUsersList, setRelatedUsersList] = React.useState([]);
  const [relatedUserSearch, setRelatedUserSearch] = React.useState("");

  const { loading: loadingRelatedUsers } = useQuery(RELATED_USER_SEARCH, {
    variables: { email: relatedUserSearch },
    onCompleted: ({ relatedUserSearch }) => {
      const filtered = filter(
        relatedUserSearch,
        (item) => item.email !== userSession.email
      );
      setRelatedUsersList(filtered);
    },
  });

  React.useEffect(() => {
    if (!isEmpty(userSelected)) navigation.navigate("Details");
  }, [userSelected]);

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
          <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        placeholder="Write at least 3 characters to start searching"
        onChangeText={(search) => setRelatedUserSearch(lowerCase(search))}
        value={relatedUserSearch}
        lightTheme={true}
        inputStyle={{ color: "black" }}
      />
      {size(relatedUsersList) > 0 && (
        <FlatList
          nestedScrollEnabled={true}
          keyExtractor={keyExtractor}
          data={relatedUsersList}
          renderItem={renderItem}
          refreshing={loadingRelatedUsers}
        />
      )}
      {isEmpty(relatedUsersList) && !loadingRelatedUsers && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            width: "70%",
            alignSelf: "center",
          }}
        >
          <Text h4 style={{ textAlign: "center", color: "#989898" }}>
            Search and select the user
          </Text>
        </View>
      )}
    </View>
  );
};
export default SearchList;
