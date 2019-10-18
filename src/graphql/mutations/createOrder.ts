import { map } from 'blend-promise-utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { stringArg } from 'nexus';
import { add, reduce } from 'ramda';

import { prismaMutationField } from '@util/nexus';
import { connect } from '@util/prisma';
import { calculatePrice, createCharge, createSource } from '@util/stripe';

export const CreateOrder = prismaMutationField('createOrder', {
  type: 'Order',
  args: {
    stripeToken: stringArg()
  },
  resolve: async (_, { stripeToken }, ctx) => {
    const cart = await ctx.prisma.orderItems({
      where: { owner: { id: ctx.user.id } }
    });

    const totalPrice = pipe(
      await map(cart, calculatePrice),
      reduce<number, number>(add, 0)
    );
    const { paid } = await pipe(
      await createSource(stripeToken),
      ({ id: source }) =>
        createCharge({
          source,
          amount: totalPrice,
          email: ctx.user.email
        })
    );
    if (paid)
      await ctx.prisma.updateUser({
        where: { id: ctx.user.id },
        data: { cart: { set: null } }
      });
    return ctx.prisma.createOrder({
      totalPrice,
      status: paid ? 'PAID' : 'FAILED',
      totalRefunded: 0,
      totalTax: 0,
      owner: { connect: { id: ctx.user.id } },
      items: connect(cart)
    });
  }
});
