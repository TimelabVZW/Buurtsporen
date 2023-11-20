import { gql } from "@apollo/client";

const GET_MAPS_DATA= gql`
query GetLayersData {
    layers {
        id
        name
        private
        createdAt
        markers {
            id
            name
            type
            color
            layerId
            author
            createdAt
            icon {
                id
                fileName
            }
            coordinates {
                id
                latitude
                longitude
            }
        }
    }
    icons {
        id
        name
        fileName
        url
    }
}
`;

export default GET_MAPS_DATA;
