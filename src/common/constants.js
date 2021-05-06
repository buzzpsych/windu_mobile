import { REACT_APP_BE, NODE_ENV } from "@env";

export const graphql =
  NODE_ENV === "development"
    ? `http://be-dev.windu.io/graphql`
    : `https://be-dev.windu.io/graphql`;

export const graphqlws =
  NODE_ENV === "development"
    ? `ws://be-dev.windu.io/graphql`
    : `wss://be-dev.windu.io/graphql`;
