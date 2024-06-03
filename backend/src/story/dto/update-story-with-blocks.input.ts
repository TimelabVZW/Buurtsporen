import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class UpdateStoryPropertyInput {
  @Field(() => Int)
  id: number;

  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  value?: string;

  @Field({nullable: true})
  type?: string;
}

@InputType()
class UpdateStoryBlockWithPropertiesInput {
  @Field(() => Int)
  id: number;

  @Field(() => [UpdateStoryPropertyInput], {nullable: true})
  properties?: UpdateStoryPropertyInput[];

  @Field({nullable: true})
  type?: string;

  @Field(() => Int, {nullable: true})
  position?: number;
}

@InputType()
export class UpdateStoryWithBlocksInput {
    @Field(() => Int)
    id: number;

    @Field(() => [UpdateStoryBlockWithPropertiesInput], {nullable: true})
    blocks?: UpdateStoryBlockWithPropertiesInput[];

    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    slug?: string;
}