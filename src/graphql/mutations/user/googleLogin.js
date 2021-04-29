import gql from "graphql-tag";

export const LOGIN_WITH_GOOGLE = gql`
  mutation($input: googleLoginInput) {
    googleLogin(input: $input) {
      token
      new_user
    }
  }
`;
