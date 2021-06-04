import gql from "graphql-tag";

export const USER_STATUS_CHANGE = gql`
  subscription userStatusChange {
    userStatusChange {
      id
      isOnline
    }
  }
`;
