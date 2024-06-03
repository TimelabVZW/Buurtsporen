import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class UpdateBlockPropertyInput {
  @Field(() => Int)
  id: number;
  
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  type?: string;
}

@InputType()
export class UpdateBlockWithPropertiesInput {
  @Field(() => Int)
  id: number;

  @Field(() => [UpdateBlockPropertyInput], {nullable: true})
  properties?: UpdateBlockPropertyInput[];

  @Field({ nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  position?: number;
}
