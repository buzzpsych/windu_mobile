import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($input: loginInput) {
    login(input: $input) {
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
