import type { BuildIcons, IconOutput } from "@carbon/pictograms";
import metadata from "@carbon/pictograms/metadata.json";
import fs from "node:fs";
import path from "node:path";
import { ensureFolder, toModuleName } from "./utils";

interface Options {
  /**
   * Specify a max number of icons to generate.
   * Useful for testing without generating all icons (2k+).
   * @default Infinity
   */
  limit?: number;

  /**
   * Specify a custom output directory.
   * @default "dist"
   */
  outputDir?: string;
}

export const genCarbonPictogramsReactTypes = (options?: Options) => {
  const limit = options?.limit ?? Infinity;
  const output_dir = options?.outputDir ?? "dist";

  ensureFolder(output_dir);

  let other_files_lib = "es/index.d.ts\n";
  let other_files_es = "lib/index.d.ts\n";
  let pictograms_index = "";

  const module_names: Array<IconOutput["moduleName"]> = [];
  const deprecated_pictograms = new Map<
    IconOutput["moduleName"],
    { deprecatedTag: string }
  >();

  (metadata as BuildIcons).icons.slice(0, limit).forEach((icon) => {
    if (icon.deprecated) {
      let reason = icon.reason;

      if (/replaced by/.test(reason)) {
        const replacee = reason.split("replaced by").pop()?.trim() ?? "";
        reason = reason.replace(replacee, "`" + toModuleName(replacee) + "`");
      }

      deprecated_pictograms.set(toModuleName(icon.name), {
        deprecatedTag: `/**
 * @deprecated
 * ${reason}
 */\n`,
      });
    }

    icon.output.forEach((output) => {
      const { moduleName, filepath } = output;
      const folder = filepath.split("/");
      const file = folder.pop() ?? "";
      const tsFolder = filepath.replace(file, "");
      const tsFile = file.replace(/.js/, ".d.ts");
      const relativePath = Array.from(
        { length: filepath.split("/").length },
        (_) => "../"
      ).join("");

      module_names.push(moduleName);

      pictograms_index += `export { ${moduleName} } from "../";\n`;
      other_files_lib += `es/${tsFolder}${tsFile}\n`;

      ensureFolder(path.join(output_dir, "es", tsFolder));

      fs.writeFileSync(
        path.join(output_dir, "es", tsFolder, tsFile),
        `export { ${moduleName} as default } from "${relativePath}";\n`
      );

      other_files_es += `lib/${tsFolder}${tsFile}\n`;
      ensureFolder(path.join(output_dir, "lib", tsFolder));

      const libFile = `import { ${moduleName} } from "${relativePath}";

export = ${moduleName};\n`;

      fs.writeFileSync(path.join(output_dir, "lib", tsFolder, tsFile), libFile);
    });
  });

  fs.writeFileSync(path.join(output_dir, "es/index.d.ts"), pictograms_index);
  fs.writeFileSync(path.join(output_dir, "lib/index.d.ts"), pictograms_index);
  fs.writeFileSync(
    path.join(output_dir, "index.d.ts"),
    `/** ${module_names.length} pictograms in total */

export interface CarbonPictogramProps
  extends Omit<
    React.SVGProps<React.ReactSVGElement>,
    "ref" | "tabIndex" | "aria-hidden"
  > {
  "aria-hidden"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  height?: number;
  preserveAspectRatio?: string;
  tabIndex?: string;
  title?: string;
  viewBox?: string;
  width?: number;
  xmlns?: string;
}

export type CarbonPictogramType = React.ForwardRefExoticComponent<
  CarbonPictogramProps & React.RefAttributes<SVGSVGElement>
>;

${module_names
  .map((moduleName) => {
    let deprecatedTag = "";

    if (deprecated_pictograms.has(moduleName)) {
      deprecatedTag = deprecated_pictograms.get(moduleName)!.deprecatedTag;
      console.info("[deprecated]", moduleName);
    }

    return `${deprecatedTag}export const ${moduleName}: CarbonPictogramType;`;
  })
  .join("\n")}
`
  );

  return {
    total: module_names.length,
  };
};
