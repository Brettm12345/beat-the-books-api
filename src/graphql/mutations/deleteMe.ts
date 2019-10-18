import { prismaMutationField } from '@util/nexus';

export const DeleteMe = prismaMutationField('deleteMe', {
  type: 'User',
  resolve: (_parent, _args, ctx) => ctx.prisma.deleteUser({ id: ctx.user.id })
});
