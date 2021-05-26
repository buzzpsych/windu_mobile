import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { WrapperMainStack } from "./MainStack";
import { AuthStackScreens } from "./AuthStack";
import { useRecoilState } from "recoil";
import { navigationRef } from "../common/rootNavigation";
import { userState } from "../recoil/atoms/user";
import { readData } from "../store/utils";

export const Routes = ({ setNavState }) => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = useRecoilState(userState);

  React.useEffect(() => {
    (async () => {
      const user = await readData("@user");
      const userObj = JSON.parse(user);
      setUser(userObj);
      setLoading(false);
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
        <ActivityIndicator size="large" color="#F5A623" />
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
