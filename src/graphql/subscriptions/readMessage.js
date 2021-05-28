import gql from "graphql-tag";

export const READ_MESSAGE = gql`
  subscription markReadMessages {
    markReadMessages {
      messagesUpdated
      user
      from
    }
  }
`;
