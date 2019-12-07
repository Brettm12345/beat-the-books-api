import { fold, fromNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { mutationField, stringArg } from 'nexus';

import { getResetToken } from '@util/auth';
import { notify } from '@util/notify';

const getResetUrl = (token: string): string =>
  `https://${process.env.PRODUCTION_URL}/resetPassword?token=${token}`;

export const ForgotPassword = mutationField('forgotPassword', {
  type: 'Boolean',
  args: {
    email: stringArg()
  },
  resolve: async (_, { email }, ctx) =>
    pipe(
      await ctx.prisma.user({ email }),
      fromNullable,
      fold(
        () => {
          throw new Error(`No user found with email ${email}`);
        },
        async user => {
          const token = getResetToken(user);
          await notify(
            getResetUrl(token),
            'Password reset for beat the books. This link will expire in one hour'
          )(user);
          return true;
        }
      )
    )
});
