import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateMarkerInput } from './dto/create-marker.input';
import { UpdateMarkerInput } from './dto/update-marker.input';
import { CreateMarkerWithCoordsInput } from './dto/create-marker-with-coords';
import { InjectRepository } from '@nestjs/typeorm';
import { Marker } from './entities/marker.entity';
import { Equal, ILike, Repository } from 'typeorm';
import { LayerService } from 'src/layer/layer.service';
import { IconService } from './../icon/icon.service';
import { CoordinateService } from './../coordinate/coordinate.service';
import { Layer } from 'src/layer/entities/layer.entity';
import bounds from './bounds';
import { Icon } from 'src/icon/entities/icon.entity';
var classifyPoint = require("robust-point-in-polygon");

@Injectable()
export class MarkerService {
  constructor(
    @InjectRepository(Marker)
    private markerRepository: Repository<Marker>,
    @Inject(forwardRef(() => IconService))
    private iconService: IconService,
    @Inject(forwardRef(() => LayerService))
    private layerService: LayerService,
    @Inject(forwardRef(() => CoordinateService))
    private coordinateService: CoordinateService,
  ) {}

  //   CREATE

  create(createMarkerInput: CreateMarkerInput): Promise<Marker> {
    const newMarker = this.markerRepository.create({...createMarkerInput, createdAt: new Date()});
    return this.markerRepository.save(newMarker);
  }

  createMany(createMarkerInputs: CreateMarkerInput[]): Promise<Marker[]> {
    let markers = this.markerRepository.create(createMarkerInputs.map((createMarkerInput) => ({...createMarkerInput, createdAt: new Date()})));
    return this.markerRepository.save(markers);
  } 

  createManyWithCoords(createMarkerWithCoordsInputs: CreateMarkerWithCoordsInput[]): Promise<Marker[]> {
    createMarkerWithCoordsInputs.map(async (createMarkerWithCoordsInput) => {
      let valid = true;
      // check if marker is within map bounds
      createMarkerWithCoordsInput.coords.forEach(coord => {
        if (classifyPoint(bounds, coord) === 1) {
          valid = false;
        }
      });
      if (valid) {
        const newMarker = await this.create({...createMarkerWithCoordsInput, createdAt: new Date()})
        const marker = await this.findOne(newMarker.id);
        createMarkerWithCoordsInput.coords.forEach((coord) => {
          this.coordinateService.create({latitude: coord[0], longitude: coord[1], markerId: marker.id })
        })
      }
    })
    return this.findAllWithLayerId(createMarkerWithCoordsInputs[0].layerId);
  }

  //   READ

  findAll(): Promise<Marker[]> {
    return this.markerRepository.find({ relations: ['layer', 'coordinates', 'timestamps', 'icon'] });
  }

  findAllWithLayerId(layerId: number): Promise<Marker[]> {
    return this.markerRepository.find({ relations: ['layer', 'coordinates',  'timestamps', 'icon'], where: {layerId} });
  }

  async findPaginatedMarkers(
    page: number,
    limit: number,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
    name?: string,
    author?: string,
    description?: string,
    type?: string,
    id?: string,
  ): Promise<Marker[]> {
    const skip = (page - 1) * limit;
    
    const filter: any = {};

    if (name) {
      filter.name = ILike(`%${name}%`);
    }

    if (author) {
      filter.author = ILike(`%${author}%`);
    }

    if (description) {
      filter.description = ILike(`%${description}%`);
    }

    if (type) {
      filter.type = ILike(`%${type}%`);
    }

    if (id) {
      filter.id = Equal(id);
    }

    return this.markerRepository.find({
      skip,
      take: limit,
      order: {
        [sortBy]: sortDirection,
      },
      where: filter,
    });
  }

  findOne(id: number): Promise<Marker> {
    return this.markerRepository.findOne({
      where: { id },
      relations: ['layer', 'coordinates', 'timestamps'],
    });
  }

  getLayer(layerId: number): Promise<Layer> {
    return this.layerService.findOne(layerId);
  }

  getIcon(iconId: number): Promise<Icon> {
    return this.iconService.findOne(iconId);
  }

  //   UPDATE
  
  async setMarkerIconId(id: number, iconId: number): Promise<Marker> {
    let marker = await this.markerRepository.findOne({
      where: { id },
    });
    
    return this.markerRepository.save({...marker, iconId});
  }

  //   DELETE

  remove(id: number) {
    return this.markerRepository.delete(id);
  }
}
