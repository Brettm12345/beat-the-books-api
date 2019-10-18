import { prisma } from './src/generated/prisma-client';
import { league, user, user2 } from './tests/util/constants';

const teardown = async () => {
  await prisma.deleteManyUsers({
    AND: [
      {
        email: user.email
      },
      {
        email: user2.email
      }
    ]
  });
  await prisma.deleteLeague({ name: league.name });
};

export default teardown;
