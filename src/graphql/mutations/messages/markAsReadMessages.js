import gql from "graphql-tag";

export const MARK_AS_READ = gql`
  mutation ($from: String!, $messageId: ID) {
    markAsReadMessages(from: $from, messageId: $messageId)
  }
`;
