import gql from "graphql-tag";

export const LOGIN_WITH_GOOGLE = gql`
  mutation googleLogin($input: googleLoginInput) {
    googleLogin(input: $input) {
      token
      new_user
      user {
        user_type
        _id
        email
        full_name
        avatar
        occupation
        unreadMessages
      }
    }
  }
`;
