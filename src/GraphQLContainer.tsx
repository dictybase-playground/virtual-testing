import React from "react"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
// import InfiniteList from "./InfiniteList"
import IntersectingList from "./IntersectingList"

// const GET_STRAIN_LIST_WITH_PHENOTYPE = gql`
//   query ListStrainsWithPhenotype(
//     $cursor: Int!
//     $limit: Int!
//     $phenotype: String!
//   ) {
//     listStrainsWithPhenotype(
//       input: { cursor: $cursor, limit: $limit, phenotype: $phenotype }
//     ) {
//       nextCursor
//       strains {
//         label
//       }
//     }
//   }
// `

// another phenotype example:
// abolished protein phosphorylation

const GET_STRAIN_LIST = gql`
  query StrainList($cursor: Int!, $limit: Int!, $filter: String!) {
    listStrains(input: { cursor: $cursor, limit: $limit, filter: $filter }) {
      nextCursor
      strains {
        id
        label
      }
    }
  }
`

const GraphQLContainer = () => {
  const [hasMore, setHasMore] = React.useState(true)
  const { loading, error, data, fetchMore } = useQuery(GET_STRAIN_LIST, {
    variables: {
      cursor: 0,
      limit: 10,
      filter: "",
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const loadMoreItems = () =>
    fetchMore({
      query: GET_STRAIN_LIST,
      variables: {
        cursor: data.listStrains.nextCursor,
        limit: 10,
        filter: "",
      },
      updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
        const previousEntry = previousResult.listStrains
        const previousStrains = previousEntry.strains
        const newStrains = fetchMoreResult.listStrains.strains
        const newCursor = fetchMoreResult.listStrains.nextCursor
        const allStrains = [...previousStrains, ...newStrains]

        if (newCursor === 0) {
          setHasMore(false)
        }

        return {
          listStrains: {
            nextCursor: newCursor,
            strains: allStrains,
            __typename: previousEntry.__typename,
          },
        }
      },
    })

  return (
    // <InfiniteList
    //   data={data.listStrains.strains}
    //   loadMore={loadMoreItems}
    //   hasMore={hasMore}
    // />
    <IntersectingList
      data={data.listStrains.strains}
      loadMore={loadMoreItems}
      hasMore={hasMore}
    />
  )
}

export default GraphQLContainer
