import * as React from 'react';
import App from './App';
import { mount, shallow } from 'enzyme';

jest.mock('../cards/artFinder');

describe("smoke tests", () => {
  it("renders shallowly", () => {
    shallow(<App />);
  });

  it("renders deeply", () => {
    mount(<App />);
  });
});
