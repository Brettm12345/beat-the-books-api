import { chain, fromNullable, getOrElse, map } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { sign, verify } from 'jsonwebtoken';
import { replace } from 'ramda';
import { oc } from 'ts-optchain';

import { User, prisma } from '@generated/prisma-client';

export const APP_SECRET = 'appsecret321';

interface Token {
  userId: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

interface AuthHeaders {
  Authorization?: string;
}

const parseToken = replace('Bearer ', '');

const getToken = (headers: AuthHeaders) =>
  pipe(fromNullable(headers.Authorization), map(parseToken));

export const getUserId = (token: string) =>
  pipe(
    verify(token, APP_SECRET) as Token | null,
    verified => oc(verified).userId(),
    fromNullable
  );

export const getResetToken = ({ id }: User): string =>
  sign({ userId: id }, APP_SECRET, { expiresIn: '1h' });

export const getAuthPayload = (user: User): AuthPayload => ({
  user,
  token: sign({ userId: user.id }, APP_SECRET)
});

export const getUser = async (headers: AuthHeaders) =>
  pipe(
    getToken(headers),
    chain(getUserId),
    getOrElse(() => ''),
    id => prisma.user({ id })
  );
