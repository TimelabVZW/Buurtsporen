import { Module, forwardRef } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { BlockModule } from 'src/block/block.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story]),
    forwardRef(() => BlockModule),
  ],
  providers: [StoryResolver, StoryService]
})

export class StoryModule {}