import { gql } from "@apollo/client";

const GET_STORYDETAIL_DATA= gql`
query GetStoryById ( $id : Int! ) {
    story(id: $id) {
        id
        title
        slug
        description
        author
        imageUrl
        isPublished
        isHighlighted
        storyMarkers {
            id 
            markerId 
            anchor
        }
        blocks {
            id
            divId
            type
            position
            properties {
                id
                name
                value
                type
            }
        }
    }
}`;

export default GET_STORYDETAIL_DATA;
