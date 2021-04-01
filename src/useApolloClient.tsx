import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

const useApolloClient = () => {
  const authLink = setContext((request, { headers }) => {
    return {
      headers: {
        ...headers,
        "X-GraphQL-Method": "Query",
      },
    }
  })

  const link = authLink.concat(
    createHttpLink({
      uri: `${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`,
      credentials: "include",
    }),
  )

  const cache = new InMemoryCache()

  return new ApolloClient({
    cache,
    link,
  })
}

export default useApolloClient
