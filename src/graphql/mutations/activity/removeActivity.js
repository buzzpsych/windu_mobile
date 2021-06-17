import gql from "graphql-tag";

export const REMOVE_ACTIVITY = gql`
  mutation ($activity: ID!) {
    removeActivity(activity: $activity) {
      _id
      title
      description
      planned_date
    }
  }
`;
