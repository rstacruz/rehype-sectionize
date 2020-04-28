import h from "hastscript";
import { wrap } from "./index";
import toHtml from "hast-util-to-html";
import produce from "immer";

it("works", () => {
  const source = (
    <main>
      <h2>Introduction</h2>
      <p>Hello there</p>
      <h2>Thanks</h2>
      <p>That's all</p>
    </main>
  );

  const expected = (
    <main>
      <section>
        <h2>Introduction</h2>
        <p>Hello there</p>
      </section>
      <section>
        <h2>Thanks</h2>
        <p>That's all</p>
      </section>
    </main>
  );

  wrap()(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it.only("add heading class", () => {
  const source = (
    <main>
      <h2 className="intro">Introduction</h2>
      <p>Hello there</p>
    </main>
  );

  const expected = (
    <main>
      <section className="intro">
        <h2 className="intro">Introduction</h2>
        <p>Hello there</p>
      </section>
    </main>
  );

  wrap()(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});
