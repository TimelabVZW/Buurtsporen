import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { MarkerService } from './marker.service';
import { Marker } from './entities/marker.entity';
import { CreateMarkerInput } from './dto/create-marker.input';
import { UpdateMarkerInput } from './dto/update-marker.input';
import { Layer } from 'src/layer/entities/layer.entity';
import { CreateMarkerWithCoordsInput } from './dto/create-marker-with-coords';

@Resolver(() => Marker)
export class MarkerResolver {
  constructor(private readonly markerService: MarkerService) {}

  @Mutation(() => Marker)
  createMarker(@Args('createMarkerInput') createMarkerInput: CreateMarkerInput) {
    return this.markerService.create(createMarkerInput);
  }

  @Mutation(() => [Marker] )
  createMarkers(@Args('createMarkerInputs', { type: () => [CreateMarkerInput] }) createMarkerInputs: CreateMarkerInput[]): Promise<Marker[]> {
    return this.markerService.createMany(createMarkerInputs);
  }

  @Mutation(() => [Marker] )
  createMarkersWithCoords(@Args('createMarkerWithCoordsInputs', { type: () => [CreateMarkerWithCoordsInput] }) createMarkerWithCoordsInputs: CreateMarkerWithCoordsInput[]): Promise<Marker[]> {
    return this.markerService.createManyWithCoords(createMarkerWithCoordsInputs);
  }

  @Query(() => [Marker], { name: 'markers' })
  findAll() {
    return this.markerService.findAll();
  }

  @Query(() => Marker, { name: 'marker' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.markerService.findOne(id);
  }

  @ResolveField(() => Layer)
  layer(@Parent() marker: Marker): Promise<Layer> {
    return this.markerService.getLayer(marker.layerId);
  }

  @Mutation(() => Marker)
  updateMarker(@Args('updateMarkerInput') updateMarkerInput: UpdateMarkerInput) {
    return this.markerService.update(updateMarkerInput.id, updateMarkerInput);
  }

  @Mutation(() => Marker)
  removeMarker(@Args('id', { type: () => Int }) id: number) {
    return this.markerService.remove(id);
  }
}
