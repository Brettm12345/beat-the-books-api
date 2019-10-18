import { newPassword, password as oldPassword, user } from './util/constants';
import {
  CHANGE_PASSWORD_MUTATION,
  ChangePasswordResult,
  LOGIN_MUTATION,
  LoginResult
} from './util/mutations';
import { ME_QUERY, MeResult } from './util/queries';
import { mutate, query } from './util/testClient';

describe('User', () => {
  it('Should allow the user to query themself', async () => {
    const {
      data: { me }
    } = (await query({ query: ME_QUERY })) as MeResult;
    expect(me).toBe(user);
  });

  it('Should allow the user to change their password', async () => {
    const {
      data: { changePassword: result }
    } = (await mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: { oldPassword, newPassword }
    })) as ChangePasswordResult;
    expect(result.user).toBe(user);
  });

  it('Should allow the user to login with the new password', async () => {
    const {
      data: { login: result }
    } = (await mutate({
      mutation: LOGIN_MUTATION,
      variables: { password: newPassword, ...user }
    })) as LoginResult;
    expect(result.user).toBe(user);
  });
});
