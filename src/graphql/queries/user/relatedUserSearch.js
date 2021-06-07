import gql from "graphql-tag";

export const RELATED_USER_SEARCH = gql`
  query ($email: String!) {
    relatedUserSearch(email: $email) {
      _id
      email
      full_name
      occupation
      avatar
      isOnline
    }
  }
`;
