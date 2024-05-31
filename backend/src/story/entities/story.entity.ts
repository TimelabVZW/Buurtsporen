import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Block } from 'src/block/entities/block.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
@InputType('StoryInput')
@ObjectType()

export class Story {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  title: string;

  @Column({ unique: true })
  @Field()
  slug: string;

  @Column()
  @Field()
  createdAt: Date;

  //1-M blocks
  @OneToMany(() => Block, (block) => block.story)
  @Field(() => [Block], { nullable: true })
  blocks?: Block[];
}
