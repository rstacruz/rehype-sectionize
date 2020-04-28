<h1 align='center'>rehype-sectionize</h1>
<p align='center'>Divide headings into sections</p>

:warning: This is a work in progress.

---

## Usage

```js
require("@rstacruz/rehype-sectionize").plugin(options)(root);
```

## Configuration

| Key                  | Default value                              | Description                                            |
| -------------------- | ------------------------------------------ | ------------------------------------------------------ |
| `level`              | `"h2"`                                     | The heading to fix up                                  |
| `allowedTypes`       | `{ element: true, jsx: true, text: true }` | What node types to allow to be placed inside a section |
|                      |                                            |
| `section.tagName`    | `"section"`                                | Tag name used in the section                           |
| `section.properties` | `{}`                                       | Properties to add to the section                       |
|                      |                                            |
| `body.enabled`       | `false`                                    | Enables the body wrapper                               |
| `body.tagName`       | `"div"`                                    | Tag name used in the body inside the section           |
| `body.properties`    | `{}`                                       | Properties to add to the body wrapper                  |
