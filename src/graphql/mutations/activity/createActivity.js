import gql from "graphql-tag";

export const CREATE_ACTIVITY = gql`
  mutation ($input: createActivityInput) {
    createActivity(input: $input) {
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
