import { InputType, Field, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';
@InputType()
export class CreatePropertyInput {
    @Field()
    name: string;
  
    @Field()
    value: string;
  
    @Field()
    type: string;
  
    //M-1 block
  
    @Field(() => Int)
    blockId: number;
}
