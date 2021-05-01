import { visit } from "unist-util-visit";
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
    prelude: { ...defaults.prelude, ...opts.prelude },
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

  /** Wrap nodes into sections */
  function wrapNodes(nodes: Node[]): Node[] {
    let section, body;
    let sections: (Node[] | Node)[] = [];

    if (options.prelude.enabled) {
      [section, body] = createPrelude();
      sections.push(section);
    }

    for (let node of nodes) {
      if (isHeading(node, options)) {
        // If the previous section has nothing in it, remove it
        if (body && !hasChildren(body)) sections.pop();
        [section, body] = createSection(node);
        sections.push(section);
        section.children.unshift(node);
      } else if (isChild(node)) {
        if (!body) {
          // Prelude mode:
          // the nodes go to the top level if prelude.enabled: false.
          sections.push(node);
        } else if (body.children) {
          body.children.push(node);
        }
      } else {
        sections.push(node);
      }
    }

    return sections.flat(1);
  }

  /** Creates a prelude section. */
  function createPrelude(): [ParentNode, ParentNode] {
    // return createSection();

    const section: ParentNode = {
      type: "element",
      properties: { ...options.prelude.properties },
      tagName: options.prelude.tagName,
      children: [],
      _wrapped: true,
    };
    return [section, section];
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

    const headingClass =
      heading && heading.properties && heading.properties.className;

    // Add H2 class name
    if (headingClass) addClass(section, headingClass);

    // Create the body
    if (options.body.enabled) {
      const body: ParentNode = {
        type: "element",
        tagName: options.body.tagName,
        properties: { ...options.body.properties },
        children: [],
        _wrapped: true,
      };

      // Add H2 class anme
      if (headingClass && options.body.addHeadingClass) {
        addClass(body, headingClass);
      }

      section.children = [body];
      return [section, body];
    } else {
      return [section, section];
    }
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

  return run;
}

/** Run multiple configurations serially */
function multi(optionsList: PartialOptions[] = []) {
  return (root: Node) => {
    for (let options of optionsList) plugin(options)(root);
    return root;
  };
}
