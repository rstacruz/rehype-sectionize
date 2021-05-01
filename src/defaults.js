/**
 * @typedef {import('./types').Options} Options
 */

/**
 * Default options
 * @type {Options}
 */

export const defaults = {
  level: "h2",
  allowedTypes: { element: true, jsx: true, text: true },
  prelude: {
    enabled: true,
    properties: {},
    tagName: "section",
  },
  section: {
    addHeadingClass: true,
    properties: {},
    tagName: "section",
  },
  body: {
    addHeadingClass: false,
    enabled: false,
    properties: {},
    tagName: "div",
  },
};
