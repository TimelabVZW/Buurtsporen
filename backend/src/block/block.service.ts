import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateBlockInput } from './dto/create-block.input';
import { UpdateBlockInput } from './dto/update-block.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Repository } from 'typeorm';
import { CreateBlockWithPropertiesInput } from './dto/create-block-with-properties';
import { PropertyService } from './property.service';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @Inject(forwardRef(() => PropertyService))
    private propertyService: PropertyService,
  ) {}

  //   CREATE

  //8468

  create(createBlockInput: CreateBlockInput): Promise<Block> {
    const newBlock = this.blockRepository.create({...createBlockInput, createdAt: new Date()});
    return this.blockRepository.save(newBlock);
  }

  async createBlockWithProperties(createBlockWithPropertiesInput: CreateBlockWithPropertiesInput): Promise<Block> {
    const {properties, ...createBlockInput} = createBlockWithPropertiesInput;
    const newBlock = await this.create(createBlockInput);
    properties.forEach((property: {name: string, value:string, type:string}) => {
      this.propertyService.create({...property, blockId: newBlock.id});
    });
    return this.findOne(newBlock.id);
  }

  //   READ

  findAll(): Promise<Block[]> {
    return this.blockRepository.find({ relations: ['properties', 'story'] });
  }

  findOne(id: number): Promise<Block> {
    return this.blockRepository.findOne({
      where: { id },
      relations: ['properties', 'story'],
    });
  }

  //   UPDATE
  
  update(id: number, updateBlockInput: UpdateBlockInput) {
    let oldBlock = this.blockRepository.findOne({
      where: { id },
    });
    return this.blockRepository.save({...oldBlock, ...updateBlockInput});
  }

  //   DELETE

  remove(id: number) {
    return this.blockRepository.delete(id);
  }
}
