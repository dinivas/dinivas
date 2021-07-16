import { ProjectProviderMiddleware } from './project-provider.middleware';

describe('ProjectProviderMiddleware', () => {
  it('should be defined', () => {
    expect(new ProjectProviderMiddleware(null)).toBeDefined();
  });
});
