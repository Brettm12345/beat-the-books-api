import { newPassword, user } from './util/constants';
import { CHANGE_PASSWORD_MUTATION, LOGIN_MUTATION } from './util/mutations';
import { ME_QUERY } from './util/queries';
import { mutate, query } from './util/testClient';

describe('User', () => {
  it('Should allow the user to query themself', async () => {
    const result = await query({ query: ME_QUERY });
    expect(result).toHaveProperty(['data', 'me'], user);
  });

  it('Should allow the user to change their password', async () => {
    const result = await mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: { password: newPassword }
    });
    expect(result).toHaveProperty(['data', 'changePassword', 'user'], user);
  });

  it('Should allow the user to login with the new password', async () => {
    const result = await mutate({
      mutation: LOGIN_MUTATION,
      variables: { password: newPassword, ...user }
    });
    expect(result).toHaveProperty(['data', 'login', 'user'], user);
  });
});
