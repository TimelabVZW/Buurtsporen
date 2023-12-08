import {
  ObjectType,
  Field,
  Int,
  InputType,
} from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Marker } from 'src/marker/entities/marker.entity';

@Entity()
@InputType('LayerInput')
@ObjectType()
export class Layer {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column()
  @Field()
  createdAt: Date;

  @Column()
  @Field()
  private: boolean;

  @Column({ default: false })
  @Field()
  defaultShow: boolean;

  // //   Markers 1-M
  @OneToMany(() => Marker, (marker) => marker.layer)
  @Field(() => [Marker], { nullable: true })
  markers?: Marker[];
}