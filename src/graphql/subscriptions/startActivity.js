import gql from "graphql-tag";

export const START_ACTIVITY = gql`
  subscription startActivity {
    startActivity {
      _id
      title
      description
      time {
        start
        paused {
          time
          continue
          total
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
