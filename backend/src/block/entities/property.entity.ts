import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Story } from 'src/story/entities/story.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Block } from './block.entity';


@Entity()
@InputType('PropertyInput')
@ObjectType()

export class Property {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  value: string;

  @Column()
  @Field()
  type: string;

  @Column()
  @Field()
  createdAt: Date;

  //M-1 block

  @Column()
  @Field(() => Int)
  blockId: number;

  @ManyToOne(() => Block, (block) => block.properties, {
    onDelete: 'CASCADE',
  })
  @Field(() => Block)
  block: Block;
}
