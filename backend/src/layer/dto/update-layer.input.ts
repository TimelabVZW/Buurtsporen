import { CreateLayerInput } from './create-layer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLayerInput extends PartialType(CreateLayerInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  defaultShow: boolean;
}
