import { gql } from "@apollo/client";

const mutationCreateFullStory = gql`
mutation createStoryWithBlocks($createStoryWithBlocksInput: CreateStoryWithBlocksInput!) {
    createStoryWithBlocks(
        createStoryWithBlocksInput: $createStoryWithBlocksInput
    ) {
        id
    }
}`;

export default mutationCreateFullStory;