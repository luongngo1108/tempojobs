import { SafetyHtmlPipe } from './safety-html.pipe';

describe('SafetyHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafetyHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
