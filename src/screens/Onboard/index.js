import React from "react";
import { View, Image, Dimensions } from "react-native";
import { Button, Text } from "react-native-elements";
import { useMutation } from "@apollo/client";
import { GoogleSocialButton } from "react-native-social-buttons";
import { Modalize } from "react-native-modalize";
import Login from "../../components/Login";
import { winduLogo, loginImg } from "../../common/constants";
import { LOGIN_WITH_GOOGLE } from "../../graphql/mutations/user/googleLogin";
import { LOGIN } from "../../graphql/mutations/user/login";
import * as Google from "expo-google-app-auth"; //google auth libraries
import * as Localization from "expo-localization";
import { saveData } from "../../store/utils";
import { useSetRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/user";
import {
  androidClientId,
  androidStandaloneAppClientId,
} from "../../common/constants";
import styles from "./styles";

const OnBoard = () => {
  const setUser = useSetRecoilState(userState);
  const windowHeight = Dimensions.get("window").height;
  const modalizeRef = React.useRef();

  const onOpen = () => modalizeRef.current?.open();
  const onClose = () => modalizeRef.current?.close();

  const [googleLogin] = useMutation(LOGIN_WITH_GOOGLE, {
    onError: (error) => alert(error),
    onCompleted: ({ googleLogin }) => {
      const { token, user } = googleLogin;
      saveData("@token", token);
      setUser(user);
    },
  });

  const [login, { loadingLogin }] = useMutation(LOGIN, {
    onError: (error) => alert(error),
    onCompleted: ({ login }) => {
      const { token, user } = login;
      onClose();
      saveData("@token", token);
      setUser(user);
    },
  });

  const Glogin = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId,
        androidStandaloneAppClientId,
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

  const handleSubmit = (values) => {
    const { email, password } = values;

    login({
      variables: {
        input: {
          email,
          password,
          platform: "mobile",
        },
      },
    });
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={{
              uri: winduLogo,
            }}
            resizeMode="contain"
          />
        </View>
        <View style={{ flex: 3 }}>
          <Image
            style={styles.img}
            source={{
              uri: loginImg,
            }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonsContainer}>
          <GoogleSocialButton
            onPress={() => Glogin()}
            buttonViewStyle={{ alignSelf: "center", width: "50%" }}
          />
          <Button title="Login" buttonStyle={styles.button} onPress={onOpen} />
          <Text style={{ marginTop: 20, alignSelf: "center" }}>
            Register at www.windu.io
          </Text>
        </View>
      </View>
      <Modalize
        ref={modalizeRef}
        withHandle={true}
        modalTopOffset={windowHeight - 400}
      >
        <Login onsubmit={handleSubmit} loading={loadingLogin} />
      </Modalize>
    </>
  );
};

export default OnBoard;
