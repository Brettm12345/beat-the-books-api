import dayjs from 'dayjs';
import { pipe } from 'fp-ts/lib/pipeable';
import { arg } from 'nexus';
import { prismaObjectType } from 'nexus-prisma';

export const Package = prismaObjectType<'Package'>({
  name: 'Package',
  definition: t => {
    t.prismaFields({ filter: ['price'] });
    t.float('price', {
      args: {
        toDate: arg({
          type: 'DateTime',
          nullable: true
        })
      },
      resolve: async (parent, { toDate }, ctx) =>
        pipe(
          await ctx.prisma.package({ id: parent.id }).price(),
          price => (toDate ? price * dayjs().diff(dayjs(toDate), 'day') : price)
        )
    });
  }
});
