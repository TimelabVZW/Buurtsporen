import { gql } from "@apollo/client";

const mutationUpdateDefaultShow = gql`
mutation updateDefaultShow($id: Int!, $defaultShow: Boolean!) {
  updateDefaultShow(
    updateLayerInput: {
            id: $id
            defaultShow: $defaultShow
        }
    ) {
      id
      defaultShow
    }
  }`;

export default mutationUpdateDefaultShow;