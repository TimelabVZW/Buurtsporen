import { gql } from "@apollo/client";

const GET_STORYDETAIL_DATA= gql`
query GetStoryById ( $id : Int! ) {
    story(id: $id) {
        id
        title
        slug
        isPublished
        isHighlighted
        storyMarkers {
            id 
            markerId 
            anchor
        }
        blocks {
            id
            storyId
            position
            properties {
                id
                name
                value
            }
        }
    }
}`;

export default GET_STORYDETAIL_DATA;
