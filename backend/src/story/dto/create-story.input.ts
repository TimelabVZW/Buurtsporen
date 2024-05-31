import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStoryInput {
  @Field()
  title: string;

  @Field()
  slug: string;
}