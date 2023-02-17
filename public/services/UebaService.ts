import { HttpSetup } from 'opensearch-dashboards/public';
import { ServerResponse } from '../../server/models/types';
import { API } from '../../server/utils/constants';
import {
  GetAggregatorsResponse,
  GetDocumentsResponse,
  GetInferencesResponse,
} from '../../server/models/interfaces/Ueba';

export default class UebaService {
  httpClient: HttpSetup;

  constructor(httpClient: HttpSetup) {
    this.httpClient = httpClient;
  }

  getAggregators = async (
    pageSize: number = 10
  ): Promise<ServerResponse<GetAggregatorsResponse>> => {
    const url = `..${API.UEBA_BASE}/aggregator`;
    return (await this.httpClient.get(url, {})) as ServerResponse<GetAggregatorsResponse>;
  };

  getInferences = async (pageSize: number = 10): Promise<ServerResponse<GetInferencesResponse>> => {
    const url = `..${API.UEBA_BASE}/inference`;
    return (await this.httpClient.get(url, {})) as ServerResponse<GetInferencesResponse>;
  };

  getDocuments = async (pageSize: number = 10): Promise<ServerResponse<GetDocumentsResponse>> => {
    const url = `..${API.UEBA_BASE}/documents`;
    return (await this.httpClient.get(url, {})) as ServerResponse<GetDocumentsResponse>;
  };
}
