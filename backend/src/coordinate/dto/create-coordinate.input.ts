import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreateCoordinateInput {

  @Column()
  @Field(() => Float)
  longitude: number;

  @Column()
  @Field(() => Float)
  latitude: number;

  // //   Markers M-1

  @Column()
  @Field(() => Int)
  markerId: number;
}
