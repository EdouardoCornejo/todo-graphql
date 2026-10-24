import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType({ description: 'Data to create a todo.' })
export class CreateTodoInput {
  @Field(() => String, {
    description: 'The description of the todo (3 to 20 characters).',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  description: string;
}
