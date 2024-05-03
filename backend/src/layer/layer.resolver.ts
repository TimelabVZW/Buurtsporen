import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LayerService } from './layer.service';
import { Layer } from './entities/layer.entity';
import { CreateLayerInput } from './dto/create-layer.input';
import { UpdateLayerInput } from './dto/update-layer.input';

@Resolver(() => Layer)
export class LayerResolver {
  constructor(private readonly layerService: LayerService) {}

  @Mutation(() => Layer)
  createLayer(@Args('createLayerInput') createLayerInput: CreateLayerInput) {
    return this.layerService.create(createLayerInput);
  }

  @Query(() => [Layer], { name: 'layers' })
  findAll() {
    return this.layerService.findAll();
  }

  @Query(() => Layer, { name: 'layer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.layerService.findOne(id);
  }

@Query(() => [Layer], { name: 'layersByIds' })
findLayersByIds(
  @Args('ids', { type: () => [Int]}) ids: number[],
  @Args('onlyImported', { type: () => Boolean, nullable: false }) onlyImported: boolean,
): Promise<Layer[]> {
  if (ids.length === 0) {
    return this.layerService.findDefaultShow();
  }
  return this.layerService.findByIds(ids, onlyImported);
}

  @Mutation(() => Layer)
  updateDefaultShow(@Args('updateLayerInput') updateLayerInput: UpdateLayerInput) {
    return this.layerService.updateDefaultShow(updateLayerInput.id, updateLayerInput);
  }

  @Mutation(() => Layer)
  removeLayer(@Args('id', { type: () => Int }) id: number) {
    return this.layerService.remove(id);
  }
}
