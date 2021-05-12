import { ApolloClient, InMemoryCache, split, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "apollo-link-error";
import { get } from "lodash";
import { TokenRefreshLink } from "apollo-link-token-refresh";
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
});

const refreshTokenLink = new ApolloLink(async (operation, forward) => {
  // if operation is login we move to next link
  if (
    operation.operationName === "login" ||
    operation.operationName === "googleLogin"
  )
    return forward(operation);

  const user = await readData("@user");
  const token = await readData("@token");
  const userObject = JSON.parse(user);
  const tokenObject = JSON.parse(token);

  if (!user) {
    console.log("return to login page");
  }

  if (!tokenObject || new Date(tokenObject.expire) < new Date()) {
    try {
      const response = await fetch(graphql, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation {
                      refreshUserToken(userId: "${userObject._id}") {
                        token
                      }
                    }`,
        }),
      });
      const { data } = await response.json();
      const { refreshUserToken } = data;
      console.log(refreshUserToken);
    } catch (error) {
      console.log("redirect to login");
    }
  }

  return forward(operation);
});

const httpLink = createUploadLink({
  uri: graphql,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await readData("@token");
  const tokenParse = JSON.parse(token);

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${get(tokenParse, "key", "")}`,
    },
  };
});

const links = refreshTokenLink
  .concat(authLink)
  .concat(errorLink)
  .concat(httpLink);

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
  links
);

const cache = new InMemoryCache({
  addTypename: false,
});

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
