import { Test, TestingModule } from '@nestjs/testing';
import { StorymarkerService } from './storymarker.service';

describe('StorymarkerService', () => {
  let service: StorymarkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorymarkerService],
    }).compile();

    service = module.get<StorymarkerService>(StorymarkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
