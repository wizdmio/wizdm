import { UnsplashModule } from './unsplash.module';

describe('UnsplashModule', () => {
  let unsplashModule: UnsplashModule;

  beforeEach(() => {
    unsplashModule = new UnsplashModule();
  });

  it('should create an instance', () => {
    expect(unsplashModule).toBeTruthy();
  });
});
