import { expect, test } from "bun:test";
import { genTypes } from "../src";

test("genTypes", async () => {
  const result = await genTypes();
  expect(result.total).toEqual(1295);
});
