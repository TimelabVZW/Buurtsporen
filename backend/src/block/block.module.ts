import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Property } from './entities/property.entity';
import { BlockController } from './block.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Block]),
    TypeOrmModule.forFeature([Property]),
  ],
  providers: [
    BlockResolver, 
    BlockService, 
    PropertyService
  ],
  controllers: [BlockController],
  exports:[BlockService]
})
export class BlockModule {}
