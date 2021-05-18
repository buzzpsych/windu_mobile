import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { useMutation } from "@apollo/client";
import { BottomSheet } from "react-native-elements";
import Button from "../../components/Button";
import Login from "../../components/Login";
import { LOGIN_WITH_GOOGLE } from "../../graphql/mutations/user/googleLogin";
import * as Google from "expo-google-app-auth"; //google auth libraries
import * as Localization from "expo-localization";
import { saveData } from "../../store/utils";
import googleBtnImage from "../../../assets/btn_google.png";

import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/user";

const OnBoard = ({ navigation, route }) => {
  const [user, setUser] = useRecoilState(userState);
  const [googleLogin, { loadingGoogle }] = useMutation(LOGIN_WITH_GOOGLE, {
    onError: (error) => {
      alert(error);
    },
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

  const [isVisible, setIsVisible] = useState(false);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      marginTop: 10,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5A623",
      width: "50%",
      margin: "auto",
      height: 40,
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
              platform: "mobile",
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

  const handleSubmit = (v) => {
    console.log(v);

    setIsVisible(false);
  };

  const login = () => {
    Glogin();
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            alignItems: "center",
            height: 100,
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Image
            style={{ height: 50, width: 50 }}
            source={{
              uri:
                "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/logo.png",
            }}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            backgroundColor: "#f0f2f5",
            height: 400,
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            color: "white",
          }}
        >
          <Image
            style={{ height: "100%", width: "100%" }}
            source={{
              uri:
                "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/mobile_1.png",
            }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.container}>
          <Button onPress={login}>
            <Image
              style={{ margin: "auto", height: 50 }}
              source={googleBtnImage}
              resizeMode="contain"
            />
          </Button>
          <Button
            styles={styles.button}
            color="red"
            onPress={() => setIsVisible(true)}
          >
            <Text>Login</Text>
          </Button>
          <Text style={{ marginTop: 10 }}> register at www.windu.io</Text>
        </View>
      </View>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        <Login onsubmit={handleSubmit} />
      </BottomSheet>
    </>
  );
};

export default OnBoard;
