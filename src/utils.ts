import fs from "node:fs";

export const ensureFolder = (folder: string) => {
  if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });
  fs.mkdirSync(folder, { recursive: true });
};
