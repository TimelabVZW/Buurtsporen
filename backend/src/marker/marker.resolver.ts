import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { MarkerService } from './marker.service';
import { Marker } from './entities/marker.entity';
import { CreateMarkerInput } from './dto/create-marker.input';
import { UpdateMarkerInput } from './dto/update-marker.input';
import { PaginateQuery } from './dto/paginate-query';
import { Layer } from 'src/layer/entities/layer.entity';
import { CreateMarkerWithCoordsInput } from './dto/create-marker-with-coords';
import { Icon } from 'src/icon/entities/icon.entity';

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

  @Query(() => [Marker], { name: 'paginatedMarkers' })
  async findPaginatedMarkers(
    @Args('query', { type: () => PaginateQuery }) query: PaginateQuery,
  ): Promise<Marker[]> {
    const { page, limit, sortBy, sortDirection, name, author, description, type, id } = query;
    return this.markerService.findPaginatedMarkers(page, limit, sortBy, sortDirection, name, author, description, type, id);
  }

  @Query(() => Marker, { name: 'marker' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.markerService.findOne(id);
  }

  @ResolveField(() => Layer)
  layer(@Parent() marker: Marker): Promise<Layer> {
    return this.markerService.getLayer(marker.layerId);
  }

  @ResolveField(() => Icon)
  icon(@Parent() marker: Marker): Promise<Icon> {
    return this.markerService.getIcon(marker.iconId);
  }

  @Mutation(() => Icon)
  updateMarker(@Args('updateMarkerInput') updateMarkerInput: UpdateMarkerInput) {
    return this.markerService.update(updateMarkerInput.id, updateMarkerInput);
  }

  @Mutation(() => Marker)
  removeMarker(@Args('id', { type: () => Int }) id: number) {
    return this.markerService.remove(id);
  }
}
