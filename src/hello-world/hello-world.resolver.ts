import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, {
    description: 'Returns a simple hello world message',
    name: 'getHello',
  })
  helloWorld(): string {
    return 'Hello World!';
  }

  @Query(() => Float, {
    name: 'RandomNumber',
    description: 'Returns a random number',
  })
  getRandomNumber(): number {
    return Math.random() * 100;
  }

  @Query(() => Int, {
    description: 'Returns a random integer from 0 to 9',
  })
  getNumberFromZeroTo(): number {
    return Math.floor(Math.random() * 10);
  }

  @Query(() => Int, {
    description: 'Returns a random number from 0 to the specified number',
  })
  getNumberFromZeroToAny(
    @Args('to', {
      nullable: true,
      type: () => Int,
      description: 'Exclusive upper bound; defaults to 6',
    })
    to: number = 6,
  ): number {
    return Math.floor(Math.random() * to);
  }
}
