import gql from "graphql-tag";

export const GET_PAUSED_ACTIVITY = gql`
  query {
    getPausedActivity {
      _id
      title
      description
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
          total
        }
      }
    }
  }
`;
