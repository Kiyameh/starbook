import type { AstroIntegration } from 'astro';
import type { StarbookOptions } from './types.js';

export default function starbook(options: StarbookOptions = {}): AstroIntegration {
  const base = options.base ?? '/_starbook';

  return {
    name: 'starbook',
    hooks: {
      'astro:config:setup': ({ injectRoute, logger }) => {
        logger.info(`Starbook: Initializing wormhole at ${base}/test ...`);

        injectRoute({
          pattern: `${base}/test`,
          entrypoint: 'starbook/src/pages/test.astro',
        });
      },
    },
  };
}
