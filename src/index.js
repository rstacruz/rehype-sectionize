import { visit } from "unist-util-visit";
import { hasChildren, addClass, isHeading } from "./utils.js";
import { defaults } from "./defaults.js";

/**
 * @typedef {import('./types').Node} Node
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').ParentNode} ParentNode
 * @typedef {import('./types').PartialOptions} PartialOptions
 */

/**
 * Rehype plugin
 * @param {PartialOptions | PartialOptions[]} opts
 */

export function plugin(opts = {}) {
  // Account for multiple runs
  if (Array.isArray(opts)) return multi(opts);

  // Merge options and defaults
  /** @type {Options} */
  const options = {
    ...defaults,
    ...opts,
    section: { ...defaults.section, ...opts.section },
    body: { ...defaults.body, ...opts.body },
    prelude: { ...defaults.prelude, ...opts.prelude },
  };

  /**
   * Main run routine
   * @param {Node} root
   * @return {Node}
   */
  function run(root) {
    visit(root, isParent, (/** @type {ParentNode} */ node) => {
      node.children = wrapNodes(node.children);
    });

    // Delete the `_wrapped` flags
    visit(root, (/** @type {Node} */ node) => {
      if (node._wrapped) delete node._wrapped;
    });

    return root;
  }

  /**
   * Wrap nodes into sections
   * @param {Node[]} nodes
   * @return {Node[]}
   * */
  function wrapNodes(nodes) {
    let section, body;

    /** @type {(Node[] | Node)[]} */
    let sections = [];

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

  /**
   * Creates a prelude section.
   * @return {[ParentNode, ParentNode]}
   */
  function createPrelude() {
    // return createSection();

    /* @type {ParentNode} */
    const section = {
      type: "element",
      properties: { ...options.prelude.properties },
      tagName: options.prelude.tagName,
      children: [],
      _wrapped: true,
    };
    return [section, section];
  }

  /**
   * Create a section.
   * @param {Node | void} heading
   * @return {[ParentNode, ParentNode]}
   */

  function createSection(heading) {
    /** @type {ParentNode} */
    const section = {
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
      /** @type {ParentNode} */
      const body = {
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

  /**
   * Checks if a given node should be processed
   * @param {Node} node
   * @return {node is ParentNode}
   */
  function isParent(node) {
    if (node._wrapped) return false;
    if (!node.children) return false;
    if (!Array.isArray(node.children)) return false;
    return !!node.children.find((node) => isHeading(node, options));
  }

  /**
   * Checks if a node can be placed inside a section body
   * @param {Node} node
   * @return {boolean}
   */
  function isChild(node) {
    return options.allowedTypes[node.type];
  }

  return run;
}

/**
 * Run multiple configurations serially
 * @param {PartialOptions[]} optionsList
 */
function multi(optionsList = []) {
  return (/** @type {Node} */ root) => {
    for (let options of optionsList) plugin(options)(root);
    return root;
  };
}
