import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import fetch from "cross-fetch"

const client = new ApolloClient({
  link: setContext((request, { headers }) => {
    return {
      headers: {
        ...headers,
        "X-GraphQL-Method": "Query",
      },
    }
  }).concat(
    createHttpLink({
      uri: "https://ericgraphql.dictybase.dev/graphql",
      credentials: "include",
      fetch,
    }),
  ),
  cache: new InMemoryCache(),
})

export default client
