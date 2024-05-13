import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class TimestampPaginateQuery {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => String, 
  { defaultValue: 'createdAt' })
  sortBy: string;

  @Field(() => String, 
  { defaultValue: 'DESC' })
  sortDirection: 'ASC' | 'DESC';
  
  @Field(() => String, 
  { nullable: true })
  description?: string;

  @Field(() => String, 
  { nullable: true })
  id?: string;
}