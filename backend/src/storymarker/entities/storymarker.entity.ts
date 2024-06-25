import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Marker } from 'src/marker/entities/marker.entity';
import { Story } from 'src/story/entities/story.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
@InputType('StorymarkerInput')
@ObjectType()
export class Storymarker {

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({nullable: true})
  @Field({nullable: true})
  anchor: string;

  //   Story M-1
   @Column()
   @Field(() => Int)
   storyId: number;
 
   @ManyToOne(() => Story, (story) => story.storyMarkers, {
     onDelete: 'CASCADE',
   })
   @Field(() => Story)
   story: Story;

   //   Marker M-1
    @Column()
    @Field(() => Int)
    markerId: number;
  
    @ManyToOne(() => Marker, (marker) => marker.storyMarkers, {
      onDelete: 'CASCADE',
    })
    @Field(() => Marker)
    marker: Marker;
}
