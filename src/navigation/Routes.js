import React from "react";
import { View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useLazyQuery } from "@apollo/client";
import { WrapperMainStack } from "./MainStack";
import { AuthStackScreens } from "./AuthStack";
import { useRecoilState } from "recoil";
import { debounce } from "lodash";
import { navigationRef } from "../common/rootNavigation";
import { GET_USER } from "../graphql/queries/user/getUser";
import { userState } from "../recoil/atoms/user";
import { readData } from "../store/utils";

export const Routes = ({ setNavState }) => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = React.useState(true);

  const [getUser] = useLazyQuery(GET_USER, {
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getUser }) => {
      setUser(getUser);
      delayedLoading();
    },
    onError: () => {
      setUser(null);
      setLoading(false);
    },
  });

  const delayedLoading = debounce(() => {
    setLoading(false);
  }, 4000);

  React.useEffect(() => {
    (async () => {
      const token = await readData("@token");
      if (token) getUser();
      if (!token) {
        setUser(null);
        delayedLoading();
      }
    })();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={require("../../assets/windu_splash.gif")} />
      </View>
    );
  }

  return (
    <NavigationContainer
      onStateChange={() => {
        setNavState(navigationRef.current.getCurrentRoute().name);
      }}
      ref={navigationRef}
      onReady={() => setNavState(navigationRef.current.getCurrentRoute().name)}
    >
      {user ? <WrapperMainStack /> : <AuthStackScreens />}
    </NavigationContainer>
  );
};
