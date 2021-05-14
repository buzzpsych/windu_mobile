import {
  ApolloClient,
  InMemoryCache,
  split,
  ApolloLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "apollo-link-error";
import { get } from "lodash";
import moment from "moment";
import { createUploadLink } from "apollo-upload-client"; // Allows FileList, File, Blob or ReactNativeFile instances within query or mutation variables and sends GraphQL multipart requests
import { graphql, graphqlws } from "../../common/constants";
import { readData, saveData } from "../../store/utils";

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
                        createdAt
                      }
                    }`,
        }),
      });
      const { data } = await response.json();
      const {
        refreshUserToken: { createdAt, token },
      } = data;

      const authToken = {
        key: token,
        expire: moment(new Date(createdAt)).add(24, "hours"),
      };

      saveData("@token", JSON.stringify(authToken));
    } catch (error) {
      alert("refresh token error:", error);
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

const links = from([refreshTokenLink, authLink, errorLink, httpLink]);

const wsClient = new SubscriptionClient(graphqlws, {
  lazy: true,
  reconnect: true,
  connectionParams: async () => {
    const token = await readData("@token");
    const tokenParse = JSON.parse(token);
    return {
      Authorization: `Bearer ${get(tokenParse, "key", "")}`,
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
});

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
