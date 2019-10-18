import { map } from 'blend-promise-utils';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

import { Prediction, User, prisma } from '@generated/prisma-client';

import config from './config';
import { PredictionResults, predictionResults } from './fragments';

const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

const transporter = nodemailer.createTransport(config.email);

export const notify = (message: string, subject: string) => async ({
  id,
  email,
  phone
}: User) => {
  const settings = await prisma.user({ id }).notificationSettings();
  if (settings.email)
    await transporter.sendMail({
      subject,
      text: message,
      to: email
    });

  if (settings.phone)
    await twilioClient.messages.create({
      to: phone,
      from: config.twilio.phoneNumber,
      body: message
    });
};

export const sendPrediction = async ({ id }: Prediction) => {
  const {
    home,
    away,
    winner,
    package: packageQuery
  }: PredictionResults = await prisma
    .prediction({
      id
    })
    .$fragment(predictionResults);
  const users = await prisma.users({
    where: {
      orders_some: {
        items_some: { package: packageQuery, expireAt_gte: new Date() },
        status: 'PAID'
      }
    }
  });

  const game = `${home.name} vs ${away.name}`;
  const message = `${game}\n${winner.name} wins`;
  const subject = `Updated Pick for ${game}`;
  await map(users, notify(message, subject));
};
