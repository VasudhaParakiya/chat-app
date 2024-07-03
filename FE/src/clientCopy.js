import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

//auth0 authentication

function ApolloWrapper({ children }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const token = isAuthenticated ? await getAccessTokenSilently() : "";
      setAuthToken(token);
    };
    getToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  console.log("🚀 ~ ApolloWrapper ~ authToken:", authToken);

  const authLink = setContext((_, { headers }) => {
    if (!authToken) return { headers };
    return {
      headers: {
        ...headers,
        authorization: authToken,
        // authorization: `Bearer ${authToken}`,
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
        authToken: localStorage.getItem("token"),
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
        if (extensions && extensions.code) {
          console.log(
            `[GraphQL error]: Code: ${extensions.code}, Message: ${message}`
          );
        }
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        if (extensions && extensions.code === "UNAUTHENTICATED") {
          localStorage.clear();
          window.location.replace("/login");
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

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default ApolloWrapper;
