import { inputRule } from 'graphql-shield';
import { boolean, date, object, string } from 'yup';

const phoneRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

const teamKey = string()
  .length(3)
  .uppercase();

const currentDate = date().min(new Date(), 'Must be a future date');
const email = string().email();
const phone = string().matches(phoneRegex, 'Invalid phone number');
const password = string().min(5, 'Password too short');

const notificationSettings = object()
  .shape({
    email: boolean()
      .default(true)
      .nullable()
      .notRequired(),
    phone: boolean()
      .default(false)
      .nullable()
      .notRequired()
  })
  .default({ email: true, phone: true })
  .nullable()
  .notRequired();

export const signupInput = inputRule()(() =>
  object()
    .shape({
      email: email.required(),
      phone: phone.required(),
      password: password.required(),
      notificationSettings
    })
    .noUnknown()
);

export const loginInput = inputRule()(() =>
  object().shape({
    email: email.nullable().notRequired(),
    phone: phone.nullable().notRequired(),
    password: password.required()
  })
);

export const addToCartInput = inputRule()(() =>
  object().shape({
    expireAt: currentDate.required(),
    packageName: string().required()
  })
);

export const createPredictionInput = inputRule()(() =>
  object()
    .shape({
      away: teamKey.required(),
      home: teamKey.required(),
      winner: teamKey.required(),
      name: string().required(),
      packageName: string().required(),
      startDate: currentDate.required()
    })
    .noUnknown()
);
