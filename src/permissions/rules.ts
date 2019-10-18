import { rule } from 'graphql-shield';

import { Context } from '@context';

export const isAuthenticated = rule()(
  (_parent, _args, ctx: Context) => !!ctx.user
);

export const isEditor = rule()(
  (_parent, _args, ctx: Context) => ctx.user.role === 'EDITOR'
);

export const isAdmin = rule()(
  (_parent, _args, ctx: Context) => ctx.user.role === 'ADMIN'
);
