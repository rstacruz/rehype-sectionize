import { visit } from "unist-util-visit";
import { hasChildren, addClass, isHeading } from "./utils.js";
import { defaults } from "./defaults.js";

/**
 * @typedef {import('hast').ElementContent} ElementContent - element or comment or text
 * @typedef {import('hast').Element} Element
 * @typedef {Element & { _wrapped?: boolean }} ElementExt - with extra state
 * @typedef {import('./types').Options} Options
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
   * @param {Element} root
   * @return {Element}
   */
  function run(root) {
    /** @type {any} */ (visit)(
      root,
      isParent,
      (/** @type {Element} */ node) => {
        node.children = wrapNodes(node.children);
      }
    );

    // Delete the `_wrapped` flags
    visit(root, (/** @type {any} */ node) => {
      if (node._wrapped) delete node._wrapped;
    });

    return root;
  }

  /**
   * Wrap nodes into sections
   * @param {ElementContent[]} nodes
   * @return {ElementContent[]}
   * */
  function wrapNodes(nodes) {
    let section, body;

    /** @type {(ElementContent[] | ElementContent)[]} */
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
   * @return {[Element, Element]}
   */
  function createPrelude() {
    /** @type {ElementExt} */
    const section = {
      type: "element",
      tagName: options.prelude.tagName,
      properties: { ...options.prelude.properties },
      children: [],
      _wrapped: true,
    };
    return [section, section];
  }

  /**
   * Create a section.
   * @param {Element | void} heading
   * @return {[Element, Element]}
   */

  function createSection(heading) {
    /** @type {ElementExt} */
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
    if (headingClass) addClass(section, headingClass.toString());

    // Create the body
    if (options.body.enabled) {
      /** @type {ElementExt} */
      const body = {
        type: "element",
        tagName: options.body.tagName,
        properties: { ...options.body.properties },
        children: [],
        _wrapped: true,
      };

      // Add H2 class name
      if (headingClass && options.body.addHeadingClass) {
        addClass(body, headingClass.toString());
      }

      section.children = [body];
      return [section, body];
    } else {
      return [section, section];
    }
  }

  /**
   * Checks if a given node should be processed
   * @param {Element} node
   * @return {boolean}
   */
  function isParent(node) {
    if (/** @type {any} */ (node)._wrapped) return false;
    if (!node.children) return false;
    if (!Array.isArray(node.children)) return false;
    return !!node.children.find((node) => isHeading(node, options));
  }

  /**
   * Checks if a node can be placed inside a section body
   * @param {ElementContent} node
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
  return (/** @type {Element} */ root) => {
    for (let options of optionsList) plugin(options)(root);
    return root;
  };
}
