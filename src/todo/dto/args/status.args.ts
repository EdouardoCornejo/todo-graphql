import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@ArgsType()
export class StatusArgs {
  @Field(() => Boolean, {
    nullable: true,
    description:
      'true returns completed todos, false pending ones; omit it for all.',
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
