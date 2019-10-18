import { prisma } from './src/generated/prisma-client';

const teardown = async () => {
  await prisma.deleteManyUsers();
  await prisma.deleteManyOrderItems();
  await prisma.deleteManyOrders();
  await prisma.deleteManyLeagues();
};

export default teardown;
