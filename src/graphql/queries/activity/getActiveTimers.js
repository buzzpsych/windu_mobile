import gql from "graphql-tag";

export const GET_ACTIVE_TIMERS = gql`
  query {
    activeTimers {
      _id
      title
      description
      time {
        start
        paused {
          time
          continue
        }
      }
      project {
        _id
        title
      }
      created_by {
        _id
        full_name
        avatar
        email
      }
    }
  }
`;
