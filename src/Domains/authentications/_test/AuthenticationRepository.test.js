const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const authenticationRepoository = new AuthenticationRepository();

    await expect(authenticationRepoository.addToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepoository.checkAvailabilityToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepoository.deleteToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
