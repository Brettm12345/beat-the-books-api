import { number, object, string } from 'yup';

const configSchema = object()
  .shape({
    email: object().shape({
      host: string(),
      port: number().default(587),
      auth: object().shape({
        user: string().email(),
        pass: string()
      })
    }),
    twilio: object().shape({
      accountSid: string(),
      authToken: string(),
      phoneNumber: string()
    }),
    stripe: object().shape({
      apiKey: string()
    })
  })
  .noUnknown();

const config = configSchema.validateSync(
  require(`../../config/${process.env.NODE_ENV}.json`),
  { abortEarly: false }
);

export default config;
