import React from "react"
import { useQuery } from "@apollo/react-hooks"
import IntersectingList from "./IntersectingList"
import { GET_STRAIN_LIST } from "./query"

const IntersectingListContainer = () => {
  const [hasMore, setHasMore] = React.useState(true)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [prevCursor, setPrevCursor] = React.useState(false)
  const { loading, error, data, fetchMore } = useQuery(GET_STRAIN_LIST, {
    variables: {
      cursor: 0,
      limit: 10,
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
        limit: 10,
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

  return (
    <IntersectingList
      data={data.listStrains.strains}
      loadMore={loadMoreItems}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      setIsLoadingMore={setIsLoadingMore}
    />
  )
}

export default IntersectingListContainer
