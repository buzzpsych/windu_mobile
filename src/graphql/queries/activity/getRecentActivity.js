import gql from "graphql-tag";

export const GET_RECENT_ACTIVITY = gql`
  query {
    getRecentActivity {
      month {
        _id
        title
        description
        project {
          title
        }
        created_by {
          email
          avatar
          full_name
        }
        created_at
        time {
          total_time
          start
          end
        }
      }
    }
  }
`;
