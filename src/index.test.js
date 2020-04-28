import h from "hastscript";
import { plugin as wrap } from "./index";
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

it("add heading class", () => {
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

  wrap({ section: { addHeadingClass: true } })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("add body", () => {
  const source = (
    <main>
      <h2>Introduction</h2>
      <p>Hello there</p>
      <p>This is an introduction</p>
      <h2>Thanks</h2>
      <p>That's all</p>
    </main>
  );

  const expected = (
    <main>
      <section>
        <h2>Introduction</h2>
        <div>
          <p>Hello there</p>
          <p>This is an introduction</p>
        </div>
      </section>
      <section>
        <h2>Thanks</h2>
        <div>
          <p>That's all</p>
        </div>
      </section>
    </main>
  );

  wrap({ body: { enabled: true } })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});
