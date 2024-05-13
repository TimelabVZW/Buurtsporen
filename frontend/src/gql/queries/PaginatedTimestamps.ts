import { gql } from "@apollo/client";

const GET_PAGINATED_TIMESTAMPS = gql`
  query SearchPaginatedTimestamps($query: TimestampPaginateQuery!) {
    paginatedTimestamps(query: $query) {
      id
      description
      createdAt
      fileName
      url
      markerId
    }
    timestamps {
        id
    }
  }
`;

export const TimestampPaginateQuery = gql`
  input TimestampPaginateQuery {
    page: Int!
    limit: Int!
    sortBy: String!
    sortDirection: SortDirection!
    description: String
    id: String
  }


  enum SortDirection {
    ASC
    DESC
  }
`;

export default GET_PAGINATED_TIMESTAMPS;