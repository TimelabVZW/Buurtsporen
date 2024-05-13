import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTimestampInput } from './dto/create-timestamp.input';
import { UpdateTimestampInput } from './dto/update-timestamp.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Timestamp } from './entities/timestamp.entity';
import { Equal, ILike, Repository } from 'typeorm';
import { MarkerService } from 'src/marker/marker.service';
import { Marker } from 'src/marker/entities/marker.entity';

@Injectable()
export class TimestampService {
  constructor(
    @InjectRepository(Timestamp)
    private timestampRepository: Repository<Timestamp>,
    @Inject(forwardRef(() => MarkerService))
    private markerService: MarkerService,
  ) {}

  //   CREATE

  create(createTimestampInput: CreateTimestampInput): Promise<Timestamp> {
    const newTimestamp = this.timestampRepository.create({...createTimestampInput, createdAt: new Date()});
    return this.timestampRepository.save(newTimestamp);
  }

  //   READ

  findAll(): Promise<Timestamp[]> {
    return this.timestampRepository.find({ relations: ['marker', 'marker.layer'] });
  }

  findOne(id: number): Promise<Timestamp> {
    return this.timestampRepository.findOne({
      where: { id },
      relations: ['marker', 'marker.layer'],
    });
  }

  getMarker(markerId: number): Promise<Marker> {
    return this.markerService.findOne(markerId);
  }

  async findPaginatedTimestamps(
    page: number,
    limit: number,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
    description?: string,
    id?: string,
  ): Promise<Timestamp[]> {
    const skip = (page - 1) * limit;
    
    const filter: any = {};

    if (description) {
      filter.description = ILike(`%${description}%`);
    }

    if (id) {
      filter.id = Equal(id);
    }

    return this.timestampRepository.find({
      skip,
      take: limit,
      order: {
        [sortBy]: sortDirection,
      },
      where: filter,
    });
  }

  //   UPDATE

  update(id: number, updateTimestampInput: UpdateTimestampInput) {
    return `This action updates a #${id} marker`;
  }

  //   DELETE

  remove(id: number) {
    return this.timestampRepository.delete(id);
  }
}
