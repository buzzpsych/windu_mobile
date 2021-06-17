import gql from "graphql-tag";

export const PLAN_ACTIVITY = gql`
  mutation ($input: createActivityInput) {
    planActivity(input: $input) {
      _id
      title
      description
      planned_date
    }
  }
`;
