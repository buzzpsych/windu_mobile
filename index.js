import React from "react";
import * as Expo from "expo";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./src/graphql/config/client";
import Toast from "react-native-fast-toast";
import { RecoilRoot } from "recoil";
import { AppRegistry } from "react-native";

import App from "./App";

const Entry = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <RecoilRoot>
        <App />
        <Toast ref={(ref) => (global["toast"] = ref)} placement={"bottom"} />
      </RecoilRoot>
    </ApolloProvider>
  );
};
AppRegistry.registerComponent("windu", () => Entry);

export default Expo.registerRootComponent(Entry);
