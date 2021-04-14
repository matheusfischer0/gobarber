import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  // TEST ON CREATE APPOINTMENT
  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'johndoe@example.com',
      password: '1234',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  // TEST ON CREATE APPOINTMENT
  it('should not be able to reset password with a non-existing token', async () => {
    await expect(resetPassword.execute({
      password: '123123',
      token:'wrong_token',
    })).rejects.toBeInstanceOf(AppError)
  });
  // TEST ON CREATE APPOINTMENT
  it('should not be able to reset password with a non-existing user', async () => {

    const { token } = await fakeUserTokensRepository.generate('non-existing-user');


    await expect(resetPassword.execute({
      password: '123123',
      token
    })).rejects.toBeInstanceOf(AppError)
  });

  // TEST ON CREATE APPOINTMENT
  it('should not be able to reset password if passed 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'johndoe@example.com',
      password: '1234',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      const customDate = new Date();
      return customDate.setHours(customDate.getHours()+3);
    })

    await expect(resetPassword.execute({
      password: '123123',
      token,
    })).rejects.toBeInstanceOf(AppError)
  });
});
