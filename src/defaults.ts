import { Options } from "./types";

/**
 * Default options
 */

export const defaults: Options = {
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
