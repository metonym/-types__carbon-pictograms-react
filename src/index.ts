import type { BuildIcons, IconOutput } from "@carbon/pictograms";
import metadata from "@carbon/pictograms/metadata.json";
import { $ } from "bun";
import path from "node:path";

type Options = {
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

export const genTypes = async (options?: Options) => {
  const limit = options?.limit ?? Infinity;
  const output_dir = options?.outputDir ?? "dist";

  await $`rm -rf ${output_dir} && mkdir ${output_dir}`;

  let pictograms_index = "";

  const buildIcons = metadata as BuildIcons;
  const module_names: Array<IconOutput["moduleName"]> = [];

  type IconsByName = Record<string, BuildIcons["icons"][number]>;

  const icons_by_name: IconsByName = buildIcons.icons.reduce(
    (arr: IconsByName, current) => {
        arr[current.name] = current;
        return arr;
      },
    {}
  );
  const deprecated_pictograms = new Map<
    IconOutput["moduleName"],
    { deprecatedTag: string }
  >();

  buildIcons.icons.slice(0, limit).forEach((icon) => {
    if (icon.deprecated) {
      let reason = icon.reason;

      if (/replaced by/.test(reason)) {
        const replacee = reason.split("replaced by").pop()?.trim() ?? "";
        const replacee_module_name =
          icons_by_name[replacee].output[0].moduleName;

        reason = reason.replace(replacee, `\`${replacee_module_name}\``);
      }

      deprecated_pictograms.set(icon.output[0].moduleName, {
        deprecatedTag: `/**
 * @deprecated
 * ${reason}
 */\n`,
      });
    }

    icon.output.forEach(async (output) => {
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

      await $`mkdir -p ${output_dir}/es/${tsFolder}`;

      await Bun.write(
        path.join(output_dir, "es", tsFolder, tsFile),
        `export { ${moduleName} as default } from "${relativePath}";\n`
      );

      await $`mkdir -p ${output_dir}/lib/${tsFolder}`;

      const libFile = `import { ${moduleName} } from "${relativePath}";

export = ${moduleName};\n`;

      await Bun.write(path.join(output_dir, "lib", tsFolder, tsFile), libFile);
    });
  });

  await Bun.write(path.join(output_dir, "es/index.d.ts"), pictograms_index);
  await Bun.write(path.join(output_dir, "lib/index.d.ts"), pictograms_index);
  await Bun.write(
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
