import * as React from 'react';
import { Prompter } from './Prompter';
import { shallow, render, mount } from 'enzyme';

const ignore = () => { };

describe('the duration property', () => {
  it('should reject a negative duration', () => {
    expect(() => shallow(<Prompter onFingerprintComputed={ignore} duration={-1} />)).toThrow();
  });

  it('should reject a zero duration', () => {
    expect(() => shallow(<Prompter onFingerprintComputed={ignore} duration={0} />)).toThrow();
  });
});

describe('the fingerprint display', () => {
  it('should include the final fingerprint', (done) => {
    const prompter = mount(
      <Prompter
        onFingerprintComputed={(fingerprint) => {
          expect(prompter.text())
            .toMatch(new RegExp(fingerprint.toString(16), 'i'));
          done();
        }}
        duration={100}
      />);
    prompter.setState({ input: "input" });
    prompter.find('input[type="text"]').simulate('submit');
  });
});
