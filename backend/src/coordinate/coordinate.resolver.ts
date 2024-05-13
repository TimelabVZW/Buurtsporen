import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CoordinateService } from './coordinate.service';
import { Coordinate } from './entities/coordinate.entity';
import { CreateCoordinateInput } from './dto/create-coordinate.input';
import { UpdateCoordinateInput } from './dto/update-coordinate.input';
import { Marker } from 'src/marker/entities/marker.entity';

@Resolver(() => Coordinate)
export class CoordinateResolver {
  constructor(
    private readonly coordinateService: CoordinateService,
  ) {}

  @Mutation(() => Coordinate)
  createCoordinate(@Args('createCoordinateInput') createCoordinateInput: CreateCoordinateInput) {
    return this.coordinateService.create(createCoordinateInput);
  }

  @Query(() => [Coordinate], { name: 'coordinates' })
  findAll() {
    return this.coordinateService.findAll();
  }

  @Query(() => Coordinate, { name: 'coordinate' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coordinateService.findOne(id);
  }

  @ResolveField(() => Marker)
  marker(@Parent() coordinate: Coordinate): Promise<Marker> {
    return this.coordinateService.getMarker(coordinate.markerId);
  }

  @Mutation(() => Coordinate)
  updateCoordinate(@Args('updateCoordinateInput') updateCoordinateInput: UpdateCoordinateInput) {
    return this.coordinateService.update(updateCoordinateInput.id, updateCoordinateInput);
  }

  @Mutation(() => Coordinate)
  removeCoordinate(@Args('id', { type: () => Int }) id: number) {
    return this.coordinateService.remove(id);
  }
}
