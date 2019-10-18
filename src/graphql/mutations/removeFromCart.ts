import { idArg } from 'nexus';

import { prismaMutationField } from '@util/nexus';

export const RemoveFromCart = prismaMutationField('removeFromCart', {
  type: 'OrderItem',
  list: true,
  nullable: true,
  args: {
    id: idArg()
  },
  resolve: (_, { id }, ctx) =>
    ctx.prisma
      .updateUser({
        where: { id: ctx.user.id },
        data: {
          cart: {
            delete: {
              id
            }
          }
        }
      })
      .cart()
});
