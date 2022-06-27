import { Properties } from "hast";

/** Options */
export type Options = {
  allowedTypes: { [key: string]: boolean };
  level: string;
  prelude: {
    enabled: boolean;
    properties: Properties;
    tagName: string;
  };
  section: {
    addHeadingClass: boolean;
    properties: Properties;
    tagName: string;
  };
  body: {
    addHeadingClass: boolean;
    enabled: boolean;
    properties: Properties;
    tagName: string;
  };
};

export type PartialOptions = Partial<Options> & {
  section?: Partial<Options["section"]>;
  prelude?: Partial<Options["prelude"]>;
  body?: Partial<Options["body"]>;
};
