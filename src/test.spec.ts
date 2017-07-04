import * as chai from 'chai';
import * as mocha from 'mocha';

const expect = chai.expect;
const should = chai.should;
const assert = chai.assert;

import * as colurs from './';
const clrs = colurs.get();

const exp = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

describe('Colurs', () => {

  before((done) => {
    done();
  });

  it('should create ansi colored string.', () => {
    const ansi = clrs.underline.gray('I am underlined gray');
    assert.equal(exp.test(<string>ansi), true);
  });

  it('should convert ansi colored string to html.', () => {
    const expected = '<span style="color:#ff0000;">' +
      '<span style="font-weight:bold;">I am bold red.</span></span>';
    const ansi = clrs.bold.red('I am bold red.');
    const html = clrs.toHtml(<string>ansi);
    assert.equal(html, expected);
  });

  it('should strip color from value.', () => {
    const ansi = clrs.underline.gray('I am underlined gray');
    assert.equal(exp.test(<string>ansi), true);
    const stripped = clrs.strip(ansi);
    assert.equal(exp.test(stripped), false);
  });

  it('should create an instance of Colurs', () => {
    const Colurs = clrs.Colurs;
    const _colurs = new Colurs();
    assert.instanceOf(_colurs, clrs.Colurs);
  });

  it('should create an instance of Colurs where colorization is disabled.', () => {
    const Colurs = clrs.Colurs;
    const _colurs = new Colurs({ enabled: false });
    const ansi = _colurs.bold.red('I am bold red.');
    assert.equal(exp.test(<string>ansi), false);
  });

  it('should return array for console.log colorization.', () => {
    const Colurs = clrs.Colurs;
    const _colurs = new Colurs({ browser: true });
    const styles = _colurs.bold.red('I am bold red.');
    assert.deepEqual(['%c I am bold red.', 'font-weight: bold; color: #FF0000;'], styles);
  });

  it('should create an instance of Colurs then use setOption to disable colorization.', () => {
    clrs.setOption('enabled', false);
    const ansi = clrs.bold.red('I am bold red.');
    assert.equal(exp.test(<string>ansi), false);
  });

  it('should change the default ansi style for the color red.', () => {
    clrs.setOption('ansiStyles', {
      red: [90, 39]
    });
    assert.deepEqual(clrs.options.ansiStyles.red, [90, 39]);
  });

  after((done) => {
    done();
  });

});