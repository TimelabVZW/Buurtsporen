import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIconInput {
  @Field(() => Int)
  id: number;
  
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true})
  fileName?: string;

  @Field({ nullable: true})
  url: string;
}
