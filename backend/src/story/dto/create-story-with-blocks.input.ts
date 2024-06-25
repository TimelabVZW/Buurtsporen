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
export class MarkerPropertyInput {
    @Field(() => Int)
    markerId?: number;

    @Field({nullable: true})
    anchor: string;
}

@InputType()
export class CreateStoryWithBlocksInput {
    @Field(() => [StoryBlockWithPropertiesInput], {nullable: true})
    blocks?: StoryBlockWithPropertiesInput[];

    @Field(() => [MarkerPropertyInput], {nullable: true})
    markers?: MarkerPropertyInput[];

    @Field()
    title: string;

    @Field()
    slug: string;

    @Field({nullable: true})
    description?: string;

    @Field({nullable: true})
    author?: string;

    @Field({nullable: true})
    imgaeUrl?: string;
}