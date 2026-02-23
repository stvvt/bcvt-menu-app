import serverConfig from './server';
import type { DatasourceConfig, DatasourceOverrides } from '@/datasources/types';
import path from 'path';

// Base datasource configuration per venue (git tracked)
const datasources: Record<string, DatasourceConfig> = {
  bcvt: { type: 'httpJson', baseUrl: path.join(serverConfig.DATA_BASE_URL, 'bcvt') },
  asenevtsi: { type: 'httpJson', baseUrl: path.join(serverConfig.DATA_BASE_URL, 'asenevtsi') },
  asti: { type: 'httpJson', baseUrl: path.join(serverConfig.DATA_BASE_URL, 'asti') },
};

// Load overrides from datasources.override.ts (gitignored) if present
let overrides: DatasourceOverrides = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  overrides = require('./datasources.override').datasourceOverrides ?? {};
} catch {
  // No override file — use base config as-is
}

export function getVenueDatasource(venueId: string): DatasourceConfig {
  const base = datasources[venueId];
  if (!base) {
    throw new Error(`No datasource configured for venue: ${venueId}`);
  }

  const defaultOverride = overrides.default;
  const venueOverride = overrides[venueId];

  if (!defaultOverride && !venueOverride) {
    return base;
  }

  return { ...base, ...defaultOverride, ...venueOverride } as DatasourceConfig;
}
