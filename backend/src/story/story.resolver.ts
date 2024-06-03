import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { Story } from './entities/story.entity';
import { CreateStoryInput } from './dto/create-story.input';
import { UpdateStoryInput } from './dto/update-story.input';
import { CreateStoryWithBlocksInput } from './dto/create-story-with-blocks.input';
import { UpdateStoryWithBlocksInput } from './dto/update-story-with-blocks.input';

@Resolver(() => Story)
export class StoryResolver {
  constructor(private readonly storyService: StoryService) {}

  @Mutation(() => Story)
  createStory(@Args('createStoryInput') createStoryInput: CreateStoryInput) {
    return this.storyService.create(createStoryInput);
  }

  @Mutation(() => Story)
  createStoryWithBlocks(@Args('createStoryWithBlocksInput') createStoryWithBlocksInput: CreateStoryWithBlocksInput) {
    return this.storyService.createStoryWithBlocksProperties(createStoryWithBlocksInput);
  } 

  @Query(() => [Story], { name: 'stories' })
  findAll() {
    return this.storyService.findAll();
  }

  @Query(() => Story, { name: 'story' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.storyService.findOne(id);
  }

  @Mutation(() => Story)
  updateStory(@Args('updateStoryInput') updateStoryInput: UpdateStoryInput) {
    return this.storyService.update(updateStoryInput.id, updateStoryInput);
  }

  @Mutation(() => Story)
  updateStoryWithBlocks(@Args('updateStoryWithBlocksInput') updateStoryWithBlocksInput: UpdateStoryWithBlocksInput) {
    return this.storyService.updateWithBlocks(updateStoryWithBlocksInput);
  }

  @Mutation(() => Story)
  removeStory(@Args('id', { type: () => Int }) id: number) {
    return this.storyService.remove(id);
  }
}
