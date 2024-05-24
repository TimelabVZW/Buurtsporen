import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMarkerInput {
  
  @Field({ nullable: true })
  type?: string;

  // Properties

  @Field()
  name?: string;

  @Field()
  createdAt: Date;
  
  @Field({nullable: true})
  author?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  color?: string;

  // //   Icon M-1

  @Field({ nullable: true })
  iconId?: number;

  // //   Layer M-1

  @Field(() => Int)
  layerId: number;
}
