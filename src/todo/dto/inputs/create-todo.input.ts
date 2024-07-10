import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String, {
    description: 'The description of the todo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  description: string;
}
