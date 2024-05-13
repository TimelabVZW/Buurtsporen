import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CoordinateService } from 'src/coordinate/coordinate.service';

@Injectable()
export class QueueProcessor {
  constructor(
    private readonly queueService: QueueService,
      @Inject(forwardRef(() => CoordinateService))
      private coordinateService: CoordinateService,
  ) {}

  async processQueue() {
    while (!this.queueService.isEmpty()) {
      const coordinate = this.queueService.dequeueCoordinate();
      if (coordinate) {
        await this.coordinateService.create(coordinate);
      }
    }
  }
}