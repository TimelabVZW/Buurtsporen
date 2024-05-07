import { gql } from "@apollo/client";

const GET_MAPS_DATA = gql`
  query GetLayersDataByIDS($ids: [Int!]!, $onlyImported: Boolean!) {
    layersByIds(ids: $ids, onlyImported: $onlyImported) {
      id
      name
      private
      defaultShow
      createdAt
      markers {
        id
        type
        color
        createdAt
        icon {
          id
          url
        }
        coordinates {
          id
          latitude
          longitude
        }
      }
    }
    layers {
        id
        name
        defaultShow
    }
    icons {
      id
      name
      url
    }
  }
`;

export default GET_MAPS_DATA;