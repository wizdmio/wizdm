import { OnNextAnimationFramePipe } from './on-next-animation-frame.pipe';

describe('OnNextAnimationFramePipe', () => {
  it('create an instance', () => {
    const pipe = new OnNextAnimationFramePipe();
    expect(pipe).toBeTruthy();
  });
});
