import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class StoryPropertyInput {
  @Field()
  name: string;

  @Field()
  value: string;

  @Field()
  type: string;
}

@InputType()
class StoryBlockWithPropertiesInput {
  @Field(() => [StoryPropertyInput], {nullable: true})
  properties?: StoryPropertyInput[];

  @Field()
  type: string;

  @Field(() => Int)
  position: number;
}

@InputType()
export class CreateStoryWithBlocksInput {
    @Field(() => [StoryBlockWithPropertiesInput], {nullable: true})
    blocks?: StoryBlockWithPropertiesInput[];

    @Field()
    title: string;

    @Field()
    slug: string;
}