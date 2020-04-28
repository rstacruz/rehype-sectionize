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

export type Options = {
  level: string;
  section: SectionOptions;
  body: BodyOptions;
};

export type PartialOptions = {
  level?: string;
  section?: Partial<SectionOptions>;
  body?: Partial<BodyOptions>;
};
