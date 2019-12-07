import { map } from 'blend-promise-utils';
import { fold, monoidSum } from 'fp-ts/lib/Monoid';
import { pipe } from 'fp-ts/lib/pipeable';
import { stringArg } from 'nexus';

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

    const totalPrice = pipe(await map(cart, calculatePrice), fold(monoidSum));
    const { id: stripeId, paid } = await pipe(
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
      stripeId,
      status: paid ? 'PAID' : 'FAILED',
      totalRefunded: 0,
      owner: { connect: { id: ctx.user.id } },
      items: connect(cart)
    });
  }
});
