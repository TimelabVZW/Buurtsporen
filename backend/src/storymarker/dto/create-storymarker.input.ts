import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStorymarkerInput {
  @Field({nullable: true})
  anchor?: string;

  // //   Icon M-1

  @Field({ nullable: true })
  storyId?: number;

  // //   Layer M-1

  @Field(() => Int)
  markerId: number;
}
