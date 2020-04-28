import visit from "unist-util-visit";

/** @typedef {import('./types').Node} Node */
/** @typedef {import('./types').Options} Options */
/** @typedef {import('./types').ParentNode} ParentNode */
/** @typedef {import('./types').PartialOptions} PartialOptions */

/** @type Options */
const defaults = {
  level: "h2",
  section: {
    addHeadingClass: true,
    tagName: "section",
    properties: {},
  },
  body: {
    enabled: false,
    addHeadingClass: true,
    tagName: "div",
    properties: {},
  },
};

/**
 * @param {PartialOptions[]} optionsList
 */

export const multi = (optionsList = []) => {
  return (/** @type Node */ root) => {
    for (let options of optionsList) plugin(options)(root);
    return root;
  };
};

/**
 * @param {PartialOptions | PartialOptions[]} opts
 */

export const plugin = (opts = {}) => {
  // Account for multiple runs
  if (Array.isArray(opts)) return multi(opts);

  // Merge options and defaults
  const options = {
    ...defaults,
    ...opts,
    section: { ...defaults.section, ...opts.section },
    body: { ...defaults.body, ...opts.body },
  };

  /**
   * @param {Node} root
   */

  const run = (root) => {
    // @ts-ignore
    visit(root, canProcess, (/** @type ParentNode */ node) => {
      node.children = wrapNodes(node.children);
    });

    // Delete the `_wrapped` flags
    visit(root, (node) => {
      if (node._wrapped) delete node._wrapped;
    });

    return root;
  };

  /**
   * @param {Node} node
   * @return {boolean}
   */

  function canProcess(node) {
    if (node.type !== "element") return false;
    if (node._wrapped) return false;
    if (!node.children) return false;
    if (!Array.isArray(node.children)) return false;
    return !!node.children.find(isHeading);
  }

  /**
   * @param {Node} node
   */

  const isHeading = (node) => {
    return node.type === "element" && node.tagName === options.level;
  };

  /**
   * @param {Node[]} nodes
   */

  const wrapNodes = (nodes) => {
    let [section, body] = createSection();
    const sections = [section];

    for (let node of nodes) {
      if (isHeading(node)) {
        // If the previous section has nothing in it, remove it
        if (!hasChildren(body)) sections.pop();
        [section, body] = createSection(node);
        sections.push(section);
        section.children.unshift(node);
      } else {
        if (body.children) body.children.push(node);
      }
    }

    return sections;
  };

  /**
   * @param {Node=} heading
   * return {[Node, Node]}
   */

  const createSection = (heading) => {
    /** @type ParentNode */
    const section = {
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
      /** @type ParentNode */
      const body = {
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
  };

  return run;
};

/**
 * Add a class name to a node.
 * @param {Node} node
 * @param {string} className
 */

function addClass(node, className) {
  if (!node.properties) node.properties = {};

  if (node.properties.className) {
    node.properties.className = `${node.properties.className} ${className}`;
  } else {
    node.properties.className = className;
  }
}

/**
 * Checks if a node is empty.
 * @param {Node} node
 */

function hasChildren(node) {
  return Array.isArray(node.children) && node.children.length !== 0;
}
