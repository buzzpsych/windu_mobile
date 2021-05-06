import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client"; // Allows FileList, File, Blob or ReactNativeFile instances within query or mutation variables and sends GraphQL multipart requests
import { graphql, graphqlws } from "../../common/constants";

import { readData, clearStorage } from "../../store/utils";

const errorLink = onError(({ graphQLErrors, networkError, ...props }) => {
  if (networkError) {
    const error = JSON.stringify(networkError);
    const errorParsed = JSON.parse(error);
    if (
      errorParsed.name === "ServerParseError" &&
      errorParsed.statusCode === 404
    )
      console.warn(`[Network error]: ${networkError}`);
  }

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (extensions.code === "UNAUTHENTICATED") {
        clearStorage();
      }
    });
  }
});
let httpLink = createUploadLink({
  uri: graphql,
});

const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${await readData("@token")}`,
    },
  };
});

httpLink = authLink.concat(httpLink);
httpLink = errorLink.concat(httpLink);

const wsLink = setContext(async (_, { headers }) => {
  new WebSocketLink({
    uri: graphqlws,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: `Bearer ${await readData("@token")}`,
      },
    },
  });
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache({
  addTypename: false,
});

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
