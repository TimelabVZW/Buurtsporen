import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateIconInput {
  @Field()
  name: string;

  @Field()
  fileName: string;

  @Field()
  url: string;
}
