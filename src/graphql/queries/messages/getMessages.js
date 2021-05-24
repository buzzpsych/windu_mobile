import gql from "graphql-tag";

export const GET_MESSAGES = gql`
  query($from: String!, $limit: Int!, $page: Int!) {
    getMessages(from: $from, limit: $limit, page: $page) {
      _id
      content
      to
      from
      created_at
      unread
    }
  }
`;
