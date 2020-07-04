import { Options } from "./types";

/**
 * Default options
 */

export const defaults: Options = {
  level: "h2",
  allowedTypes: { element: true, jsx: true, text: true },
  prelude: {
    enabled: true,
    tagName: "section",
    properties: {},
  },
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
