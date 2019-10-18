import { allow, or, shield } from 'graphql-shield';

import { isAdmin, isAuthenticated, isEditor } from './rules';

export const permissions = shield({
  Mutation: {
    '*': isAdmin,
    addToCart: isAuthenticated,
    changePassword: isAuthenticated,
    createOrder: isAuthenticated,
    createPrediction: or(isAdmin, isEditor),
    deleteMe: isAuthenticated,
    login: allow,
    removeFromCart: isAuthenticated,
    signup: allow,
    updatePrediction: or(isAdmin, isEditor)
  },
  Query: {
    '*': isAuthenticated
  }
});
