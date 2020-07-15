import { DatabasePipe } from './database.pipe';

describe('DatabasePipe', () => {
  it('create an instance', () => {
    const pipe = new DatabasePipe();
    expect(pipe).toBeTruthy();
  });
});
