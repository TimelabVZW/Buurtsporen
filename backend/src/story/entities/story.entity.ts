import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Block } from 'src/block/entities/block.entity';
import { Storymarker } from 'src/storymarker/entities/storymarker.entity';
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

  @Column({nullable: true})
  @Field({nullable: true})
  description?: string;

  @Column({nullable: true})
  @Field({nullable: true})
  author?: string;

  @Column({nullable: true})
  @Field({nullable: true})
  imageUrl?: string;

  @Column({ default: false })
  @Field()
  isHighlighted: boolean;

  @Column({ default: false })
  @Field()
  isPublished: boolean;

  @Column()
  @Field()
  createdAt: Date;

  //1-M blocks
  @OneToMany(() => Block, (block) => block.story)
  @Field(() => [Block], { nullable: true })
  blocks?: Block[];

  //1-M storyMarkers
  @OneToMany(() => Storymarker, (storyMarkers) => storyMarkers.story)
  @Field(() => [Storymarker], { nullable: true })
  storyMarkers?: Storymarker[];
}
