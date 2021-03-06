import dayjs from 'dayjs';

import * as notifications from '../src/util/notify';
import { stripe } from '../src/util/stripe';
import { footballPackage, teams } from './util/constants';
import {
  ADD_TO_CART_MUTATION,
  CREATE_ORDER_MUTATION,
  CREATE_PREDICTION_MUTATION,
  UPDATE_PREDICTION_MUTATION
} from './util/mutations';
import { mutate } from './util/testClient';

describe('Purchase', () => {
  it('Does not accept past dates', async () => {
    const expireAt = dayjs()
      .subtract(5, 'day')
      .toISOString();
    const result = await mutate({
      mutation: ADD_TO_CART_MUTATION,
      variables: {
        packageName: footballPackage.name,
        expireAt
      }
    });
    expect(result.errors).toBeDefined();
  });
  it('Adds an item to the cart', async () => {
    const expireAt = dayjs()
      .add(5, 'day')
      .toISOString();
    const result = await mutate({
      mutation: ADD_TO_CART_MUTATION,
      variables: {
        packageName: footballPackage.name,
        expireAt
      }
    });
    expect(result).toHaveProperty(
      ['data', 'addToCart', 0, 'package'],
      footballPackage
    );
  });
  it('Allows the user to create an order from cart', async () => {
    const { id: stripeToken } = await stripe.tokens.create({
      card: {
        object: 'card',
        exp_month: 4,
        exp_year: 20,
        number: '4242424242424242',
        cvc: '420',
        name: 'Test User'
      }
    });
    const result = await mutate({
      mutation: CREATE_ORDER_MUTATION,
      variables: { stripeToken }
    });
    expect(result).toHaveProperty(['data', 'createOrder', 'status'], 'PAID');
  });
});

describe('Notification', () => {
  it('Should notify the user', async () => {
    const notify = jest.spyOn(notifications, 'notify');
    const result = await mutate({
      mutation: CREATE_PREDICTION_MUTATION,
      variables: {
        name: 'test',
        packageName: footballPackage.name,
        startDate: dayjs()
          .add(5, 'day')
          .toISOString(),
        home: teams[0].key,
        away: teams[1].key,
        winner: teams[0].key
      }
    });
    await mutate({
      mutation: UPDATE_PREDICTION_MUTATION,
      variables: {
        id: (result as { data: { createPrediction: { id: string } } }).data
          .createPrediction.id,
        winner: teams[1].key
      }
    });
    expect(notify).toHaveBeenCalledTimes(2);
  });
});
