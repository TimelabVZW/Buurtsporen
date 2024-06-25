import { CreateStorymarkerInput } from './create-storymarker.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnchorStorymarkerInput extends PartialType(CreateStorymarkerInput) {
  @Field(() => Int)
  id: number;

  @Field({nullable: true})
  anchor?: string;
}