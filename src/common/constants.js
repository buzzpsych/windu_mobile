import { REACT_APP_BE, NODE_ENV } from "@env";

export const graphql =
  NODE_ENV === "development"
    ? `http://${REACT_APP_BE}/graphql`
    : `https://${REACT_APP_BE}/graphql`;

export const graphqlws =
  NODE_ENV === "development"
    ? `ws://${REACT_APP_BE}/graphql`
    : `wss://${REACT_APP_BE}/graphql`;
