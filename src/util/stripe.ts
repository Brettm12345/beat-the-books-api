import dayjs from 'dayjs';
import { curry } from 'ramda';
import Stripe from 'stripe';

import { OrderItem, prisma } from '@generated/prisma-client';

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const currency = 'usd';

export const createSource = (token: string) =>
  stripe.sources.create({
    token,
    currency,
    type: 'card'
  });

export const createCharge = curry(
  async (
    amount: number,
    email: string,
    { id: source }: Stripe.sources.ISource
  ) =>
    stripe.charges.create({
      source,
      amount,
      currency,
      receipt_email: email
    })
);

export const calculatePrice = async ({ id, expireAt }: OrderItem) => {
  const price = await prisma
    .orderItem({ id })
    .package()
    .price();
  const days = dayjs(expireAt).diff(dayjs(), 'day');
  return price * days;
};
