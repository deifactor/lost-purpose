import { LFSR } from "./lfsr";

describe("nonsensical inputs", () => {
  it("should fail if the feed is unsafe", () => {
    expect(() => new LFSR(Number.MAX_SAFE_INTEGER + 1, 1)).toThrow();
  });
  it("should fail if the state is unsafe", () => {
    expect(() => new LFSR(Number.MAX_SAFE_INTEGER + 1, 0x9)).toThrow();
  });
});

it("should always output 0s if the state is 0", () => {
  const lfsr = new LFSR(0);
  expect(lfsr.random()).toBe(0);
  expect(lfsr.random()).toBe(0);
});

it("should output something nonzero if the state is not 0", () => {
  const lfsr = new LFSR(12345);
  expect(lfsr.random()).not.toBe(0);
});

it("should be deterministic", () => {
  const lfsr1 = new LFSR(12345);
  const lfsr2 = new LFSR(12345);
  expect(lfsr1.random()).toBe(lfsr2.random());
});

it("should not always output the same value", () => {
  const lfsr = new LFSR(54321);
  expect(lfsr.random()).not.toBe(lfsr.random());
});

it("should have the proper period for small states", () => {
  // 0xC should give something with period 15.
  let lfsr = new LFSR(3, 0xC);
  const values = [];
  for (let i = 0; i < 15; i++) {
    values.push(lfsr.nextBit());
  }
  const repeatedValues = [];
  for (let i = 0; i < 15; i++) {
    repeatedValues.push(lfsr.nextBit());
  }
  expect(repeatedValues).toEqual(values);
});
