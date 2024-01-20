import { expect, test } from "bun:test";
import { genCarbonPictogramsReactTypes } from "../src";

test("genCarbonPictogramsReactTypes", () => {
  const result = genCarbonPictogramsReactTypes();
  expect(result.total).toEqual(1173);
});
