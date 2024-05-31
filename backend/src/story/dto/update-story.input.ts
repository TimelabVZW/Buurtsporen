import { CreateStoryInput } from './create-story.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateStoryInput extends PartialType(CreateStoryInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true})
  title?: string;

  @Field({ nullable: true})
  slug?: string;
}