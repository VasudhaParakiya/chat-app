import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:5000/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:5000/graphql",
    connectionParams: () => ({
      authToken: JSON.parse(localStorage.getItem("token")),
    }),
    on: {
      connected: () => console.log("WebSocket connected"),
      closed: () => console.log("WebSocket closed"),
      error: (err) => console.error("WebSocket error", err),
    },
    lazy: true,
    reconnect: true,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.log(
        `[GraphQL error]: Code: ${extensions?.code}, Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      if (extensions?.code === "UNAUTHENTICATED") {
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: errorLink.concat(splitLink),
  cache: new InMemoryCache(),
});

export default client;
