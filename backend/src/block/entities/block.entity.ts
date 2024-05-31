import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Story } from 'src/story/entities/story.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from './property.entity';


@Entity()
@InputType('BlockInput')
@ObjectType()

export class Block {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  type: string;

  @Column()
  @Field(() => Int)
  position: number;

  @Column()
  @Field()
  createdAt: Date;

  //M-1 story

  @Column()
  @Field(() => Int)
  storyId: number;

  @ManyToOne(() => Story, (story) => story.blocks, {
    onDelete: 'CASCADE',
  })
  @Field(() => Story)
  story: Story;

  //1-M properties
  @OneToMany(() => Property, (property) => property.block)
  @Field(() => [Property], { nullable: true })
  properties?: Property[];
}
