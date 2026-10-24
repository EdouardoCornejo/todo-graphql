import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@InputType({
  description: 'Fields to update on a todo; omitted fields stay unchanged.',
})
export class UpdateTodoInput {
  @Field(() => Int, {
    description: 'The ID of the todo',
  })
  @IsInt()
  @Min(1)
  id: number;

  @Field(() => String, {
    description: 'New description (3 to 20 characters).',
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  @IsOptional()
  description?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Mark the todo as completed or pending.',
  })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
