import path from 'path';
import fs from 'fs';

import {
  compile,
  getCompiler,
  getErrors,
  getExecutedCode,
  getModuleSource,
  getWarnings,
} from './helpers/index';

describe('"url" option', () => {
  it('should work when not specified', async () => {
    const compiler = getCompiler('./url/url.js');
    const stats = await compile(compiler);

    expect(getModuleSource('./url/url.css', stats)).toMatchSnapshot('module');
    expect(getExecutedCode('main.bundle.js', compiler, stats)).toMatchSnapshot(
      'result'
    );
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with a value equal to "true"', async () => {
    const compiler = getCompiler('./url/url.js', { url: true });
    const stats = await compile(compiler);

    expect(getModuleSource('./url/url.css', stats)).toMatchSnapshot('module');
    expect(getExecutedCode('main.bundle.js', compiler, stats)).toMatchSnapshot(
      'result'
    );
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with a value equal to "false"', async () => {
    const compiler = getCompiler('./url/url.js', { url: false });
    const stats = await compile(compiler);

    expect(getModuleSource('./url/url.css', stats)).toMatchSnapshot('module');
    expect(getExecutedCode('main.bundle.js', compiler, stats)).toMatchSnapshot(
      'result'
    );
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with a value equal to "Function"', async () => {
    const compiler = getCompiler('./url/url.js', {
      url: (url, resourcePath) => {
        expect(typeof resourcePath === 'string').toBe(true);

        // Don't handle `img.png`
        if (url.includes('img.png')) {
          return false;
        }

        return true;
      },
    });
    const stats = await compile(compiler);

    expect(getModuleSource('./url/url.css', stats)).toMatchSnapshot('module');
    expect(getExecutedCode('main.bundle.js', compiler, stats)).toMatchSnapshot(
      'result'
    );
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should resolve absolute path', async () => {
    // Create the file with absolute path
    const fileDirectory = path.resolve(__dirname, 'fixtures', 'url');
    const file = path.resolve(fileDirectory, 'url-absolute.css');
    const absoluteUrlpath = path.resolve(fileDirectory, 'img.png');

    const code = `\n.background {background: url(${absoluteUrlpath}); }`;

    fs.writeFileSync(file, code);

    const compiler = getCompiler('./url/url-absolute.js');
    const stats = await compile(compiler);

    expect(getModuleSource('./url/url-absolute.css', stats)).toMatchSnapshot(
      'module'
    );
    expect(getExecutedCode('main.bundle.js', compiler, stats)).toMatchSnapshot(
      'result'
    );
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should emit warning when unresolved import', async () => {
    const compiler = getCompiler('./url/url-unresolved.js');
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });
});
