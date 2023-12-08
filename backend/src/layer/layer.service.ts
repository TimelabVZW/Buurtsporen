import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Layer } from './entities/layer.entity';
import { CreateLayerInput } from './dto/create-layer.input';
import { UpdateLayerInput } from './dto/update-layer.input';

@Injectable()
export class LayerService {
  constructor(
    @InjectRepository(Layer)
    private layerRepository: Repository<Layer>,
  ) {}

  //   CREATE

  create(createLayerInput: CreateLayerInput): Promise<Layer> {
    const newLayer = this.layerRepository.create({...createLayerInput, createdAt: new Date()});
    return this.layerRepository.save(newLayer);
  }

  //   READ

  findAll(): Promise<Layer[]> {
    return this.layerRepository.find({ relations: ['markers', 'markers.coordinates'] });
  }

  findOne(id: number): Promise<Layer> {
    return this.layerRepository.findOne({
      where: { id },
      relations: ['markers', 'markers.coordinates', 'markers.timestamps'],
    });
  }

  //   UPDATE
  
  updateDefaultShow(id: number, updateLayerInput: UpdateLayerInput) {
    let oldLayer = this.layerRepository.findOne({
      where: { id },
    });

    return this.layerRepository.save({...oldLayer, ...updateLayerInput});
  }

  //   DELETE

  remove(id: number) {
    return this.layerRepository.delete(id);
  }
}
