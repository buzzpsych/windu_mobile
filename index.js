import React from "react";
import * as Expo from "expo";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./src/graphql/config/client";
import { RecoilRoot } from "recoil";

import App from "./App";

const Entry = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ApolloProvider>
  );
};

export default Expo.registerRootComponent(Entry);
