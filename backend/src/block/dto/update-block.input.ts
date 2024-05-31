import { CreateBlockInput } from './create-block.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBlockInput extends PartialType(CreateBlockInput) {
  @Field(() => Int)
  id: number;
  
  @Field({ nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  position?: number;
}
