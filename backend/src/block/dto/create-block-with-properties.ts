import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class BlockPropertyInput {
  @Field()
  name: string;

  @Field()
  value: string;

  @Field()
  type: string;
}

@InputType()
export class CreateBlockWithPropertiesInput {
  @Field(() => [BlockPropertyInput], {nullable: true})
  properties?: BlockPropertyInput[];

  @Field()
  type: string;

  @Field(() => Int)
  position: number;

  // //  Markers M-1

  @Field(() => Int)
  storyId: number;
}
