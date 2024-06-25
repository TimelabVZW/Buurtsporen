import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marker } from './entities/marker.entity';
import { MarkerService } from './marker.service';
import { MarkerResolver } from './marker.resolver';
import { LayerModule } from 'src/layer/layer.module';
import { TimestampModule } from 'src/timestamp/timestamp.module';
import { CoordinateModule } from 'src/coordinate/coordinate.module';
import { IconModule } from 'src/icon/icon.module';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';
import { StorymarkerModule } from 'src/storymarker/storymarker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Marker]),
    LayerModule,
    forwardRef(() => TimestampModule),
    forwardRef(() => CoordinateModule),
    forwardRef(() => IconModule),
    forwardRef(() => StorymarkerModule),
  ],
  exports: [MarkerService],
  providers: [MarkerResolver, MarkerService, QueueService, QueueProcessor],
})
export class MarkerModule {}