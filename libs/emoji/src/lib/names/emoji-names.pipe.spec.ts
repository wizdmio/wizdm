import { EmojiNamesPipe } from './emoji-names.pipe';

describe('EmojiNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new EmojiNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
