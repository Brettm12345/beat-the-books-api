import { fold, monoidSum } from 'fp-ts/lib/Monoid';
import { pipe } from 'fp-ts/lib/pipeable';
import { stringArg } from 'nexus';

import { mapPromise } from '@util/fp';
import { prismaMutationField } from '@util/nexus';
import { connect } from '@util/prisma';
import { calculatePrice, createCharge, createSource } from '@util/stripe';

export const CreateOrder = prismaMutationField('createOrder', {
  type: 'Order',
  args: {
    stripeToken: stringArg()
  },
  resolve: async (_, { stripeToken }, ctx) => {
    const {
      prisma,
      user: { id, email }
    } = ctx;
    const cart = await prisma.orderItems({
      where: { owner: { id } }
    });
    const totalPrice = pipe(await mapPromise(calculatePrice), fold(monoidSum));
    const { id: stripeId, paid } = await pipe(
      await createSource(stripeToken),
      createCharge(totalPrice, email)
    );
    if (paid)
      await prisma.updateUser({
        where: { id },
        data: { cart: { set: null } }
      });
    return prisma.createOrder({
      totalPrice,
      stripeId,
      status: paid ? 'PAID' : 'FAILED',
      totalRefunded: 0,
      owner: { connect: { id } },
      items: connect(cart)
    });
  }
});
