import gql from "graphql-tag";

export const GET_OTHER_USERS_MESSAGES = gql`
  query ($search: String) {
    getOtherUsersMessages(search: $search) {
      _id
      email
      avatar
      full_name
      unreadMessages
      isOnline
      occupation
      latestMessage {
        content
        from
        to
        created_at
      }
    }
  }
`;
