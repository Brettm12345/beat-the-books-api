import { prismaMutationFields } from '@util/nexus';

export const Mutation = prismaMutationFields({
  pick: [
    'createLeague',
    'updateLeague',
    'updateManyLeagues',
    'upsertLeague',
    'deleteLeague',
    'deleteManyLeagues',
    'createTeam',
    'updateTeam',
    'updateManyTeams',
    'upsertTeam',
    'deleteTeam',
    'deleteManyTeams',
    'deleteOrder'
  ]
});

export { AddToCart } from './addToCart';
export { CreateOrder } from './createOrder';
export { EmptyCart } from './emptyCart';
export { DeleteMe } from './deleteMe';
export { ForgotPassword } from './forgotPassword';
export { ChangePassword } from './changePassword';
export { Signup } from './signup';
export { Login } from './login';
export { RemoveFromCart } from './removeFromCart';
export { CreatePrediction } from './createPrediction';
export { UpdatePrediction } from './updatePrediction';
