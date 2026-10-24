import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A task stored in memory.' })
export class Todo {
  @Field(() => Int, {
    description: 'Numeric identifier, assigned incrementally.',
  })
  id: number;

  @Field(() => String, { description: 'What has to be done.' })
  description: string;

  @Field(() => Boolean, { description: 'Whether the task is completed.' })
  done: boolean = false;
}
