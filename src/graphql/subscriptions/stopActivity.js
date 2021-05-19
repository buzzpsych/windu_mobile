import gql from "graphql-tag";

export const STOP_ACTIVITY = gql`
  subscription stopActivity {
    stopActivity {
      _id
      title
      description
      time {
        total_time
        start
        end
        paused {
          time
          continue
          total
        }
      }
      project {
        title
      }
      created_by {
        _id
        email
        full_name
        avatar
      }
      created_at
    }
  }
`;
