import { gql } from "@apollo/client";

const GET_STORIES_DATA= gql`
query GetStoriesData {
    stories {
        id
        title
        slug
    }
}
`;

export default GET_STORIES_DATA;