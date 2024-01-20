declare module "@carbon/pictograms" {
  export type ModuleName = string;

  export type IconOutput = Readonly<{
    moduleName: ModuleName;
    filepath: string;
    descriptor: {
      elem: "svg";
      attrs: {
        xmlns: "http://www.w3.org/2000/svg";
        viewBox: "0 0 32 32";
        fill: "currentColor";
        width: number;
        height: number;
      };
      content: Array<{ elem: string; attrs: object }>;
      name: string;
      size: number;
    };
    size: number;
  }>;

  export type BuildIcons = Readonly<{
    icons: Array<{
      name: string;
      friendlyName: string;
      namespace: [] | [folder: string];
      sizes: Array<string | number>;
      deprecated: boolean;
      reason: string;
      assets: [
        {
          filepath: string;
          source: string;
          optimized: {
            data: string;
            info: {};
            path: string;
          };
        }
      ];
      output: IconOutput[];
      category: string;
    }>;
  }>;
}
