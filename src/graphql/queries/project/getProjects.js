import gql from "graphql-tag";

export const GET_PROJECTS = gql`
  query getProjects($input: getProjectsInput) {
    getProjects(input: $input) {
      data {
        _id
        created_at
        updated_at
        description
        title
        total_time
        total_activities
        total_members
        status
        client {
          _id
          full_name
          email
        }
        manager {
          _id
          email
        }
        created_by {
          _id
          email
        }
        members {
          _id
          email
          full_name
          avatar
        }
      }
      pagination {
        total_data
        current_page
        total_pages
      }
    }
  }
`;
