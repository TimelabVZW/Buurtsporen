import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateStorymarkerInput } from './dto/create-storymarker.input';
import { UpdateAnchorStorymarkerInput } from './dto/update-anchor-storymarker.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storymarker } from './entities/storymarker.entity';
import { MarkerService } from 'src/marker/marker.service';
import { StoryService } from 'src/story/story.service';
import { Marker } from 'src/marker/entities/marker.entity';
import { Story } from 'src/story/entities/story.entity';

@Injectable()
export class StorymarkerService {
  constructor(
  @InjectRepository(Storymarker)
  private storyMarkerRepository: Repository<Storymarker>,
  @Inject(forwardRef(() => MarkerService))
  private markerService: MarkerService,
  @Inject(forwardRef(() => StoryService))
  private storyService: StoryService,
) {}
  //   CREATE
  
  create(createStorymarkerInput: CreateStorymarkerInput): Promise<Storymarker> {
    const newStory = this.storyMarkerRepository.create(createStorymarkerInput);
    return this.storyMarkerRepository.save(newStory);
  }
  
  //   READ
  
  findAll(): Promise<Storymarker[]> {
    return this.storyMarkerRepository.find({ relations: ['story', 'marker'] });
  }
  
  findOne(id: number): Promise<Storymarker> {
    return this.storyMarkerRepository.findOne({
      where: { id },
      relations: ['blocks', 'blocks.properties'],
    });
  }

  getMarker(markerId: number): Promise<Marker> {
    return this.markerService.findOne(markerId);
  }

  getStory(storyId: number): Promise<Story> {
    return this.storyService.findOne(storyId);
  }
  
  //   UPDATE
      
  updateAnchor(id: number, updateAnchorStorymarkerInput: UpdateAnchorStorymarkerInput): Promise<Storymarker> {
    let oldStory = this.storyMarkerRepository.findOne({
      where: { id },
    });
  
    return this.storyMarkerRepository.save({...oldStory, ...updateAnchorStorymarkerInput});
  }

  //   DELETE
  
  remove(id: number) {
    return this.storyMarkerRepository.delete(id);
  }
}
