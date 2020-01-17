import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { Task, task } from 'fp-ts/lib/Task';
import { Option, option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import { prop } from 'fp-ts-ramda';
import jwt, { sign } from 'jsonwebtoken';

import { lookup, replace } from '@util/fp';
import { User, prisma } from '@generated/prisma-client';

export const APP_SECRET = 'appsecret321';

interface Token {
  userId: string;
}

type Verify = (str: string) => Option<Token>;
const verify: Verify = str =>
  pipe(jwt.verify(str, APP_SECRET) as Token | null, O.fromNullable);

export interface AuthPayload {
  token: string;
  user: User;
}

export const getResetToken = ({ id }: User): string =>
  sign({ userId: id }, APP_SECRET, { algorithm: 'RS256', expiresIn: '1 day' });

export const getAuthPayload = (user: User): AuthPayload => ({
  user,
  token: sign({ userId: user.id }, APP_SECRET)
});

type GetToken = (headers: Record<string, string>) => Option<string>;
const getToken: GetToken = flow(
  lookup('Authorization'),
  O.map(replace('Bearer ', ''))
);

type GetUserId = (token: string) => Option<string>;
export const getUserId: GetUserId = flow(verify, O.map(prop('userId')));

export const findUser = (id: string): Task<Option<User>> =>
  pipe(() => prisma.user({ id }), T.map(O.fromNullable));

type GetUser = (headers: Record<string, string>) => Task<Option<User>>;
export const getUser: GetUser = flow(
  getToken,
  O.chain(getUserId),
  O.map(findUser),
  option.sequence(task),
  T.map(O.flatten)
);
