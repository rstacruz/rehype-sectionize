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

/** Options */
export type Options = {
  level: string;
  allowedTypes: { [key: string]: boolean };
  section: SectionOptions;
  body: BodyOptions;
};

export type PartialOptions = Partial<Options> & {
  section?: Partial<SectionOptions>;
  body?: Partial<BodyOptions>;
};
