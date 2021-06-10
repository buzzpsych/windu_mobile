import gql from "graphql-tag";

export const CONTINUE_ACTIVITY = gql`
  mutation ($id: String!, $time: String!) {
    continueActivity(id: $id, time: $time) {
      _id
      title
    }
  }
`;
