import { InputType, Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
@InputType()
export class CreateLayerInput {
  @Column({ unique: true })
  @Field()
  name: string;

  @Column()
  @Field()
  private: boolean;
}
