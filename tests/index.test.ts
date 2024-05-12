import { expect, test } from "bun:test";
import { genCarbonPictogramsReactTypes } from "../src";

test("genCarbonPictogramsReactTypes", async () => {
  const result = await genCarbonPictogramsReactTypes();
  expect(result.total).toEqual(1183);
});
