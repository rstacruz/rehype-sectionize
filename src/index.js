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

export const multi = (optionsList = []) => {
  return (root) => {
    for (let options of optionsList) plugin(options)(root);
    return root;
  };
};

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
    if (!node.children) return false;
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
        if (body.children.length === 0) sections.pop();
        [section, body] = createSection(node);
        sections.push(section);
        section.children.unshift(node);
      } else {
        body.children.push(node);
      }
    }

    return sections;
  };

  /**
   * @param {Node[]} heading
   * @return {[Node, Node]}
   */

  const createSection = (heading) => {
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
        addClass(section.properties, heading.properties.className);
      }
    }

    // TODO options.body.addHeadingClass
    if (options.body.enabled) {
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
