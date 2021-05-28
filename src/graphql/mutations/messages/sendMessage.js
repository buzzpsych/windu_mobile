import gql from "graphql-tag";

export const SEND_MESSAGE = gql`
  mutation ($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      _id
      content
      to
      from
      created_at
    }
  }
`;
