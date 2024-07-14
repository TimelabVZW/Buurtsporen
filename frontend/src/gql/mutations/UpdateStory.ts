import { gql } from "@apollo/client";

const mutationUpdateStory = gql`
mutation updateStoryWithBlocks($updateStoryWithBlocksInput: UpdateStoryWithBlocksInput!) {
  updateStoryWithBlocks(
    updateStoryWithBlocksInput: $updateStoryWithBlocksInput
  ) {
    id  
  }
  }`;

export default mutationUpdateStory;