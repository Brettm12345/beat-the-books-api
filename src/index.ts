import { ApolloServer } from 'apollo-server';

import { prisma } from './generated/prisma-client';
import schema from './schema';
import { getUser } from './util/auth';

export const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    prisma,
    user: getUser(req)
  }),
  introspection: true,
  playground: true,
  tracing: true
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
