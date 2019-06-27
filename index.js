import PercyAgent from '@percy/agent';
import { scoped } from 'interactor.js';
import { version as interactorVersion } from 'interactor.js/package.json';
import { version as clientVersion } from './package.json';

export default function percySnapshot(name, options = {}) {
  const percyAgentClient = new PercyAgent({
    handleAgentCommunication: false,
    domTransformation: options.domTransformation,
    port: options.port
  });

  return scoped().do(async function() {
    let running = true;

    await fetch(`http://localhost:${percyAgentClient.port}/percy/healthcheck`)
      .catch(err => {
        console.warn('[percy] Percy agent is not running. Skipping snapshots');
        console.warn(err);
        running = false;
      });

    if (running) {
      let doc = this.$dom.document;
      let domSnapshot = percyAgentClient.snapshot(name, { doc, ...options });

      await fetch(`http://localhost:${percyAgentClient.port}/percy/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          url: doc.URL,
          enableJavaScript: options.enableJavaScript,
          widths: options.widths,
          clientInfo: `@interactor/percy/${clientVersion}`,
          environmentInfo: `interactor.js/${interactorVersion}`,
          domSnapshot
        })
      });
    }
  });
}
