import fs from "node:fs";

export const ensureFolder = (folder: string) => {
  if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });
  fs.mkdirSync(folder, { recursive: true });
};

export const toModuleName = (name: string) =>
  name
    .replace(/\-+/g, " ")
    .replace(/\.svg/g, "")
    .split(" ")
    .map((_, i) => {
      let first_char = _.slice(0, 1);

      if (i === 0 && first_char.match(/[0-9]|!/)) {
        first_char = "_" + first_char;
      }

      return first_char.toUpperCase() + _.slice(1);
    })
    .join("");
