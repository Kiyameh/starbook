import { fileURLToPath } from 'node:url';

import type { AstroIntegration } from 'astro';
import type { StarbookOptions } from './types.js';

/** Absolute path to the injected route (resolves from dist/ at runtime). */
const wormholeTestPage = fileURLToPath(new URL('../src/pages/test.astro', import.meta.url));

export default function starbook(options: StarbookOptions = {}): AstroIntegration {
  const base = options.base ?? '/_starbook';

  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({ injectRoute, logger }) => {
        logger.info(`Starbook: Initializing wormhole at ${base}/test ...`);

        injectRoute({
          pattern: `${base}/test`,
          entrypoint: wormholeTestPage,
        });
      },
    },
  };
}
