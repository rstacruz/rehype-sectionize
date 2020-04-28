import { Node, Options } from "./types";

/**
 * Checks if a node is not empty
 */

export function hasChildren(node: Node): boolean {
  return Array.isArray(node.children) && node.children.length !== 0;
}

/**
 * Add a class name to a node
 */

export function addClass(node: Node, className: string): void {
  if (!node.properties) node.properties = {};

  if (node.properties.className) {
    node.properties.className = `${node.properties.className} ${className}`;
  } else {
    node.properties.className = className;
  }
}

/**
 * Checks if a node is a heading
 */

export function isHeading(node: Node, options: Options): boolean {
  return node.type === "element" && node.tagName === options.level;
}
