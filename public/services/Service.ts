import { HttpSetup } from 'opensearch-dashboards/public';
import { ServerResponse } from '../../server/models/types';

export interface Service {
  httpClient: HttpSetup;

  get: (...args: any) => Promise<ServerResponse<any>>;
  post: (...args: any) => Promise<ServerResponse<any>>;
  put: (...args: any) => Promise<ServerResponse<any>>;
  delete: (...args: any) => Promise<ServerResponse<any>>;
}
