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
      externalLogin
      unreadMessages
      projects {
        _id
        created_at
        description
        title
        members {
          _id
        }
      }
    }
  }
`;
