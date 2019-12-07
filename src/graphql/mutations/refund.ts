import { idArg } from 'nexus';

import { prismaMutationField } from '@util/nexus';
import { stripe } from '@util/stripe';

export const Refund = prismaMutationField('refund', {
  type: 'Order',
  args: {
    id: idArg()
  },
  resolve: async (_, { id }, ctx) => {
    const order = await ctx.prisma.order({ id });
    if (order === null) throw new Error('Order not found');
    if (order.status !== 'PAID') throw new Error('Invalid order status');
    await stripe.refunds.create({ charge: order.stripeId });
    return ctx.prisma.updateOrder({
      where: { id },
      data: {
        status: 'REFUNDED'
      }
    });
  }
});
