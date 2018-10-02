import { TogglerModule } from './toggler.module';

describe('TogglerModule', () => {
  let togglerModule: TogglerModule;

  beforeEach(() => {
    togglerModule = new TogglerModule();
  });

  it('should create an instance', () => {
    expect(togglerModule).toBeTruthy();
  });
});
