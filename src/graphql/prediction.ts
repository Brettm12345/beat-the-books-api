import { prismaObjectType } from 'nexus-prisma';

export const Prediction = prismaObjectType<'Prediction'>({
  name: 'Prediction',
  definition: t => {
    t.prismaFields(['*']);
  }
});
