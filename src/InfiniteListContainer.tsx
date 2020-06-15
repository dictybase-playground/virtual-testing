import React from "react"
import { useQuery } from "@apollo/react-hooks"
import InfiniteList from "./InfiniteList"
import { GET_PLASMID_LIST } from "./query"

const InfiniteScrollContainer = () => {
  const [hasMore, setHasMore] = React.useState(true)
  const { loading, error, data, fetchMore } = useQuery(GET_PLASMID_LIST, {
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
      query: GET_PLASMID_LIST,
      variables: {
        cursor: data.listPlasmids.nextCursor,
        limit: 10,
        filter: "",
      },
      updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
        const previousEntry = previousResult.listPlasmids
        const previousPlasmids = previousEntry.plasmids
        const newPlasmids = fetchMoreResult.listPlasmids.plasmids
        const newCursor = fetchMoreResult.listPlasmids.nextCursor
        const allPlasmids = [...previousPlasmids, ...newPlasmids]

        if (newCursor === 0) {
          setHasMore(false)
        }

        return {
          listPlasmids: {
            nextCursor: newCursor,
            plasmids: allPlasmids,
            __typename: previousEntry.__typename,
          },
        }
      },
    })

  return (
    <InfiniteList
      data={data.listPlasmids.plasmids}
      loadMore={loadMoreItems}
      hasMore={hasMore}
    />
  )
}

export default InfiniteScrollContainer
