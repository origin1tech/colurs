
/**
 * TS-Node
 * Helper file to setup ts-node for testing.
 * @see https://github.com/TypeStrong/ts-node#configuration-options
 */

const tsnode = require('ts-node');

// Options
const opts = {
  project: './src/tsconfig.spec.json'
};

// Register ts-node.
tsnode.register(opts);