import PercyAgent from '@percy/agent';
import { scoped } from 'interactor.js';
import { version as interactorVersion } from 'interactor.js/package.json';
import { version as clientVersion } from './package.json';

let agentRunning = true;

export default function percySnapshot(name, options = {}) {
  const percyAgentClient = new PercyAgent({
    handleAgentCommunication: false,
    domTransformation: options.domTransformation,
    port: options.port
  });

  return scoped().do(function() {
    // don't bother if we already know agent is not running
    if (agentRunning) {
      let doc = this.$dom.document;
      let domSnapshot = percyAgentClient.snapshot(name, { doc, ...options });

      // not awaited on to allow sending snapshots in parallel
      fetch(`http://localhost:${percyAgentClient.port}/percy/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          url: doc.URL,
          enableJavaScript: options.enableJavaScript,
          widths: options.widths,
          minHeight: options.minHeight,
          clientInfo: `@interactor/percy/${clientVersion}`,
          environmentInfo: `interactor.js/${interactorVersion}`,
          domSnapshot
        })
      }).catch(() => {
        // another check in case multiple snapshots were sent in succession
        if (agentRunning) {
          console.warn('[percy] Percy agent is not running. Skipping snapshots');
          agentRunning = false;
        }
      });
    }
  });
}
