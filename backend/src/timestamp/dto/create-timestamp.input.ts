import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTimestampInput {

  @Field({nullable: true})
  description?: string;
  
  @Field({nullable: true})
  author?: string;

  @Field({nullable: true})
  fileName?: string;

  @Field({nullable: true})
  url: string;

  // //   Markers M-1

  @Field(() => Int)
  markerId: number;
}
