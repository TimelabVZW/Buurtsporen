import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  private coordinateQueue: any[] = [];

  enqueueCoordinate(coordinate: any) {
    return this.coordinateQueue.push(coordinate);
  }

  dequeueCoordinate(): any | undefined {
    return this.coordinateQueue.shift();
  }

  isEmpty(): boolean {
    return this.coordinateQueue.length === 0;
  }
}