import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Aggregations for todos' })
export class AggregationsType {
  @Field(() => Int, { description: 'Total number of todos' })
  total: number;

  @Field(() => Int, { description: 'Number of pending todos' })
  pendding: number;

  @Field(() => Int, { description: 'Number of completed todos' })
  completed: number;

  @Field(() => Int, {
    description: 'Total number of todos',
    deprecationReason: 'Use total field instead',
  })
  totalTodosCompleted: number;
}
