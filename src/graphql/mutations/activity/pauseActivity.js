import gql from "graphql-tag";

export const PAUSE_ACTIVITY = gql`
  mutation ($id: String!, $time: String!) {
    pauseActivity(id: $id, time: $time) {
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
        }
      }
    }
  }
`;
