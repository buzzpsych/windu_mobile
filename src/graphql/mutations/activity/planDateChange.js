import gql from "graphql-tag";

export const CHANGE_DATE_PLAN_ACTIVITY = gql`
  mutation ($activity: String!, $date: String!) {
    plannedActivityDateChange(activity: $activity, date: $date) {
      _id
      title
      description
      planned_date
    }
  }
`;
