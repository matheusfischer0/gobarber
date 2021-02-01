import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  // TEST ON CREATE APPOINTMENT
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'john due',
      email: 'johndue@email.com',
      password: '1234',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('johndue@email.com');
  });

  // TEST ON CREATE APPOINTMENT
  it('should be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'john due',
      email: 'johndue@email.com',
      password: '1234',
    });

    expect(createUser.execute({
      name: 'john due',
      email: 'johndue@email.com',
      password: '1234',
    })).rejects.toBeInstanceOf(AppError);
  });
});
