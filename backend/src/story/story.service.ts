import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateStoryInput } from './dto/create-story.input';
import { UpdateStoryInput } from './dto/update-story.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { Repository } from 'typeorm';
import { BlockService } from 'src/block/block.service';
import { CreateStoryWithBlocksInput } from './dto/create-story-with-blocks.input';
import { UpdateStoryWithBlocksInput } from './dto/update-story-with-blocks.input';
import { StorymarkerService } from 'src/storymarker/storymarker.service';
import { Storymarker } from 'src/storymarker/entities/storymarker.entity';


// 8468
@Injectable()
export class StoryService {
  constructor(
  @InjectRepository(Story)
  private storyRepository: Repository<Story>,
  @Inject(forwardRef(() => BlockService))
  private blockService: BlockService,
  @Inject(forwardRef(() => StorymarkerService))
  private storyMarkerService: StorymarkerService,
) {}

//   CREATE

create(createStoryInput: CreateStoryInput): Promise<Story> {
  const newStory = this.storyRepository.create({...createStoryInput, createdAt: new Date()});
  return this.storyRepository.save(newStory);
}

  // nested forEach, kind of meh but not meant to be called a lot (only when importing/duplicating pages).
async createStoryWithBlocksProperties(createStoryWithBlocksInput: CreateStoryWithBlocksInput): Promise<Story> {
  const {blocks, markers, ...createStoryInput} = createStoryWithBlocksInput;

  const newStory = await this.create(createStoryInput);

  if (markers) {
    markers.forEach((marker) => {
      this.storyMarkerService.create({markerId: marker.markerId, storyId: newStory.id, anchor: marker.anchor? marker.anchor : ''})
    })
  }

  blocks.forEach(async (block) => {
    await this.blockService.createBlockWithProperties({...block, storyId: newStory.id})
  });
  const resultStory = this.findOne(newStory.id);
  
  return resultStory;
}

//   READ

findAll(): Promise<Story[]> {
  return this.storyRepository.find({ relations: ['blocks', 'blocks.properties', 'storyMarkers'] });
}

findOne(id: number): Promise<Story> {
  return this.storyRepository.findOne({
    where: { id },
    relations: ['blocks', 'blocks.properties', 'storyMarkers'],
  });
}

//   UPDATE
    
update(id: number, updateStoryInput: UpdateStoryInput): Promise<Story> {
  let oldStory = this.storyRepository.findOne({
    where: { id },
  });

  return this.storyRepository.save({...oldStory, ...updateStoryInput});
}
  
async updateIsPublished(id: number) {
  let oldLayer = await this.storyRepository.findOne({
    where: { id },
  });

  // Cant have a layer be highlighted if it is not published anymore
  if (oldLayer.isPublished) return this.storyRepository.save({...oldLayer, isPublished: false, isHighlighted: false});

  return this.storyRepository.save({...oldLayer, isPublished: !oldLayer.isPublished})
}
  
async updateIsHighlighted(id: number) {
  let oldLayer = await this.storyRepository.findOne({
    where: { id },
  });

  // Cant have a layer be highlighted if it is not published yet
  if (!oldLayer.isHighlighted) return this.storyRepository.save({...oldLayer, isHighlighted: true, isPublished: true});

  return this.storyRepository.save({...oldLayer, isHighlighted: false});
}

// nested forEach, cant work around it.
async updateWithBlocks(updateStoryWithBlocksInput: UpdateStoryWithBlocksInput): Promise<Story> {
  let {blocks, markers, ...updateStoryInput} = updateStoryWithBlocksInput;
  await this.update(updateStoryInput.id, updateStoryInput);

  if (blocks) {
    blocks.forEach(async (block) => {
      await this.blockService.updateWithProperties(block);
    });
  }

  // get all the storyMarkers that are removed from the array and delete them, at the same time get all new markers and add them.
  if (markers) {
    let oldStory = await this.findOne(updateStoryInput.id);
    let removedMarkers = oldStory.storyMarkers.filter(storyMarker => !markers.some(marker => marker.markerId === storyMarker.markerId));
    let addedMarkers = markers.filter(marker => !oldStory.storyMarkers.some(storyMarker => marker.markerId === storyMarker.markerId));
    let changedMarkers = markers.filter(marker => oldStory.storyMarkers.some(storyMarker => marker.anchor != storyMarker.anchor && marker.id === storyMarker.id));
  
    removedMarkers.forEach(async (marker) => {
      await this.storyMarkerService.remove(marker.id);
    })
  
    addedMarkers.forEach(async (marker) => {
      await this.storyMarkerService.create({
        storyId: updateStoryInput.id,
        markerId: marker.markerId,
        anchor: marker.anchor? marker.anchor : ''
      })
    })

    changedMarkers.forEach(async (marker) => {
      if (marker.id) {
        this.storyMarkerService.updateAnchor(marker.id, {...marker, id: marker.id})
      }
    })
  }


  return this.findOne(updateStoryInput.id);
}

//   DELETE

remove(id: number) {
  return this.storyRepository.delete(id);
}
}