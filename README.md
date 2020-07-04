<h1 align='center'>rehype-sectionize</h1>
<p align='center'>Divide headings into sections</p>

:warning: This is a work in progress.

---

## Usage

```js
require("@rstacruz/rehype-sectionize").plugin(options)(root);
```

## Configuration

| Key                       | Default value                              | Description                                                   |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| `level`                   | `"h2"`                                     | The heading to fix up                                         |
| `allowedTypes`            | `{ element: true, jsx: true, text: true }` | What node types to allow to be placed inside a section        |
|                           |                                            |
| `section.tagName`         | `"section"`                                | Tag name used in the section                                  |
| `section.properties`      | `{}`                                       | Properties to add to the section                              |
| `section.addHeadingClass` | `true`                                     | If true, class names from the H2 will be added to the section |
|                           |                                            |
| `body.enabled`            | `false`                                    | Enables the body wrapper                                      |
| `body.tagName`            | `"div"`                                    | Tag name used in the body inside the section                  |
| `body.properties`         | `{}`                                       | Properties to add to the body wrapper                         |

## Thanks

**rehype-sectionize** © 2020, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[![](https://img.shields.io/github/followers/rstacruz.svg?style=social&label=@rstacruz)](https://github.com/rstacruz) &nbsp;
[![](https://img.shields.io/twitter/follow/rstacruz.svg?style=social&label=@rstacruz)](https://twitter.com/rstacruz)

[mit]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/rehype-sectionize/contributors
