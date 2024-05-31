import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Property } from './entities/property.entity';

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
  exports:[
    BlockService,
  ]
})
export class BlockModule {}
