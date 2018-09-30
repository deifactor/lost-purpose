import { mount, shallow } from "enzyme";
import * as React from "react";
import { HashRouter } from "react-router-dom";
import App from "./App";

jest.mock("../cards/artFinderContext");

describe("smoke tests", () => {
  it("renders shallowly", () => {
    shallow(<HashRouter><App /></HashRouter>);
  });

  it("renders deeply", () => {
    mount(<HashRouter><App /></HashRouter>);
  });
});
