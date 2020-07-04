import { Node as UnistNode } from "unist";

export type LeafNode = UnistNode & {
  properties?: { [key: string]: string };
};

export type ParentNode = LeafNode & {
  tagName: string;
  children: Node[];
};

export type Node = LeafNode | ParentNode;

export type SectionOptions = {
  addHeadingClass: boolean;
  tagName: string;
  properties: { [key: string]: string };
};

export type BodyOptions = {};

export type PreludeOptions = {};

/** Options */
export type Options = {
  level: string;
  allowedTypes: { [key: string]: boolean };
  prelude: {
    enabled: boolean;
    tagName: string;
    properties: { [key: string]: string };
  };
  section: SectionOptions;
  body: {
    enabled: boolean;
    addHeadingClass: boolean;
    tagName: string;
    properties: { [key: string]: string };
  };
};

export type PartialOptions = Partial<Options> & {
  section?: Partial<Options["section"]>;
  prelude?: Partial<Options["prelude"]>;
  body?: Partial<Options["body"]>;
};
