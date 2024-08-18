# @types\_\_carbon-pictograms-react

This repository generates TypeScript definitions ([@types/carbon\_\_pictograms-react](https://www.npmjs.com/package/@types/carbon__pictograms-react)) for the [@carbon/pictograms-react](https://github.com/carbon-design-system/carbon/tree/main/packages/pictograms-react) pictogram library using the [@carbon/pictograms](https://www.npmjs.com/package/@carbon/pictograms) package.

## Prerequisites

- [Bun](https://bun.sh/docs/installation)

## Set-up

Install the dependencies:

```sh
bun install
```

## Runbook

1. Manually upgrade the minor version of `@carbon/pictograms`.

This should be done manually in the `package.json` file. Note that the version should be pinned.

```json
{
  "dependencies": {
    "@carbon/pictograms": "<version>"
  }
}
```

2. Run `bun generate-types`.

- This will generate the source code in `dist/`.
- If there are changes, the `tests/index.test.ts` should expectedly fail. Fix the broken test and commit the changes.

If there are changes, perform the following steps to update the type definitions:

1. Fork https://github.com/DefinitelyTyped/DefinitelyTyped.
2. Create a new branch (e.g., `carbon-pictograms-react-<version>`).
3. Copy the generated files from `dist/` to `DefinitelyTyped/types/carbon__pictograms-react`.
