import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateStoryInput } from './dto/create-story.input';
import { UpdateStoryInput } from './dto/update-story.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { Repository } from 'typeorm';
import { BlockService } from 'src/block/block.service';
import { CreateStoryWithBlocksInput } from './dto/create-story-with-blocks.input';


// 8468
@Injectable()
export class StoryService {
  constructor(
  @InjectRepository(Story)
  private storyRepository: Repository<Story>,
  @Inject(forwardRef(() => BlockService))
  private blockService: BlockService
) {}

//   CREATE

create(createStoryInput: CreateStoryInput): Promise<Story> {
  const newStory = this.storyRepository.create({...createStoryInput, createdAt: new Date()});
  return this.storyRepository.save(newStory);
}

  // nested forEach, kind of meh but not meant to be called a lot (only when importing/duplicating pages).
async createStoryWithBlocksProperties(createStoryWithBlocksInput: CreateStoryWithBlocksInput): Promise<Story> {
  const {blocks, ...createStoryInput} = createStoryWithBlocksInput;

  const newStory = await this.create(createStoryInput);
  blocks.forEach(async (block) => {
    await this.blockService.createBlockWithProperties({...block, storyId: newStory.id})
  });
  const resultStory = this.findOne(newStory.id);
  
  return resultStory;
}

//   READ

findAll(): Promise<Story[]> {
  return this.storyRepository.find({ relations: ['blocks', 'blocks.properties'] });
}

findOne(id: number): Promise<Story> {
  return this.storyRepository.findOne({
    where: { id },
    relations: ['blocks', 'blocks.properties'],
  });
}

//   UPDATE
    
update(id: number, updateStoryInput: UpdateStoryInput): Promise<Story> {
  let oldStory = this.storyRepository.findOne({
    where: { id },
  });

  return this.storyRepository.save({...oldStory, ...updateStoryInput});
}

//   DELETE

remove(id: number) {
  return this.storyRepository.delete(id);
}
}