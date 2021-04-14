import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  // TEST ON CREATE APPOINTMENT
  it('should be able to create a new user', async () => {
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
    const user = await createUser.execute({
      name: 'john due',
      email: 'johndue@email.com',
      password: '1234',
    });

    await expect(
      createUser.execute({
        name: 'john due',
        email: 'johndue@email.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
