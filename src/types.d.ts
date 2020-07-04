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

export type BodyOptions = SectionOptions & {
  enabled: boolean;
};

export type PreludeOptions = {
  enabled: boolean;
  tagName: string;
  properties: { [key: string]: string };
};

/** Options */
export type Options = {
  level: string;
  allowedTypes: { [key: string]: boolean };
  prelude: PreludeOptions;
  section: SectionOptions;
  body: BodyOptions;
};

export type PartialOptions = Partial<Options> & {
  section?: Partial<Options["section"]>;
  prelude?: Partial<Options["prelude"]>;
  body?: Partial<Options["body"]>;
};
