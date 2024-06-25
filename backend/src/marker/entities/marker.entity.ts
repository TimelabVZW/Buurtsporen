import {
  ObjectType,
  Field,
  Int,
  InputType,
} from '@nestjs/graphql';
import { Coordinate } from 'src/coordinate/entities/coordinate.entity';
import { Icon } from 'src/icon/entities/icon.entity';
import { Layer } from 'src/layer/entities/layer.entity';
import { Storymarker } from 'src/storymarker/entities/storymarker.entity';
import { Timestamp } from 'src/timestamp/entities/timestamp.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@InputType('MarkerInput')
@ObjectType()

export class Marker {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  createdAt: Date;
  
  @Column({nullable: true})
  @Field({nullable: true})
  author?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  color?: string;

 //   Layer M-1

  @Column()
  @Field(() => Int)
  layerId: number;

  @ManyToOne(() => Layer, (layer) => layer.markers, {
    onDelete: 'CASCADE',
  })
  @Field(() => Layer)
  layer: Layer;

  //   Icon M-1
 
   @Column({ nullable: true })
   @Field(() => Int, { nullable: true })
   iconId: number;
 
   @ManyToOne(() => Icon, (icon) => icon.markers, {
     onDelete: 'SET NULL',
     nullable: true,
   })
   @Field(() => Icon, { nullable: true })
   icon: Icon;

 //   Coordinates 1-M
  @OneToMany(() => Coordinate, (coordinate) => coordinate.marker)
  @Field(() => [Coordinate], { nullable: true })
  coordinates?: Coordinate[];

  //   Articles 1-M

  @OneToMany(() => Timestamp, (timestamp) => timestamp.marker)
  @Field(() => [Timestamp], { nullable: true })
  timestamps?: Timestamp[];

  //1-M storyMarkers
  @OneToMany(() => Storymarker, (storyMarkers) => storyMarkers.marker)
  @Field(() => [Storymarker], { nullable: true })
  storyMarkers?: Storymarker[];
}