import dayjs from 'dayjs';
import Stripe from 'stripe';

import { OrderItem, prisma } from '@generated/prisma-client';
import { Task } from 'fp-ts/lib/Task';

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const currency = 'usd';

export const createSource = (
  token: string
): Task<Stripe.sources.ISource> => () =>
  stripe.sources.create({
    token,
    currency,
    type: 'card'
  });

export const createCharge = (amount: number, email: string) => ({
  id: source
}: Stripe.sources.ISource): Task<Stripe.charges.ICharge> => () =>
  stripe.charges.create({
    source,
    amount,
    currency,
    receipt_email: email
  });

export const calculatePrice = ({
  id,
  expireAt
}: OrderItem): Task<number> => async () => {
  const price = await prisma
    .orderItem({ id })
    .package()
    .price();
  const days = dayjs(expireAt).diff(dayjs(), 'day');
  return price * days;
};
