import { Injectable } from '@nestjs/common';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  //   CREATE

  create(createBlockInput: CreatePropertyInput): Promise<Property> {
    const newProperty = this.propertyRepository.create({...createBlockInput, createdAt: new Date()});
    return this.propertyRepository.save(newProperty);
  }

  //   READ

  findAll(): Promise<Property[]> {
    return this.propertyRepository.find({ relations: ['properties', 'story'] });
  }

  findOne(id: number): Promise<Property> {
    return this.propertyRepository.findOne({
      where: { id },
      relations: ['properties', 'story'],
    });
  }

  //   UPDATE
  
  update(id: number, updatePropertyInput: UpdatePropertyInput) {
    let oldProperty = this.propertyRepository.findOne({
      where: { id },
    });

    return this.propertyRepository.save({...oldProperty, ...updatePropertyInput});
  }

  //   DELETE

  remove(id: number) {
    return this.propertyRepository.delete(id);
  }
}
