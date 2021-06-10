import gql from "graphql-tag";

export const UPDATE_USER = gql`
  mutation ($name: String!, $occupation: String!, $avatar: String!) {
    updateUser(name: $name, occupation: $occupation, avatar: $avatar) {
      _id
      email
      full_name
      avatar
    }
  }
`;
