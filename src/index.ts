import visit from "unist-util-visit";
import { Node, Options, ParentNode, PartialOptions } from "./types";
import { hasChildren, addClass, isHeading } from "./utils";
import { defaults } from "./defaults";

/**
 * Rehype plugin
 */

export function plugin(opts: PartialOptions | PartialOptions[] = {}) {
  // Account for multiple runs
  if (Array.isArray(opts)) return multi(opts);

  // Merge options and defaults
  const options: Options = {
    ...defaults,
    ...opts,
    section: { ...defaults.section, ...opts.section },
    body: { ...defaults.body, ...opts.body },
  };

  /** Main run routine */
  function run(root: Node): Node {
    visit(root, isParent as any, (node: ParentNode) => {
      node.children = wrapNodes(node.children);
    });

    // Delete the `_wrapped` flags
    visit(root, (node: Node) => {
      if (node._wrapped) delete node._wrapped;
    });

    return root;
  }

  /** Checks if a given node should be processed */
  function isParent(node: Node): boolean {
    if (node._wrapped) return false;
    if (!node.children) return false;
    if (!Array.isArray(node.children)) return false;
    return !!node.children.find((node) => isHeading(node, options));
  }

  /** Checks if a node can be placed inside a section body */
  function isChild(node: Node): boolean {
    return options.allowedTypes[node.type];
  }

  /** Wrap nodes into sections */
  function wrapNodes(nodes: Node[]): Node[] {
    let [section, body] = createSection();
    const sections: (Node[] | Node)[] = [section];

    for (let node of nodes) {
      if (isHeading(node, options)) {
        // If the previous section has nothing in it, remove it
        if (!hasChildren(body)) sections.pop();
        [section, body] = createSection(node);
        sections.push(section);
        section.children.unshift(node);
      } else if (isChild(node)) {
        if (body.children) body.children.push(node);
      } else {
        sections.push(node);
      }
    }

    return sections.flat(1);
  }

  /** Create a section. */
  function createSection(heading: Node | void): [ParentNode, ParentNode] {
    const section: ParentNode = {
      type: "element",
      properties: { ...options.section.properties },
      tagName: options.section.tagName,
      children: [],
      _wrapped: true,
    };

    // Add H2 class name
    if (options.section.addHeadingClass) {
      if (heading && heading.properties && heading.properties.className) {
        addClass(section, heading.properties.className);
      }
    }

    // TODO options.body.addHeadingClass
    if (options.body.enabled) {
      const body: ParentNode = {
        type: "element",
        tagName: "div",
        children: [],
        _wrapped: true,
      };

      section.children = [body];
      return [section, body];
    } else {
      return [section, section];
    }
  }

  return run;
}

/** Run multiple configurations serially */
function multi(optionsList: PartialOptions[] = []) {
  return (root: Node) => {
    for (let options of optionsList) plugin(options)(root);
    return root;
  };
}
