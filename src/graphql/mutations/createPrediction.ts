import { stringArg } from 'nexus';

import { prismaMutationField } from '@util/nexus';
import { sendPrediction } from '@util/notify';
import * as R from 'fp-ts/lib/Record';
import { TeamCreateOneInput } from '@generated/prisma-client';

type TeamName = 'home' | 'away' | 'winner';

type ConnectTeams = (
  teams: Record<TeamName, string>
) => Record<TeamName, TeamCreateOneInput>;
const connectTeams: ConnectTeams = R.map(key => ({ connect: { key } }));

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
      ...connectTeams(teams)
    });
    await sendPrediction(prediction);
    return prediction;
  }
});
