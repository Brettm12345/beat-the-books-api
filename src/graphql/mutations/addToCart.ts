import { stringArg } from 'nexus';

import { prismaMutationField } from '@util/nexus';

export const AddToCart = prismaMutationField('addToCart', {
  type: 'OrderItem',
  args: {
    expireAt: stringArg(),
    packageName: stringArg()
  },
  list: true,
  resolve: (_, { expireAt, packageName }, ctx) =>
    ctx.prisma
      .updateUser({
        where: { id: ctx.user.id },
        data: {
          cart: {
            create: {
              package: { connect: { name: packageName } },
              expireAt: new Date(expireAt)
            }
          }
        }
      })
      .cart()
});
