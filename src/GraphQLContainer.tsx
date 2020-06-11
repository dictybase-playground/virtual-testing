import React from "react"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import InfiniteList from "./InfiniteList"

const GET_STRAIN_LIST_WITH_PHENOTYPE = gql`
  query ListStrainsWithPhenotype(
    $cursor: Int!
    $limit: Int!
    $phenotype: String!
  ) {
    listStrainsWithPhenotype(
      input: { cursor: $cursor, limit: $limit, phenotype: $phenotype }
    ) {
      nextCursor
      strains {
        label
      }
    }
  }
`

// abolished protein phosphorylation

const GraphQLContainer = () => {
  const [hasMore, setHasMore] = React.useState(true)
  const { loading, error, data, fetchMore } = useQuery(
    GET_STRAIN_LIST_WITH_PHENOTYPE,
    {
      variables: {
        cursor: 0,
        limit: 10,
        phenotype: "decreased gene expression",
      },
    },
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const loadMoreItems = () =>
    fetchMore({
      query: GET_STRAIN_LIST_WITH_PHENOTYPE,
      variables: {
        cursor: data.listStrainsWithPhenotype.nextCursor,
        limit: 10,
        phenotype: "decreased gene expression",
      },
      updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
        const previousEntry = previousResult.listStrainsWithPhenotype
        const previousStrains = previousEntry.strains
        const newStrains = fetchMoreResult.listStrainsWithPhenotype.strains
        const newCursor = fetchMoreResult.listStrainsWithPhenotype.nextCursor
        const allStrains = [...previousStrains, ...newStrains]

        if (newCursor === 0) {
          setHasMore(false)
        }

        return {
          listStrainsWithPhenotype: {
            nextCursor: newCursor,
            strains: allStrains,
            __typename: previousEntry.__typename,
          },
        }
      },
    })

  return (
    <InfiniteList
      data={data.listStrainsWithPhenotype.strains}
      loadMore={loadMoreItems}
      hasMore={hasMore}
    />
  )
}

export default GraphQLContainer
