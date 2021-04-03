import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client"; // Allows FileList, File, Blob or ReactNativeFile instances within query or mutation variables and sends GraphQL multipart requests
import { graphql, graphqlws } from "../../constants";

const token = ""; // Cookies.get("token");
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
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      if (extensions.code === "UNAUTHENTICATED") {
        //  Cookies.remove("token");
        window.location.href = "/login";
      }
    });
  }
});

let httpLink = createUploadLink({
  uri: graphql,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

httpLink = authLink.concat(httpLink);
httpLink = errorLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: graphqlws,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  },
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
