import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('Authenticate User', () => {
  // TEST ON CREATE APPOINTMENT
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'john due',
      email: 'johndue@email.com',
      password: '1234',
    });

    const response = await authenticateUser.execute({
      email: 'johndue@email.com',
      password: '1234',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate without a valid account', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    expect(
      authenticateUser.execute({
        email: 'johndue@email.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'john due',
      email: 'johndue@email.com',
      password: '1234',
    });

    expect(
      authenticateUser.execute({
        email: 'johndue@email.com',
        password: '95123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
