import dayjs from 'dayjs';
import Stripe from 'stripe';

import { OrderItem, prisma } from '@generated/prisma-client';

import config from './config';

export const stripe = new Stripe(config.stripe.apiKey);

const currency = 'usd';

export const createSource = (token: string) =>
  stripe.sources.create({
    token,
    currency,
    type: 'card'
  });

interface CreateChargeOptions {
  source: string;
  amount: number;
  email: string;
}

export const createCharge = async ({
  source,
  amount,
  email
}: CreateChargeOptions) =>
  stripe.charges.create({
    source,
    amount,
    currency,
    receipt_email: email
  });

export const calculatePrice = async ({ id, expireAt }: OrderItem) => {
  const price = await prisma
    .orderItem({ id })
    .package()
    .price();
  const days = dayjs(expireAt).diff(dayjs(), 'day');
  return price * days;
};
