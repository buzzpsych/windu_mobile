import gql from "graphql-tag";

export const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      _id
      content
      to
      from
      created_at
      unread
    }
  }
`;
