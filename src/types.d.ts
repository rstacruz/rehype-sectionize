import { Node as UnistNode } from "unist";

export type LeafNode = UnistNode & {
  properties?: { [key: string]: string };
};

export type ParentNode = LeafNode & {
  tagName: string;
  children: Node[];
};

export type Node = LeafNode | ParentNode;

/** Options */
export type Options = {
  allowedTypes: { [key: string]: boolean };
  level: string;
  prelude: {
    enabled: boolean;
    properties: { [key: string]: string };
    tagName: string;
  };
  section: {
    addHeadingClass: boolean;
    properties: { [key: string]: string };
    tagName: string;
  };
  body: {
    addHeadingClass: boolean;
    enabled: boolean;
    properties: { [key: string]: string };
    tagName: string;
  };
};

export type PartialOptions = Partial<Options> & {
  section?: Partial<Options["section"]>;
  prelude?: Partial<Options["prelude"]>;
  body?: Partial<Options["body"]>;
};
