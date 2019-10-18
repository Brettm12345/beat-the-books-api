import { stringArg } from 'nexus';
import { mapObjIndexed } from 'ramda';

import { prismaMutationField } from '@util/nexus';
import { sendPrediction } from '@util/notify';

export const CreatePrediction = prismaMutationField('createPrediction', {
  type: 'Prediction',
  args: {
    away: stringArg(),
    home: stringArg(),
    name: stringArg(),
    packageName: stringArg(),
    startDate: stringArg(),
    winner: stringArg()
  },
  resolve: async (_, { name, startDate, packageName, ...teams }, ctx) => {
    const prediction = await ctx.prisma.createPrediction({
      name,
      startDate: new Date(startDate),
      package: { connect: { name: packageName } },
      ...mapObjIndexed(key => ({ connect: { key } }), teams)
    });
    await sendPrediction(prediction);
    return prediction;
  }
});
