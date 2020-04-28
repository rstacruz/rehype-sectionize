import visit from "unist-util-visit";

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

export const wrap = (opts = {}) => {
  // Merge options
  const options = {
    ...opts,
    section: { ...defaults.section, ...opts.section },
    body: { ...defaults.body, ...opts.body },
  };

  /**
   * @param {Node} root
   */

  const run = (root) => {
    visit(root, canProcess, (node) => {
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
   */

  function canProcess(node) {
    if (node.type !== "element") return false;
    if (node._wrapped) return false;
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
    let section = createSection();
    const sections = [section];

    for (let node of nodes) {
      if (isHeading(node)) {
        // If the previous section has nothing in it, remove it
        if (section.children.length === 0) sections.pop();
        section = createSection(node);
        sections.push(section);
      }

      section.children.push(node);
    }

    return sections;
  };

  /**
   * @param {Node[]} heading
   */

  const createSection = (heading) => {
    const props = { ...options.section.properties };
    let className = undefined;

    // Add H2 class name
    if (options.section.addHeadingClass) {
      if (heading && heading.properties && heading.properties.className) {
        addClass(props, heading.properties.className);
      }
    }

    return {
      type: "element",
      properties: props,
      tagName: options.section.tagName,
      children: [],
      _wrapped: true,
    };
  };

  return run;
};

/**
 * Add a class name
 * @param {{ className?: string }} props
 * @param {string} className
 */

function addClass(props, className) {
  if (props.className) {
    props.className = `${props.className} ${className}`;
  } else {
    props.className = className;
  }
}
