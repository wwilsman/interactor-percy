# @interactor/percy [![CircleCI](https://circleci.com/gh/wwilsman/interactor-percy.svg?style=svg)](https://circleci.com/gh/wwilsman/interactor-percy)

Take [Percy](https://percy.io) snapshots with [Interactor.js](https://interactorjs.io).

## Usage

First, install `interactor.js` and `@interactor/percy`:

``` sh
$ yarn add --dev interactor.js @interactor/percy
```

Then import and use it in your interactors and tests:

``` javascript
import interactor from 'interactor.js';
import percySnapshot from '@interactor/percy';

// with a custom interactor
@interactor class PageInteractor {
  // ...as an action without args
  snapshot = percySnapshot('My Page');
  // ...or accept and merge other args
  snapshot(title, options) {
    return percySnapshot(`My Page - ${title}`, options);
  }
}

// ...
await new PageInteractor()
  .assert.exists('.page-selector')
  .snapshot('Initial page load')

// use the action directly without custom interactors
await percySnapshot('My Snapshot');
```

Finally, make sure to run your tests with your `PERCY_TOKEN` using the `percy
exec` command:

``` sh
$ export PERCY_TOKEN=<your token here>
$ yarn percy exec -- yarn test
```

### Arguments

**percySnapshot(snapshotName, options)**

- `snapshotName`: a required string that will be used as the snapshot
  name. It can be any string that makes sense to identify the page state. It
  should be unique and remain the same across builds.

- `options`: an optional hash that can include:
  - `widths`: an array of integers representing the browser widths at which
    you want to take snapshots.
  - `minHeight`: an integer specifying the minimum height of the resulting
    snapshot, in pixels. Defaults to 1024px.


## License

[MIT](https://github.com/wwilsman/interactor-percy/blob/master/LICENSE)
