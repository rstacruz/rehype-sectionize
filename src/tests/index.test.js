import h from "hastscript";
import { plugin as wrap } from "../index";
import toHtml from "hast-util-to-html";

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

it("no h2", () => {
  const source = (
    <main>
      <p>Hello there</p>
    </main>
  );

  const expected = (
    <main>
      <p>Hello there</p>
    </main>
  );

  wrap()(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("prelude (p's before an h2)", () => {
  const source = (
    <main>
      <p>Hello there</p>
      <p>That's all</p>
      <h2>Intro</h2>
    </main>
  );

  const expected = (
    <main>
      <section>
        <p>Hello there</p>
        <p>That's all</p>
      </section>
      <section>
        <h2>Intro</h2>
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

it("append heading class", () => {
  const source = (
    <main>
      <h2 className="intro">Introduction</h2>
      <p>Hello there</p>
    </main>
  );

  const expected = (
    <main>
      <section className="hey intro">
        <h2 className="intro">Introduction</h2>
        <p>Hello there</p>
      </section>
    </main>
  );

  wrap({
    section: { addHeadingClass: true, properties: { className: "hey" } },
  })(source);
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

it("h2 and h3", () => {
  const source = (
    <main>
      <h2>Introduction</h2>
      <p>Hello there</p>
      <h3>Hey</h3>
      <p>This is an introduction</p>
    </main>
  );

  const expected = (
    <main>
      <section>
        <section>
          <h2>Introduction</h2>
          <p>Hello there</p>
        </section>
      </section>
      <section>
        <h3>Hey</h3>
        <p>This is an introduction</p>
      </section>
    </main>
  );

  wrap([{ level: "h3" }, { level: "h2" }])(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});

it("add body with classes", () => {
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
        <div className="body">
          <p>Hello there</p>
          <p>This is an introduction</p>
        </div>
      </section>
      <section>
        <h2>Thanks</h2>
        <div className="body">
          <p>That's all</p>
        </div>
      </section>
    </main>
  );

  wrap({ body: { enabled: true, properties: { className: "body" } } })(source);
  expect(toHtml(source)).toEqual(toHtml(expected));
});
