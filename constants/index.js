export const graphql =
  process.env.NODE_ENV === "development"
    ? `http://${process.env.REACT_APP_BE}/graphql`
    : `https://${process.env.REACT_APP_BE}/graphql`;

export const graphqlws =
  process.env.NODE_ENV === "development"
    ? `ws://${process.env.REACT_APP_BE}/graphql`
    : `wss://${process.env.REACT_APP_BE}/graphql`;
