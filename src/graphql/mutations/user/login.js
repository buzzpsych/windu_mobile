import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        user_type
        _id
        email
        full_name
        avatar
        occupation
        unreadMessages
      }
      createdAt
    }
  }
`;
