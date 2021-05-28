import gql from "graphql-tag";

export const REGISTER_DEVICE = gql`
  mutation registerDevice($input: deviceRegisterInput!) {
    registerDevice(input: $input)
  }
`;

export const UNREGISTER_DEVICE = gql`
  mutation unregisterDevice($token: String!) {
    unregisterDevice(token: $token)
  }
`;
