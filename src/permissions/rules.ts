import { or, rule } from 'graphql-shield';

import { Context } from '@context';

export const isAuthenticated = rule()(
  (_parent, _args, ctx: Context) => !!ctx.user
);

export const isAdmin = rule()(
  (_parent, _args, ctx: Context) => ctx.user.role === 'ADMIN'
);

export const isEditor = or(
  isAdmin,
  rule()((_parent, _args, ctx: Context) => ctx.user.role === 'EDITOR')
);
