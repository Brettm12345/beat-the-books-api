import { ApolloServer } from 'apollo-server-lambda';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';

import { prisma } from './generated/prisma-client';
import schema from './schema';
import { getUser } from './util/auth';
import { pipe } from 'fp-ts/lib/pipeable';

const server = new ApolloServer({
  schema,
  context: async ({ event: { headers } }) => ({
    prisma,
    user: await pipe(getUser(headers), T.map(O.toNullable))()
  }),
  introspection: true,
  playground: true,
  tracing: true
});

export const graphqlHandler = server.createHandler({
  cors: {
    credentials: true,
    origin: '*'
  }
});
