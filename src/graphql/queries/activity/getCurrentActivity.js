import gql from "graphql-tag";

export const GET_CURRENT_ACTIVITY = gql`
  query getCurrentActivity {
    getCurrentActivity {
      _id
      title
      description
      time {
        _id
        start
        paused {
          created_at
          time
          continue
          total
        }
      }
      project {
        title
      }
    }
  }
`;
