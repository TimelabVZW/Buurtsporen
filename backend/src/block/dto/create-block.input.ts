import { InputType, Field, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreateBlockInput {
  @Field()
  type: string;

  @Field(() => Int)
  position: number;

  @Field({nullable: true})
  divId?: string;

  // //   Markers M-1

  @Field(() => Int)
  storyId: number;
}
