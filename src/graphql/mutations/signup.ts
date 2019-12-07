import { hash } from 'bcrypt';
import { pipe } from 'fp-ts/lib/pipeable';
import { arg, mutationField, stringArg } from 'nexus';

import { getAuthPayload } from '@util/auth';

export const Signup = mutationField('signup', {
  type: 'AuthPayload',
  args: {
    email: stringArg(),
    password: stringArg(),
    phone: stringArg(),
    notificationSettings: arg({
      type: 'NotificationSettingsCreateWithoutUserInput',
      nullable: true,
      default: {
        email: true,
        phone: false
      }
    })
  },
  resolve: async (
    _,
    { email, password: passwordInput, phone, notificationSettings },
    ctx
  ) =>
    pipe(await hash(passwordInput, 10), password =>
      ctx.prisma
        .createUser({
          email,
          password,
          phone,
          notificationSettings: { create: notificationSettings }
        })
        .then(getAuthPayload)
    )
});
