import { prismaMutationField } from '@util/nexus';

export const EmptyCart = prismaMutationField('emptyCart', {
  type: 'BatchPayload',
  resolve: (_parent, _args, ctx) =>
    ctx.prisma.deleteManyOrderItems({ owner: { id: ctx.user.id } })
});
