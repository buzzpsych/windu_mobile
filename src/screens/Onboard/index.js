import React, { useState } from "react";
import { View, Image, Text } from "react-native";
import { useMutation } from "@apollo/client";
import { BottomSheet } from "react-native-elements";
import moment from "moment";
import Button from "../../components/Button";
import Login from "../../components/Login";
import { LOGIN_WITH_GOOGLE } from "../../graphql/mutations/user/googleLogin";
import { LOGIN } from "../../graphql/mutations/user/login";
import * as Google from "expo-google-app-auth"; //google auth libraries
import * as Localization from "expo-localization";
import { saveData } from "../../store/utils";
import googleBtnImage from "../../../assets/btn_google.png";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/user";
import styles from "./styles";

const OnBoard = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isVisible, setIsVisible] = useState(false);

  const [googleLogin, { loadingGoogle }] = useMutation(LOGIN_WITH_GOOGLE, {
    onError: (error) => alert(error),
    onCompleted: async (data) => {
      saveData("@token", data?.googleLogin?.token);
      setUser(true);
      if (data?.googleLogin?.new_user) {
        /// new onboard
      } else {
        ///
      }
    },
  });

  const [login, { loadingLogin }] = useMutation(LOGIN, {
    onError: (error) => alert(error),
    onCompleted: ({ login }) => {
      const { token, createdAt, user } = login;
      const authToken = {
        key: token,
        expire: moment(new Date(createdAt)).add(24, "hours"),
      };

      saveData("@token", JSON.stringify(authToken));
      saveData("@user", JSON.stringify(user));
      setUser(user);
      setIsVisible(false);
    },
  });

  const Glogin = async () => {
    try {
      const result = await Google.logInAsync({
        //return an object with result token and user
        //    iosClientId: Constants.manifest.extra.IOS_KEY, //From app.json
        androidClientId:
          "103455477750-8nj4dngflre6i991alpn3gpufvl9pmb5.apps.googleusercontent.com",
        androidStandaloneAppClientId:
          "103455477750-8nj4dngflre6i991alpn3gpufvl9pmb5.apps.googleusercontent.com",
        iosClientId:
          "103455477750-9rnro9p60f3c6blo0v7e6jg4i5r1hg9q.apps.googleusercontent.com",
        iosStandaloneAppClientId:
          "103455477750-9rnro9p60f3c6blo0v7e6jg4i5r1hg9q.apps.googleusercontent.com",
      });
      if (result.type === "success") {
        const {
          user: { email, name, photoUrl },
        } = result;

        googleLogin({
          variables: {
            input: {
              email,
              name,
              avatar: photoUrl,
              timezone: Localization.timezone,
            },
          },
        });
      } else {
        //CANCEL
      }
    } catch ({ message }) {
      alert("login: Error:" + message);
    }
  };

  const handleSubmit = (values) => {
    login({ variables: values });
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Image
            style={styles.logo}
            source={{
              uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/logo.png",
            }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.imgContainer}>
          <Image
            style={styles.img}
            source={{
              uri: "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/mobile_1.png",
            }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.container}>
          <Button onPress={Glogin}>
            <Image
              style={{ margin: "auto", height: 50 }}
              source={googleBtnImage}
              resizeMode="contain"
            />
          </Button>
          <Button styles={styles.button} onPress={() => setIsVisible(true)}>
            <Text style={styles.loginText}>Login</Text>
          </Button>
          <Text style={{ marginTop: 10 }}>Register at www.windu.io</Text>
        </View>
      </View>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        <Login onsubmit={handleSubmit} loading={loadingLogin} />
      </BottomSheet>
    </>
  );
};

export default OnBoard;
