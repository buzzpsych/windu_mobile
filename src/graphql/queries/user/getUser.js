import gql from "graphql-tag";

export const GET_USER = gql`
  query {
    getUser {
      user_type
      _id
      email
      full_name
      avatar
      occupation
      unreadMessages
    }
  }
`;
