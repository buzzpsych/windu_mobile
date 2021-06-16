import gql from "graphql-tag";

export const START_PLAN_ACTIVITY = gql`
  mutation ($input: startPlanActivityInput) {
    startPlannedActivity(input: $input) {
      _id
      title
      description
      created_by {
        _id
        email
        full_name
      }
      project {
        _id
        title
      }
      time {
        start
        paused {
          created_at
          time
          continue
        }
      }
    }
  }
`;
