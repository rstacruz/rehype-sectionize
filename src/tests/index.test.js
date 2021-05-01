import { h } from "hastscript";
import { plugin as wrap } from "../index";
import toHtml from "hast-util-to-html";

const h2 = (...args) => h("h2", ...args);
const h3 = (...args) => h("h3", ...args);
const p = (...args) => h("p", ...args);
const main = (...args) => h("main", ...args);
const section = (...args) => h("section", ...args);
const div = (...args) => h("div", ...args);

it("works", () => {
  const source = main([
    h2("Introduction"),
    p("Hello there"),
    h2("Thanks"),
    p("That's all"),
  ]);

  const expected = main([
    section([h2("Introduction"), p("Hello there")]),
    section([h2("Thanks"), p("That's all")]),
  ]);

  wrap()(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("no h2", () => {
  const source = main([p("Hello there")]);
  const expected = main([p("Hello there")]);

  wrap()(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("prelude (p's before an h2)", () => {
  const source = main([
    p("Hello there"), //
    p("That's all"),
    h2("Intro"),
  ]);

  const expected = main([
    section([
      p("Hello there"), //
      p("That's all"),
    ]),
    section([
      h2("Intro"), //
    ]),
  ]);

  wrap()(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("add heading class", () => {
  const source = main([
    h2({ class: "intro" }, "Introduction"),
    p("Hello there"),
  ]);

  const expected = main([
    section({ class: "intro" }, [
      h2({ class: "intro" }, "Introduction"),
      p("Hello there"),
    ]),
  ]);

  wrap({ section: { addHeadingClass: true } })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("add heading class to body", () => {
  const source = main([
    h2({ class: "intro" }, "Introduction"),
    p("Hello there"),
  ]);

  const expected = main([
    section({ class: "intro" }, [
      h2({ class: "intro" }, "Introduction"),
      div({ class: "intro" }, [p("Hello there")]),
    ]),
  ]);

  wrap({
    section: { addHeadingClass: true },
    body: { enabled: true, addHeadingClass: true },
  })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("custom body tagName", () => {
  const source = main([
    h2("Introduction"), //
    p("Hello there"),
  ]);

  const expected = main([
    section([
      h2("Introduction"), //
      h("body-section", [
        p("Hello there"), //
      ]),
    ]),
  ]);

  wrap({
    body: { enabled: true, tagName: "body-section" },
  })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("add heading class to existing class", () => {
  const source = main([
    h("h2.intro", "Introduction"), //
    p("Hello there"),
  ]);

  const expected = main([
    h("h2-section.default-class.intro", [
      h("h2.intro", "Introduction"),
      p("Hello there"),
    ]),
  ]);

  wrap({
    section: {
      addHeadingClass: true,
      tagName: "h2-section",
      properties: { className: "default-class" },
    },
  })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("append heading class", () => {
  const source = main([
    h("h2.intro", "Introduction"), //
    p("Hello there"),
  ]);

  const expected = main([
    section({ class: "hey intro" }, [
      h("h2.intro", "Introduction"), //
      p("Hello there"),
    ]),
  ]);

  wrap({
    section: { addHeadingClass: true, properties: { className: "hey" } },
  })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("add body", () => {
  const source = main([
    h2("Introduction"),
    p("Hello there"),
    p("This is an introduction"),
    h2("Thanks"),
    p("That's all"),
  ]);

  const expected = main([
    section([
      h2("Introduction"),
      h("div", [
        p("Hello there"), //
        p("This is an introduction"),
      ]),
    ]),
    section([
      h2("Thanks"), //
      h("div", [p("That's all")]),
    ]),
  ]);

  wrap({ body: { enabled: true } })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("h2 and h3", () => {
  const source = main([
    h2("Introduction"),
    p("Hello there"),
    h3("Hey"),
    p("This is an introduction"),
  ]);

  const expected = main([
    section([
      section([
        h2("Introduction"), //
        p("Hello there"),
      ]),
    ]),
    section([
      h3("Hey"), //
      p("This is an introduction"),
    ]),
  ]);

  wrap([{ level: "h3" }, { level: "h2" }])(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("add body with classes", () => {
  const source = main([
    h2("Introduction"),
    p("Hello there"),
    p("This is an introduction"),
    h2("Thanks"),
    p("That's all"),
  ]);

  const expected = main([
    section([
      h2("Introduction"),
      div({ class: "body" }, [
        p("Hello there"), //
        p("This is an introduction"),
      ]),
    ]),
    section([
      h2("Thanks"), //
      div({ class: "body" }, [p("That's all")]),
    ]),
  ]);

  wrap({ body: { enabled: true, properties: { className: "body" } } })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("h2 and h3: don't absorb upper levels", () => {
  const source = main([
    h2("Introduction"),
    p("Hello there"),
    h3("Hey"),
    p("This is an introduction"),
    h2("Summary"),
    p("This is the summary"),
  ]);

  const expected = main([
    h("h2-section", [
      h2("Introduction"),
      p("Hello there"),
      h("h3-section", [h3("Hey"), p("This is an introduction")]),
    ]),
    h("h2-section", [h2("Summary"), p("This is the summary")]),
  ]);

  wrap([
    { level: "h2", section: { tagName: "h2-section" } },
    {
      level: "h3",
      section: { tagName: "h3-section" },
      prelude: { enabled: false },
    },
  ])(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

describe("prelude", () => {
  it("disabled prelude", () => {
    const source = main([
      p("Prelude"), //
      h2("Introduction"),
      p("Hello there"),
    ]);

    const expected = main([
      p("Prelude"), //
      h("h2-section", [h2("Introduction"), p("Hello there")]),
    ]);

    wrap([
      {
        level: "h2",
        prelude: { enabled: false },
        section: { tagName: "h2-section" },
      },
    ])(source);
    expect(toHtml(source)).toEqual(toHtml(expected));
  });

  it("enabled prelude", () => {
    const source = main([
      p("Prelude"), //
      h2("Introduction"),
      p("Hello there"),
    ]);

    const expected = main([
      h("prelude-section", [p("Prelude")]),
      h("h2-section", [h2("Introduction"), p("Hello there")]),
    ]);

    wrap([
      {
        level: "h2",
        prelude: { enabled: true, tagName: "prelude-section" },
        section: { tagName: "h2-section" },
      },
    ])(source);
    expect(toHtml(source)).toEqual(toHtml(expected));
  });
});
