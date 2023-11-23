import { gql } from "@apollo/client";

const GET_TIMESTAMPS_DATA= gql`
query GetTimestampsData {
    timestamps {
        id
        description
        createdAt
        fileName
        url
    }
}
`;

export default GET_TIMESTAMPS_DATA;