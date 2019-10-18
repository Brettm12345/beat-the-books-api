import { map } from 'blend-promise-utils';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

import { Prediction, User, prisma } from '@generated/prisma-client';

import { PredictionResults, predictionResults } from './fragments';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  TWILIO_PHONE_NUMBER
} = process.env as Record<string, string>;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: (EMAIL_PORT as unknown) as number,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

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
      from: TWILIO_PHONE_NUMBER,
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
