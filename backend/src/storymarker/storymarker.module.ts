import { Module, forwardRef } from '@nestjs/common';
import { StorymarkerService } from './storymarker.service';
import { StorymarkerResolver } from './storymarker.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storymarker } from './entities/storymarker.entity';
import { MarkerModule } from 'src/marker/marker.module';
import { StoryModule } from 'src/story/story.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Storymarker]),
    forwardRef(() => MarkerModule),
    forwardRef(() => StoryModule),
  ],
  exports: [StorymarkerService],
  providers: [StorymarkerResolver, StorymarkerService]
})
export class StorymarkerModule {}
