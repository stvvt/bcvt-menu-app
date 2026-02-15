import { getVenueOrThrow } from '@/config/venues';
import type { Datasource, DatasourceConfig } from './types';
import { HttpJsonDatasource } from './httpJson';
import { FileDatasource } from './file';
import { DatabaseDatasource } from './database';
import { RestApiDatasource } from './restApi';

function createDatasource(config: DatasourceConfig): Datasource {
  switch (config.type) {
    case 'httpJson':
      return new HttpJsonDatasource(config.baseUrl);
    case 'file':
      return new FileDatasource(config.basePath);
    case 'database':
      return new DatabaseDatasource(config.connectionString);
    case 'restApi':
      return new RestApiDatasource(config.baseUrl, config.apiKey);
  }
}

export function getDatasource(venueId: string): Datasource {
  const venue = getVenueOrThrow(venueId);
  return createDatasource(venue.datasource);
}
