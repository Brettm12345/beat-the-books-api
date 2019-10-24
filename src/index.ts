import { ApolloServer } from 'apollo-server-lambda';

import { prisma } from './generated/prisma-client';
import schema from './schema';
import { getUser } from './util/auth';

const server = new ApolloServer({
  schema,
  context: ({ event: { headers } }) => ({
    prisma,
    user: getUser(headers)
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
