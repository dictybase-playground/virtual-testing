import gql from "graphql-tag"

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
        id
        label
      }
    }
  }
`

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

const GET_PLASMID_LIST = gql`
  query PlasmidListFilter($cursor: Int!, $filter: String!) {
    listPlasmids(input: { cursor: $cursor, limit: 10, filter: $filter }) {
      nextCursor
      plasmids {
        id
        name
      }
    }
  }
`

export { GET_STRAIN_LIST, GET_PLASMID_LIST, GET_STRAIN_LIST_WITH_PHENOTYPE }
