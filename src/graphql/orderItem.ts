import { prismaObjectType } from 'nexus-prisma';

import { calculatePrice } from '@util/stripe';

export const OrderItem = prismaObjectType<'OrderItem'>({
  name: 'OrderItem',
  definition: t => {
    t.prismaFields(['*']);
    t.float('price', calculatePrice);
  }
});
