import { prisma } from './src/generated/prisma-client';
import { user, user2 } from './tests/util/constants';

const teardown = async () => {
  await prisma.deleteUser({
    email: user.email
  });
  await prisma.deleteUser({ email: user2.email });
  await prisma.deleteManyLeagues();
};

export default teardown;
