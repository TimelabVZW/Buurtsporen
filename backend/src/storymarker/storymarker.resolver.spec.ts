import { Test, TestingModule } from '@nestjs/testing';
import { StorymarkerResolver } from './storymarker.resolver';
import { StorymarkerService } from './storymarker.service';

describe('StorymarkerResolver', () => {
  let resolver: StorymarkerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorymarkerResolver, StorymarkerService],
    }).compile();

    resolver = module.get<StorymarkerResolver>(StorymarkerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
