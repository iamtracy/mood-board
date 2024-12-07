import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run mood-board:serve',
        production: 'nx run mood-board:serve:production',
      },
      ciWebServerCommand: 'nx run mood-board:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
