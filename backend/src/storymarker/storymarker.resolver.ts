import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { StorymarkerService } from './storymarker.service';
import { Storymarker } from './entities/storymarker.entity';
import { CreateStorymarkerInput } from './dto/create-storymarker.input';
import { UpdateAnchorStorymarkerInput } from './dto/update-anchor-storymarker.input';
import { Marker } from 'src/marker/entities/marker.entity';
import { Story } from 'src/story/entities/story.entity';

@Resolver(() => Storymarker)
export class StorymarkerResolver {
  constructor(private readonly storymarkerService: StorymarkerService) {}

  @Mutation(() => Storymarker)
  createStorymarker(@Args('createStorymarkerInput') createStorymarkerInput: CreateStorymarkerInput) {
    return this.storymarkerService.create(createStorymarkerInput);
  }

  @Query(() => [Storymarker], { name: 'storymarkers' })
  findAll() {
    return this.storymarkerService.findAll();
  }

  @Query(() => Storymarker, { name: 'storymarker' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.storymarkerService.findOne(id);
  }

  @ResolveField(() => Marker)
  marker(@Parent() storyMarker: Storymarker): Promise<Marker> {
    return this.storymarkerService.getMarker(storyMarker.markerId);
  }

  @ResolveField(() => Story)
  story(@Parent() storyMarker: Storymarker): Promise<Story> {
    return this.storymarkerService.getStory(storyMarker.storyId);
  }

  @Mutation(() => Storymarker)
  updateAnchorStorymarker(@Args('updateStorymarkerInput') updateStorymarkerInput: UpdateAnchorStorymarkerInput) {
    return this.storymarkerService.updateAnchor(updateStorymarkerInput.id, updateStorymarkerInput);
  }

  @Mutation(() => Storymarker)
  removeStorymarker(@Args('id', { type: () => Int }) id: number) {
    return this.storymarkerService.remove(id);
  }
}
