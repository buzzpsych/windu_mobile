import gql from "graphql-tag";

export const STOP_ACTIVITY = gql`
  mutation ($input: stopActivityInput) {
    stopActivity(input: $input) {
      _id
      title
      description
      time {
        total_time
        start
        end
      }
      project {
        title
      }
      created_by {
        email
        full_name
        avatar
      }
      created_at
    }
  }
`;
