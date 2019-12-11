import { applyMiddleware } from 'graphql-middleware';
import { makePrismaSchema } from 'nexus-prisma';
import { join } from 'path';
import { curryN } from 'ramda';

import datamodelInfo from './generated/nexus-prisma';
import { prisma } from './generated/prisma-client';
import * as types from './graphql';
import { permissions } from './permissions';

const dirname = curryN(2, join)(__dirname);

const schema = makePrismaSchema({
  types,
  prisma: {
    datamodelInfo,
    client: prisma
  },
  typegenAutoConfig: {
    sources: [
      {
        alias: 'ctx',
        source: dirname('context.ts')
      }
    ],
    contextType: 'ctx.Context'
  },
  shouldGenerateArtifacts: false,
  outputs: {
    schema: dirname('./generated/schema.graphql'),
    typegen: dirname('./generated/nexus.ts')
  },
  nonNullDefaults: {
    input: true
  }
});

export default applyMiddleware(schema, permissions);
