import { REACT_APP_BE, NODE_ENV } from "@env";

export const graphql =
  NODE_ENV === "development"
    ? `http://192.168.1.6:8081/graphql`
    : `https://be-dev.windu.io/graphql`;

export const graphqlws =
  NODE_ENV === "development"
    ? `ws://192.168.1.6:8081/graphql`
    : `wss://be-dev.windu.io/graphql`;
