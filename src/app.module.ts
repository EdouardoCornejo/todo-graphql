import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { HelloWorldResolver } from 'src/hello-world/hello-world.resolver';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      // playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    HelloWorldModule,
    TodoModule,
  ],
  controllers: [],
  providers: [HelloWorldResolver],
})
export class AppModule {}
