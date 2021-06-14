import gql from "graphql-tag";

export const GET_PLANNED_ACTIVITY = gql`
  query {
    getPlannedActivity {
      _id
      planned_date
      title
      description
    }
  }
`;
