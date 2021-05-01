/**
 * @typedef {import('./types').Node} Node
 * @typedef {import('./types').Options} Options
 */

/**
 * Checks if a node is not empty
 * @param {Node} node
 * @return {boolean}
 */

export function hasChildren(node) {
  return Array.isArray(node.children) && node.children.length !== 0;
}

/**
 * Add a class name to a node
 * @param {Node} node
 * @param {string} className
 * @return {void}
 */

export function addClass(node, className) {
  if (!node.properties) node.properties = {};

  if (node.properties.className) {
    node.properties.className = `${node.properties.className} ${className}`;
  } else {
    node.properties.className = className;
  }
}

/**
 * Checks if a node is a heading
 * @param {Node} node
 * @param {Options} options
 * @return {boolean}
 */

export function isHeading(node, options) {
  return node.type === "element" && node.tagName === options.level;
}
