import React from "react"
import { useQuery } from "@apollo/react-hooks"
import InfiniteVirtualList from "./InfiniteVirtualList"
import { GET_STRAIN_LIST } from "./query"

const InfiniteVirtualListContainer = () => {
  const [totalItems, setTotalItems] = React.useState(0)
  const [hasMore, setHasMore] = React.useState(true)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [prevCursor, setPrevCursor] = React.useState(null)
  const { loading, error, data, fetchMore } = useQuery(GET_STRAIN_LIST, {
    variables: {
      cursor: 0,
      limit: 2000,
      filter: "",
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const loadMoreItems = () => {
    const newCursor = data.listStrains.nextCursor
    if (newCursor === prevCursor) {
      return
    }
    setPrevCursor(newCursor)
    setIsLoadingMore(true)
    fetchMore({
      query: GET_STRAIN_LIST,
      variables: {
        cursor: newCursor,
        limit: 2000,
        filter: "",
      },
      updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
        setIsLoadingMore(false)

        const previousEntry = previousResult.listStrains
        const previousStrains = previousEntry.strains
        const newStrains = fetchMoreResult.listStrains.strains
        const newCursor = fetchMoreResult.listStrains.nextCursor
        const allStrains = [...previousStrains, ...newStrains]

        if (newCursor === 0) {
          setHasMore(false)
        }

        setTotalItems(totalItems + newStrains.length)

        return {
          listStrains: {
            nextCursor: newCursor,
            strains: [...new Set(allStrains)],
            __typename: previousEntry.__typename,
          },
        }
      },
    })
  }

  if (totalItems === 0) {
    setTotalItems(data.listStrains.strains.length)
  }

  return (
    <InfiniteVirtualList
      data={data.listStrains.strains}
      loadMore={loadMoreItems}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      totalItems={totalItems}
    />
  )
}

export default InfiniteVirtualListContainer
