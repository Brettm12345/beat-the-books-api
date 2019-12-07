import { allow, chain, shield } from 'graphql-shield';

import {
  addToCartInput,
  createPredictionInput,
  loginInput,
  signupInput
} from './inputRules';
import { isAdmin, isAuthenticated, isEditor } from './rules';

export const permissions = shield({
  Mutation: {
    '*': isAdmin,
    addToCart: chain(isAuthenticated, addToCartInput),
    changePassword: isAuthenticated,
    createOrder: isAuthenticated,
    createPrediction: chain(isEditor, createPredictionInput),
    deleteMe: isAuthenticated,
    forgotPassword: allow,
    login: loginInput,
    removeFromCart: isAuthenticated,
    signup: signupInput,
    updatePrediction: isEditor
  },
  Query: {
    '*': isAuthenticated
  }
});
