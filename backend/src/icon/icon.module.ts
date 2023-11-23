import { Module, forwardRef } from '@nestjs/common';
import { IconService } from './icon.service';
import { IconResolver } from './icon.resolver';
import { TimestampController } from 'src/timestamp/timestamp.controller';
import { IconController } from './icon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Icon } from './entities/icon.entity';
import { MarkerModule } from 'src/marker/marker.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Icon]),
  forwardRef(() => MarkerModule),
],
  providers: [IconResolver, IconService],
  controllers: [IconController],
  exports: [IconService],
})
export class IconModule {}
