import { AuthzMiddleware } from './authz.middleware';

describe('AuthzMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthzMiddleware()).toBeDefined();
  });
});
