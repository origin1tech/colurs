# Colurs

Simple utility for colorizing strings using ANSI styles, css styles for the browser and/or converting to html styled elements all with only ONE dependency.

Nothing fancy just a stripped down Chalk or Colors written in Typescript and in a way we find useful without some of the extras. For example there are no "bright" colors.

## Installation

```sh
$ npm install colurs
```

## Usage

**Base Usage**

```ts
// Import the module.
import * as colurs from 'colurs';

// Gets default instance.
const clrs = colurs.get();

// Create a string where the name "Bob" is in bold red.
let str = `My name is ${clrs.bold.red('Bob')}.`;

// With additional values
let str = `My name is ${clrs.bold.red('Bob', 'some value to append')}.`;

// Instead of ansi styling return array configured for
// use with console.log in the browser. Not the LAST
// argument indicates the browser stying should be returned.
let str = `My name is ${clrs.bold.red('Bob', true)}.`;
```

**Convert to HTML**

```ts
// Assumes str was generated such as colurs.red('some value').
let htmlStr = clrs.toHtml(str);

// If jQuery on window convert to element.
const el = window.jQuery(html);
```

**Using Apply**

You can also call the internal method directly. This is useful and more handy in certain scenarios.

```ts
// Apply your styles.
let name = clrs.applyAnsi('Bob Smith', 'bgRed', 'white');

// OR

let name = clrs.applyAnsi('Bob Smith', ['bgRed', 'white']);
```

**Using Apply Html**

Much like the above it is also possible in one step to apply ANSI styles and convert them to stylized html elements.

```ts
let name = clrs.applyHtml('Bob Smith', 'bgRed', 'white');

// OR

let name = clrs.applyHtml('Bob Smith', ['bgRed', 'white']);
```

## Strip Color

Applicable only for ANSI styles, Colurs exposes the strip method for stripping color from a colorized value.
It also supports objects by iterating and inspecting values which contain .replace methods to strip colors.

```ts
// Create colorized string.
let str = `My name is ${clrs.bold.red('Bob')}.`;

let sripped = clrs.strip(str);
```

## Options

Available options:

- enabled whether or not to colorize values.
- browser whether or not to enable browser mode (true when NOT node)
- ansiStyles object containing ansi color tuples.
- cssStyles object contaiing css styles by color or bgColor name.

Simply call the setOption method.

```ts
clrs.setOption('enabled', false);

// OR

clrs.setOption({ enabled: false });
```

## Colurs Instance

You can also create an instance of Colurs. The module is initialized with a default instance
however you can create a new instance if required.

```ts
import { Colurs } from 'colurs';

const clrs = new Colurs({ /* your options here */});
```

## License

See [LICENSE.md](License.md)



