import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

import { prisma } from '../../src/generated/prisma-client';
import schema from '../../src/schema';
import { user } from './constants';

const server = new ApolloServer({
  schema,
  context: async () => ({
    prisma,
    user: await prisma.user({ email: user.email })
  })
});

export const { query, mutate } = createTestClient(server);
