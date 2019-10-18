import { prisma } from '../src/generated/prisma-client';

const main = async () => {
  const seasonEndDate = new Date('December 29, 2019');
  await prisma.createLeague({
    name: 'NFL',
    sport: 'Football',
    seasonEndDate
  });
};

main();
