import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Marker } from 'src/marker/entities/marker.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
@InputType('IconInput')
@ObjectType()
export class Icon {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  fileName: string;

  @Column()
  @Field()
  url: string;

  //   Marker 1-M

  @OneToMany(() => Marker, (marker) => marker.icon)
  @Field(() => [Marker], { nullable: true })
  markers?: Marker[];
}
