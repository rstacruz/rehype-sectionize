import u from "unist-builder";
import { h } from "hastscript";
import { plugin as wrap } from "../index";
import toHtml from "hast-util-to-html";

it("works with builder", () => {
  const source = u("root", [
    h("h2", "Introduction"),
    h("p", "Hello there"),
    h("h2", "Thanks"),
    h("p", "That is all"),
  ]);

  const expected = u("root", [
    h("section", [h("h2", "Introduction"), h("p", "Hello there")]),
    h("section", [h("h2", "Thanks"), h("p", "That is all")]),
  ]);

  wrap()(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("with unknown node", () => {
  const source = u("root", [
    h("h2", "Introduction"),
    h("p", "Hello there"),
    u("unknown", `xyz`),
    h("h2", "Thanks"),
    h("p", "That is all"),
  ]);

  const expected = u("root", [
    h("section", [h("h2", "Introduction"), h("p", "Hello there")]),
    u("unknown", `xyz`),
    h("section", [h("h2", "Thanks"), h("p", "That is all")]),
  ]);

  wrap()(source);
  expect(source).toEqual(expected);
});
