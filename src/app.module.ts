import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { HelloWorldResolver } from 'src/hello-world/hello-world.resolver';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      // Apollo Sandbox is a development tool: only served outside production.
      plugins:
        process.env.NODE_ENV === 'production'
          ? []
          : [ApolloServerPluginLandingPageLocalDefault()],
      // Nest only maps 400/401/403 to GraphQL codes, so a 404 would
      // otherwise surface as INTERNAL_SERVER_ERROR.
      formatError: (formattedError: GraphQLFormattedError) => {
        const originalError = formattedError.extensions?.originalError as
          | { statusCode?: number }
          | undefined;
        if (originalError?.statusCode !== 404) return formattedError;

        return {
          ...formattedError,
          extensions: { ...formattedError.extensions, code: 'NOT_FOUND' },
        };
      },
    }),
    HelloWorldModule,
    TodoModule,
  ],
  controllers: [],
  providers: [HelloWorldResolver],
})
export class AppModule {}
