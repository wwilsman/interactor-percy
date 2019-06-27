import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default {
  input: 'index.js',
  output: [{
    format: 'umd',
    exports: 'named',
    name: 'InteractorJS.Percy',
    file: pkg.main,
    globals: {
      'interactor.js': 'InteractorJS',
      'interactor.js/package.json': 'InteractorJS'
    }
  }, {
    format: 'es',
    file: pkg.module
  }],
  external: [
    'interactor.js',
    'interactor.js/package.json'
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({ comments: false }),
    json()
  ]
};
