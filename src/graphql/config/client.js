import { ApolloClient, InMemoryCache, split, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client"; // Allows FileList, File, Blob or ReactNativeFile instances within query or mutation variables and sends GraphQL multipart requests
import { graphql, graphqlws } from "../../common/constants";
import { readData } from "../../store/utils";

const errorLink = onError(({ networkError }) => {
  if (networkError) {
    const error = JSON.stringify(networkError);
    const errorParsed = JSON.parse(error);
    if (
      errorParsed.name === "ServerParseError" &&
      errorParsed.statusCode === 404
    )
      console.warn(`[Network error]: ${networkError}`);
  }
});

const httpLink = createUploadLink({
  uri: graphql,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await readData("@token");

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token || ""}`,
    },
  };
});

const links = from([authLink, errorLink, httpLink]);

const wsClient = new SubscriptionClient(graphqlws, {
  reconnect: true,
  lazy: true,
  inactivityTimeout: 75000,
  timeout: 75000,
  minTimeout: 75000,
  connectionParams: async () => {
    const token = await readData("@token");
    return {
      Authorization: `Bearer ${token || ""}`,
    };
  },
});

const wsLink = new WebSocketLink(wsClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  links
);

const cache = new InMemoryCache({
  addTypename: false,
  typePolicies: {
    Query: {
      fields: {
        getPausedActivity: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
