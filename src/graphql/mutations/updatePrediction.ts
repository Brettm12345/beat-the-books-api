import { idArg, stringArg } from 'nexus';

import { prismaMutationField } from '@util/nexus';
import { sendPrediction } from '@util/notify';

export const UpdatePrediction = prismaMutationField('updatePrediction', {
  type: 'Prediction',
  args: {
    id: idArg(),
    winner: stringArg({ description: 'The key of the winning team' })
  },
  resolve: async (_, { id, winner }, ctx) => {
    const prediction = await ctx.prisma.updatePrediction({
      where: { id },
      data: {
        winner: {
          connect: { key: winner }
        }
      }
    });
    await sendPrediction(prediction);
    return prediction;
  }
});
