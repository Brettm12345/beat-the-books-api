import { AuthenticationError } from 'apollo-server-errors';
import { hash } from 'bcrypt';
import { fold } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { mutationField, stringArg } from 'nexus';

import { getAuthPayload, getUserId } from '@util/auth';

export const ChangePassword = mutationField('changePassword', {
  type: 'AuthPayload',
  args: {
    password: stringArg(),
    token: stringArg()
  },
  resolve: async (_, { password: newPassword, token }, ctx) =>
    pipe(
      getUserId(token),
      fold(
        () => {
          throw new AuthenticationError('Invalid Token');
        },
        async id =>
          pipe(await hash(newPassword, 10), password =>
            ctx.prisma
              .updateUser({
                where: { id },
                data: { password, resetToken: undefined }
              })
              .then(getAuthPayload)
          )
      )
    )
});
