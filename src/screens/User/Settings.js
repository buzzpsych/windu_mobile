import React from "react";
import { View, FlatList } from "react-native";
import { Avatar, Text, ListItem } from "react-native-elements";
import { useMutation } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import { useRecoilValue } from "recoil";
import { last } from "lodash";
import { userState } from "../../recoil/atoms/user";
import { UPDATE_USER } from "../../graphql/mutations/user/updateUser";
import { GET_USER } from "../../graphql/queries/user/getUser";
import { api } from "../../common/constants";

const list = ["Activities", "Projects"];
const Settings = () => {
  const userSession = useRecoilValue(userState);

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast.show("Profile updated", { type: "success" });
    },
    onError: (error) => {
      toast.show(String(error), { type: "error" });
    },
    refetchQueries: [
      {
        query: GET_USER,
      },
    ],
  });

  React.useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const avatarSrc =
    userSession.avatar ||
    `https://ui-avatars.com/api/?name=${userSession.full_name}`;

  const keyExtractor = (_, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item}</ListItem.Title>
      </ListItem.Content>
      <Text>0</Text>
    </ListItem>
  );

  const pickImage = async () => {
    const url = `${api}/upload/avatar`;

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    const { uri } = result;

    const uriParts = uri.split("/");
    const fileType = last(uriParts).split(".");
    const fileName = last(uriParts);

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: `image/${last(fileType)}`,
    });

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    await fetch(url, options)
      .then((response) => response.json())
      .then(({ file }) =>
        updateUser({
          variables: {
            name: userSession.full_name,
            avatar: file.Location,
            occupation: userSession.occupation,
          },
        })
      );

    if (result.cancelled === true) return;
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <View
        style={{
          flex: 0.8,
          flexDirection: "column",
          backgroundColor: "white",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Avatar
          containerStyle={{ alignSelf: "center" }}
          rounded
          size={100}
          source={{
            uri: avatarSrc,
          }}
          onPress={pickImage}
        >
          <Avatar.Accessory rounded size={30} />
        </Avatar>
        <Text h4 style={{ textAlign: "center", marginTop: 20 }}>
          {userSession.full_name}
        </Text>
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          {userSession.email}
        </Text>
      </View>
      <View style={{ flex: 1.5 }}>
        <FlatList
          nestedScrollEnabled={true}
          keyExtractor={keyExtractor}
          data={list}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default Settings;
