import { fold, monoidSum } from 'fp-ts/lib/Monoid';
import { array, map } from 'fp-ts/lib/Array';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import { stringArg } from 'nexus';

import { prismaMutationField } from '@util/nexus';
import { connect } from '@util/prisma';
import { calculatePrice, createCharge, createSource } from '@util/stripe';

const { task } = T;

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
    const totalPrice = await pipe(
      cart,
      map(calculatePrice),
      array.sequence(task),
      T.map(fold(monoidSum))
    )();
    const { id: stripeId, paid } = await pipe(
      createSource(stripeToken),
      T.chain(createCharge(totalPrice, email))
    )();
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
