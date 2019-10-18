import { hash } from 'bcrypt';
import dayjs from 'dayjs';

import { prisma } from './src/generated/prisma-client';
import {
  footballPackage,
  league,
  password,
  teams,
  user,
  user2
} from './tests/util/constants';

const setup = async () => {
  await prisma.createLeague({
    ...league,
    teams: {
      create: teams
    },
    packages: {
      create: footballPackage
    }
  });
  await prisma.createUser({
    ...user,
    password: await hash(password, 10),
    role: 'ADMIN',
    notificationSettings: {
      create: {
        email: true,
        phone: true
      }
    }
  });
  const { id: userId } = await prisma.createUser({
    ...user2,
    password: await hash('test', 10),
    notificationSettings: {
      create: {
        email: true,
        phone: true
      }
    }
  });
  await prisma.createOrder({
    status: 'PAID',
    totalPrice: 400,
    totalRefunded: 0,
    totalTax: 0,
    owner: {
      connect: { id: userId }
    },
    items: {
      create: {
        package: {
          connect: { name: footballPackage.name }
        },
        expireAt: dayjs()
          .subtract(1, 'day')
          .toDate()
      }
    }
  });
};

export default setup;
