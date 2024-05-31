import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreatePropertyInput } from './create-property.input';

@InputType()
export class UpdatePropertyInput extends PartialType(CreatePropertyInput) {
  @Field(() => Int)
  id: number;
  
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  type?: string;
}
